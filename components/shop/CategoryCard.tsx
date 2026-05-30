"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface CategoryCardProps {
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  index: number;
}

export function CategoryCard({
  name,
  slug,
  description,
  image,
  index,
}: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/shop?category=${slug}`} className="group block">
        <div className="relative aspect-[3/4] rounded-3xl overflow-hidden">
          {image && (
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-tea-900/70 via-tea-900/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h3 className="font-serif text-xl text-cream-50 mb-1">{name}</h3>
            {description && (
              <p className="text-cream-200/70 text-sm line-clamp-2 mb-3">
                {description}
              </p>
            )}
            <span className="inline-flex items-center gap-1 text-cream-100 text-sm font-medium opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
              Переглянути <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
