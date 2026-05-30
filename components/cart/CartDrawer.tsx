"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export function CartDrawer() {
  const {
    items,
    isOpen,
    setIsOpen,
    removeItem,
    updateQuantity,
    totalPrice,
    totalItems,
  } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-tea-900/30 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-cream-50 z-50 shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-cream-200">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-tea-700" />
                <h2 className="font-serif text-xl text-tea-900">
                  Кошик ({totalItems})
                </h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-cream-200 transition-colors"
              >
                <X className="w-5 h-5 text-tea-600" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-4">
                  <ShoppingBag className="w-16 h-16 text-cream-300" />
                  <p className="text-tea-600">Кошик порожній</p>
                  <Button
                    variant="secondary"
                    onClick={() => setIsOpen(false)}
                    href="/shop"
                  >
                    Перейти до магазину
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.productId}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      className="flex gap-4 p-3 rounded-2xl bg-cream-100/60"
                    >
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/product/${item.slug}`}
                          onClick={() => setIsOpen(false)}
                          className="font-medium text-tea-900 text-sm hover:text-tea-700 transition-colors line-clamp-1"
                        >
                          {item.name}
                        </Link>
                        <p className="text-tea-600 text-sm mt-0.5">
                          {formatPrice(item.price)}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity - 1)
                            }
                            className="w-7 h-7 rounded-full bg-cream-200 flex items-center justify-center hover:bg-cream-300 transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5 text-tea-700" />
                          </button>
                          <span className="text-sm font-medium text-tea-800 w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity + 1)
                            }
                            className="w-7 h-7 rounded-full bg-cream-200 flex items-center justify-center hover:bg-cream-300 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5 text-tea-700" />
                          </button>
                          <button
                            onClick={() => removeItem(item.productId)}
                            className="ml-auto text-xs text-tea-400 hover:text-red-500 transition-colors"
                          >
                            Видалити
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-cream-200 bg-cream-50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-tea-600">Разом</span>
                  <span className="font-serif text-2xl text-tea-900">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                <Button href="/checkout" className="w-full" size="lg">
                  Оформити замовлення
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
