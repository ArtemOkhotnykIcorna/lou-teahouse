import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";

const paymentLabels: Record<string, string> = {
  paid: "Оплачено",
  pending: "Очікує оплати",
  awaiting_cod: "При отриманні",
  failed: "Помилка оплати",
};

const deliveryLabels: Record<string, string> = {
  pickup: "Самовивіз",
  nova_poshta: "Нова Пошта",
};

const paymentMethodLabels: Record<string, string> = {
  online: "Monopay",
  cod: "При отриманні",
};

export default async function AdminOrdersPage() {
  const orders = await db.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: { include: { product: true } },
    },
  });

  return (
    <div>
      <h1 className="font-serif text-3xl text-tea-900 mb-8">Замовлення</h1>

      {orders.length === 0 ? (
        <p className="text-tea-600">Замовлень поки немає</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-cream-50 rounded-2xl border border-cream-200 p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <p className="font-medium text-tea-900 text-lg">
                    {order.orderNumber}
                  </p>
                  <p className="text-sm text-tea-600">
                    {new Date(order.createdAt).toLocaleDateString("uk-UA", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-serif text-xl text-tea-900">
                    {formatPrice(order.total)}
                  </p>
                  <OrderStatusSelect
                    orderId={order.id}
                    currentStatus={order.status}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs px-2.5 py-1 rounded-full bg-cream-200 text-tea-700">
                  {deliveryLabels[order.deliveryMethod] ?? order.deliveryMethod}
                </span>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full ${
                    order.paymentStatus === "paid"
                      ? "bg-green-100 text-green-700"
                      : order.paymentStatus === "failed"
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {paymentMethodLabels[order.paymentMethod]} ·{" "}
                  {paymentLabels[order.paymentStatus] ?? order.paymentStatus}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-tea-500 mb-1">Клієнт</p>
                  <p className="text-tea-900">{order.customerName}</p>
                  <p className="text-tea-600">{order.customerEmail}</p>
                  <p className="text-tea-600">{order.customerPhone}</p>
                </div>
                <div>
                  <p className="text-tea-500 mb-1">Доставка</p>
                  <p className="text-tea-900">
                    {order.city}, {order.address}
                  </p>
                  {order.npWarehouseName && order.deliveryMethod === "nova_poshta" && (
                    <p className="text-tea-600 text-xs mt-1">
                      {order.npWarehouseName}
                    </p>
                  )}
                  {order.notes && (
                    <p className="text-tea-600 mt-1 italic">{order.notes}</p>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-cream-200">
                <p className="text-tea-500 text-sm mb-2">Товари</p>
                <div className="space-y-1">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-tea-800">
                        {item.product.name} × {item.quantity}
                      </span>
                      <span className="text-tea-600">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
