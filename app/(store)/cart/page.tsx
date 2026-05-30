"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice, totalItems } =
    useCart();

  return (
    <div className="py-12 lg:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <h1 className="font-serif text-4xl text-tea-900 mb-8">Кошик</h1>
        </AnimatedSection>

        {items.length === 0 ? (
          <AnimatedSection className="text-center py-20">
            <ShoppingBag className="w-16 h-16 text-cream-300 mx-auto mb-4" />
            <p className="text-tea-600 text-lg mb-6">Ваш кошик порожній</p>
            <Button href="/shop">Перейти до магазину</Button>
          </AnimatedSection>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <motion.div
                    key={item.productId}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="flex gap-4 p-4 rounded-2xl bg-cream-100/60"
                  >
                    <Link
                      href={`/product/${item.slug}`}
                      className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0"
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/product/${item.slug}`}
                        className="font-medium text-tea-900 hover:text-tea-700 transition-colors"
                      >
                        {item.name}
                      </Link>
                      <p className="text-tea-600 mt-1">
                        {formatPrice(item.price)}
                      </p>
                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.quantity - 1
                              )
                            }
                            className="w-8 h-8 rounded-full bg-cream-200 flex items-center justify-center hover:bg-cream-300 transition-colors"
                          >
                            <Minus className="w-4 h-4 text-tea-700" />
                          </button>
                          <span className="font-medium text-tea-800 w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.quantity + 1
                              )
                            }
                            className="w-8 h-8 rounded-full bg-cream-200 flex items-center justify-center hover:bg-cream-300 transition-colors"
                          >
                            <Plus className="w-4 h-4 text-tea-700" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="ml-auto p-2 text-tea-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="font-medium text-tea-900 self-center">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="border-t border-cream-200 pt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-tea-600">
                  Товарів: {totalItems}
                </span>
              </div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg text-tea-700">Разом</span>
                <span className="font-serif text-3xl text-tea-900">
                  {formatPrice(totalPrice)}
                </span>
              </div>
              <Button href="/checkout" size="lg" className="w-full">
                Оформити замовлення
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
