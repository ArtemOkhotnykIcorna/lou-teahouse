import { db } from "@/lib/db";
import { ProductCard } from "@/components/shop/ProductCard";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ShopPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { category: categorySlug } = await searchParams;

  const categories = await db.category.findMany({
    orderBy: { sortOrder: "asc" },
  });

  const products = await db.product.findMany({
    where: categorySlug
      ? { category: { slug: categorySlug } }
      : undefined,
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  const activeCategory = categories.find((c) => c.slug === categorySlug);

  return (
    <div className="py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="mb-12">
          <p className="text-tea-500 text-sm uppercase tracking-[0.2em] mb-3">
            Магазин
          </p>
          <h1 className="font-serif text-4xl lg:text-5xl text-tea-900">
            {activeCategory ? activeCategory.name : "Вся колекція"}
          </h1>
          {activeCategory?.description && (
            <p className="text-tea-600/70 mt-3 max-w-lg">
              {activeCategory.description}
            </p>
          )}
        </AnimatedSection>

        <div className="flex flex-wrap gap-2 mb-12">
          <Link
            href="/shop"
            className={cn(
              "px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
              !categorySlug
                ? "bg-tea-700 text-cream-50"
                : "bg-cream-200 text-tea-700 hover:bg-cream-300"
            )}
          >
            Всі
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className={cn(
                "px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
                categorySlug === cat.slug
                  ? "bg-tea-700 text-cream-50"
                  : "bg-cream-200 text-tea-700 hover:bg-cream-300"
              )}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-tea-600 text-lg">Товарів не знайдено</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                slug={product.slug}
                price={product.price}
                image={product.image}
                category={product.category.name}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
