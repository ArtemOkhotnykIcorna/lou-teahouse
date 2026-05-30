import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getDb } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { AddToCartButton } from "@/components/shop/AddToCartButton";
import { ProductCard } from "@/components/shop/ProductCard";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { ArrowLeft, MapPin, Scale } from "lucide-react";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const db = await getDb();

  const product = await db.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!product) notFound();

  const relatedProducts = await db.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
    },
    include: { category: true },
    take: 4,
  });

  return (
    <div className="py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-tea-600 hover:text-tea-800 text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад до магазину
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <AnimatedSection>
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-cream-100">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <Link
              href={`/shop?category=${product.category.slug}`}
              className="text-tea-500 text-sm uppercase tracking-wider hover:text-tea-700 transition-colors"
            >
              {product.category.name}
            </Link>

            <h1 className="font-serif text-4xl lg:text-5xl text-tea-900 mt-2 mb-4">
              {product.name}
            </h1>

            <p className="font-serif text-3xl text-tea-700 mb-6">
              {formatPrice(product.price)}
            </p>

            <p className="text-tea-600/80 leading-relaxed mb-8">
              {product.description}
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              {product.origin && (
                <div className="flex items-center gap-2 px-4 py-2 bg-cream-100 rounded-full text-sm text-tea-700">
                  <MapPin className="w-4 h-4" />
                  {product.origin}
                </div>
              )}
              {product.weight && (
                <div className="flex items-center gap-2 px-4 py-2 bg-cream-100 rounded-full text-sm text-tea-700">
                  <Scale className="w-4 h-4" />
                  {product.weight}
                </div>
              )}
            </div>

            <AddToCartButton
              product={{
                productId: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                slug: product.slug,
              }}
              inStock={product.inStock}
            />
          </AnimatedSection>
        </div>

        {relatedProducts.length > 0 && (
          <section className="mt-24">
            <h2 className="font-serif text-3xl text-tea-900 mb-8">
              Схожі товари
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  slug={p.slug}
                  price={p.price}
                  image={p.image}
                  category={p.category.name}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
