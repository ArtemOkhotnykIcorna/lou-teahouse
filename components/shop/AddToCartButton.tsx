"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { Button } from "@/components/ui/Button";

interface AddToCartButtonProps {
  product: {
    productId: string;
    name: string;
    price: number;
    image: string;
    slug: string;
  };
  inStock: boolean;
}

export function AddToCartButton({ product, inStock }: AddToCartButtonProps) {
  const { addItem } = useCart();

  if (!inStock) {
    return (
      <Button disabled size="lg" className="opacity-50">
        Немає в наявності
      </Button>
    );
  }

  return (
    <Button
      size="lg"
      onClick={() => addItem(product)}
      className="gap-2"
    >
      <ShoppingBag className="w-5 h-5" />
      Додати до кошика
    </Button>
  );
}
