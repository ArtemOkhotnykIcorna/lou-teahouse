import { db } from "@/lib/db";
import { Hero } from "@/components/home/Hero";
import { CategoryCard } from "@/components/shop/CategoryCard";
import { ProductCard } from "@/components/shop/ProductCard";
import {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/AnimatedSection";
import { Button } from "@/components/ui/Button";
import { Leaf, Truck, Shield, Heart } from "lucide-react";

export default async function HomePage() {
  const [categories, featuredProducts] = await Promise.all([
    db.category.findMany({ orderBy: { sortOrder: "asc" }, take: 4 }),
    db.product.findMany({
      where: { featured: true },
      include: { category: true },
      take: 4,
    }),
  ]);

  return (
    <>
      <Hero />

      <section className="py-24 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <p className="text-tea-500 text-sm uppercase tracking-[0.2em] mb-3">
              Категорії
            </p>
            <h2 className="font-serif text-4xl text-tea-900">
              Оберіть свій чай
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {categories.map((cat, i) => (
              <CategoryCard
                key={cat.id}
                name={cat.name}
                slug={cat.slug}
                description={cat.description}
                image={cat.image}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-cream-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-4">
            <div>
              <p className="text-tea-500 text-sm uppercase tracking-[0.2em] mb-3">
                Колекція
              </p>
              <h2 className="font-serif text-4xl text-tea-900">
                Популярні чаї
              </h2>
            </div>
            <Button href="/shop" variant="outline">
              Всі товари
            </Button>
          </AnimatedSection>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {featuredProducts.map((product) => (
              <StaggerItem key={product.id}>
                <ProductCard
                  id={product.id}
                  name={product.name}
                  slug={product.slug}
                  price={product.price}
                  image={product.image}
                  category={product.category.name}
                />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="py-24 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Leaf,
                title: "Преміальна якість",
                desc: "Тільки відібрані чаї з перевірених плантацій",
              },
              {
                icon: Truck,
                title: "Швидка доставка",
                desc: "Доставка по всій Україні протягом 1-3 днів",
              },
              {
                icon: Shield,
                title: "Гарантія свіжості",
                desc: "Кожна партія проходить контроль якості",
              },
              {
                icon: Heart,
                title: "З любов'ю до чаю",
                desc: "Ми дбаємо про кожну деталь вашого чаювання",
              },
            ].map((item) => (
              <StaggerItem key={item.title}>
                <div className="text-center p-6">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-cream-200 flex items-center justify-center">
                    <item.icon className="w-7 h-7 text-tea-600" />
                  </div>
                  <h3 className="font-serif text-xl text-tea-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-tea-600/70 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </>
  );
}
