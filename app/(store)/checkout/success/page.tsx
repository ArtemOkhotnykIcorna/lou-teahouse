import { CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { getDb } from "@/lib/db";
import { formatPrice } from "@/lib/utils";

interface SuccessPageProps {
  searchParams: Promise<{ order?: string }>;
}

const paymentLabels: Record<string, string> = {
  paid: "Оплачено",
  pending: "Очікує оплати",
  awaiting_cod: "Оплата при отриманні",
  failed: "Оплата не вдалась",
};

const deliveryLabels: Record<string, string> = {
  pickup: "Самовивіз",
  nova_poshta: "Нова Пошта",
};

export default async function CheckoutSuccessPage({
  searchParams,
}: SuccessPageProps) {
  const { order: orderNumber } = await searchParams;
  const db = await getDb();

  const order = orderNumber
    ? await db.order.findUnique({ where: { orderNumber } })
    : null;

  return (
    <div className="py-20">
      <AnimatedSection className="max-w-lg mx-auto px-4 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-tea-100 flex items-center justify-center">
          {order?.paymentStatus === "pending" ? (
            <Clock className="w-10 h-10 text-tea-600" />
          ) : (
            <CheckCircle className="w-10 h-10 text-tea-600" />
          )}
        </div>
        <h1 className="font-serif text-4xl text-tea-900 mb-4">
          {order?.paymentStatus === "pending"
            ? "Замовлення створено"
            : "Дякуємо за замовлення!"}
        </h1>
        {orderNumber && (
          <p className="text-tea-600 mb-2">
            Номер замовлення:{" "}
            <span className="font-medium text-tea-800">{orderNumber}</span>
          </p>
        )}

        {order && (
          <div className="mt-6 p-5 rounded-2xl bg-cream-100/80 text-left space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-tea-500">Сума</span>
              <span className="font-medium text-tea-900">
                {formatPrice(order.total)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-tea-500">Оплата</span>
              <span className="text-tea-800">
                {paymentLabels[order.paymentStatus] ?? order.paymentStatus}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-tea-500">Доставка</span>
              <span className="text-tea-800">
                {deliveryLabels[order.deliveryMethod] ?? order.deliveryMethod}
              </span>
            </div>
            <div className="pt-2 border-t border-cream-200">
              <p className="text-tea-500">Адреса</p>
              <p className="text-tea-800">
                {order.city}, {order.address}
              </p>
            </div>
          </div>
        )}

        <p className="text-tea-600/70 mt-6 mb-8">
          {order?.paymentMethod === "online" && order.paymentStatus === "pending"
            ? "Якщо оплата не пройшла, спробуйте ще раз або оберіть оплату при отриманні."
            : "Ми зв'яжемося з вами найближчим часом для підтвердження."}
        </p>
        <Button href="/shop">Продовжити покупки</Button>
      </AnimatedSection>
    </div>
  );
}
