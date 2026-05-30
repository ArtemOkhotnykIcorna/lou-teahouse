import { AnimatedSection } from "@/components/ui/AnimatedSection";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="py-12 lg:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <p className="text-tea-500 text-sm uppercase tracking-[0.2em] mb-3">
            Про нас
          </p>
          <h1 className="font-serif text-4xl lg:text-5xl text-tea-900 mb-6">
            LOU Tea House
          </h1>
          <p className="text-tea-600/80 text-lg leading-relaxed max-w-2xl mx-auto">
            Ми — команда ентузіастів, які вірять, що чай — це не просто напій,
            а ціла філософія. Кожен наш чай обраний особисто на плантаціях
            Китаю, Японії, Тайваню та Індії.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div className="relative aspect-[16/9] rounded-3xl overflow-hidden mb-16">
            <Image
              src="https://images.unsplash.com/photo-1558161170-d171b6a562b6?w=1200&q=80"
              alt="Чайна церемонія"
              fill
              className="object-cover"
            />
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <AnimatedSection delay={0.2}>
            <h2 className="font-serif text-2xl text-tea-900 mb-4">
              Наша місія
            </h2>
            <p className="text-tea-600/80 leading-relaxed">
              Ми прагнемо зробити світ якісного чаю доступним для кожного
              українця. Кожна упаковка — це обіцянка свіжості, автентичності
              та турботи про ваші смакові відкриття.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <h2 className="font-serif text-2xl text-tea-900 mb-4">
              Як ми працюємо
            </h2>
            <p className="text-tea-600/80 leading-relaxed">
              Ми працюємо безпосередньо з виробниками, мінуючи посередників.
              Це дозволяє нам пропонувати найкращі ціни та гарантувати свіжість
              кожної партії. Усі чаї зберігаються в оптимальних умовах.
            </p>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
