"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/components/cart/CartProvider";

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  category?: string;
  featured?: boolean;
}

export function ProductCard({
  id,
  name,
  slug,
  price,
  image,
  category,
}: ProductCardProps) {
  const { addItem } = useCart();

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <div className="relative bg-cream-100 rounded-3xl overflow-hidden">
        <Link href={`/product/${slug}`}>
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-tea-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        </Link>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() =>
            addItem({ productId: id, name, price, image, slug })
          }
          className="absolute bottom-4 right-4 w-11 h-11 bg-cream-50/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-tea-700 hover:text-cream-50"
          aria-label="Додати до кошика"
        >
          <ShoppingBag className="w-5 h-5" />
        </motion.button>
      </div>

      <div className="pt-4 px-1">
        {category && (
          <p className="text-xs text-tea-500 uppercase tracking-wider mb-1">
            {category}
          </p>
        )}
        <Link href={`/product/${slug}`}>
          <h3 className="font-serif text-lg text-tea-900 hover:text-tea-700 transition-colors line-clamp-1">
            {name}
          </h3>
        </Link>
        <p className="text-tea-600 font-medium mt-1">{formatPrice(price)}</p>
      </div>
    </motion.div>
  );
}
