"use client";

import { useCart } from "@/components/cart/CartProvider";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export default function CheckoutPage() {
  const { items, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-tea-600 text-lg mb-6">Кошик порожній</p>
        <Button href="/shop">Перейти до магазину</Button>
      </div>
    );
  }

  return (
    <div className="py-12 lg:py-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <h1 className="font-serif text-4xl text-tea-900 mb-2">
            Оформлення замовлення
          </h1>
          <p className="text-tea-600 mb-8">Сума: {formatPrice(totalPrice)}</p>
        </AnimatedSection>

        <CheckoutForm />
      </div>
    </div>
  );
}
