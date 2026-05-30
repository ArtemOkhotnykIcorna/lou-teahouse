"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { generateOrderNumber } from "@/lib/utils";
import { createMonobankInvoice, getAppUrl } from "@/lib/monobank";
import { PICKUP_ADDRESS, PICKUP_CITY } from "@/lib/novaposhta";

interface CartItem {
  productId: string;
  quantity: number;
}

export type PaymentMethod = "online" | "cod";
export type DeliveryMethod = "pickup" | "nova_poshta";

export async function createOrder(data: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes?: string;
  paymentMethod: PaymentMethod;
  deliveryMethod: DeliveryMethod;
  npCityRef?: string;
  npCityName?: string;
  npWarehouseRef?: string;
  npWarehouseName?: string;
  items: CartItem[];
}) {
  if (!data.items.length) {
    throw new Error("Кошик порожній");
  }

  if (data.deliveryMethod === "nova_poshta") {
    if (!data.npCityRef || !data.npWarehouseRef || !data.npWarehouseName) {
      throw new Error("Оберіть місто та відділення Нової Пошти");
    }
  }

  const productIds = data.items.map((i) => i.productId);
  const products = await db.product.findMany({
    where: { id: { in: productIds } },
  });

  const productMap = new Map(products.map((p) => [p.id, p]));
  let total = 0;

  const orderItems = data.items.map((item) => {
    const product = productMap.get(item.productId);
    if (!product) throw new Error("Product not found");
    total += product.price * item.quantity;
    return {
      productId: item.productId,
      quantity: item.quantity,
      price: product.price,
      product,
    };
  });

  const city =
    data.deliveryMethod === "pickup"
      ? PICKUP_CITY
      : (data.npCityName ?? "");

  const address =
    data.deliveryMethod === "pickup"
      ? PICKUP_ADDRESS
      : data.npWarehouseName!;

  const orderNumber = generateOrderNumber();
  const paymentStatus =
    data.paymentMethod === "online" ? "pending" : "awaiting_cod";

  const order = await db.order.create({
    data: {
      orderNumber,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      city,
      address,
      notes: data.notes || null,
      total,
      paymentMethod: data.paymentMethod,
      paymentStatus,
      deliveryMethod: data.deliveryMethod,
      npCityRef: data.npCityRef ?? null,
      npCityName: data.npCityName ?? null,
      npWarehouseRef: data.npWarehouseRef ?? null,
      npWarehouseName: data.npWarehouseName ?? null,
      items: {
        create: orderItems.map(({ productId, quantity, price }) => ({
          productId,
          quantity,
          price,
        })),
      },
    },
  });

  revalidatePath("/admin/orders");

  if (data.paymentMethod === "online") {
    const appUrl = getAppUrl();
    const invoice = await createMonobankInvoice({
      amount: total,
      orderNumber: order.orderNumber,
      basket: orderItems.map(({ product, quantity, price }) => ({
        name: product.name,
        qty: quantity,
        sum: price,
        total: price * quantity,
      })),
      redirectUrl: `${appUrl}/checkout/success?order=${order.orderNumber}`,
      webHookUrl: `${appUrl}/api/monobank/webhook`,
    });

    await db.order.update({
      where: { id: order.id },
      data: { monoInvoiceId: invoice.invoiceId },
    });

    redirect(invoice.pageUrl);
  }

  redirect(`/checkout/success?order=${order.orderNumber}`);
}
