import type { PrismaClient } from "@/lib/generated/prisma/client";

const categories = [
  {
    name: "Зелений чай",
    slug: "zelenyy-chay",
    description: "Свіжі, трав'яні ноти з легкою солодкістю",
    image: "https://images.unsplash.com/photo-1556671047-27be167aa984?w=800&q=80",
    sortOrder: 1,
  },
  {
    name: "Чорний чай",
    slug: "chornyy-chay",
    description: "Насичені, глибокі смаки для справжніх поціновувачів",
    image: "https://images.unsplash.com/photo-1594631252845-29ada4c84f71?w=800&q=80",
    sortOrder: 2,
  },
  {
    name: "Улун",
    slug: "ulun",
    description: "Напівферментований чай з квітковим ароматом",
    image: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=800&q=80",
    sortOrder: 3,
  },
  {
    name: "Пуер",
    slug: "puer",
    description: "Витриманий чай з землистим, багатим смаком",
    image: "https://images.unsplash.com/photo-1576092760541-0963b9bb6409?w=800&q=80",
    sortOrder: 4,
  },
  {
    name: "Трав'яні збори",
    slug: "travyani-zbory",
    description: "Природні суміші для здоров'я та гармонії",
    image: "https://images.unsplash.com/photo-1544787210-86dba7b5c72c?w=800&q=80",
    sortOrder: 5,
  },
];

const products = [
  {
    name: "Сенча «Ранкова роса»",
    slug: "sencha-rankova-rosa",
    description:
      "Японська сенча з ніжним трав'яним смаком та легкою солодкістю. Збирається ранковою росою на високогірних плантаціях. Ідеальна для спокійного ранку.",
    price: 320,
    weight: "50 г",
    origin: "Японія",
    image: "https://images.unsplash.com/photo-1556671047-27be167aa984?w=800&q=80",
    featured: true,
    categorySlug: "zelenyy-chay",
  },
  {
    name: "Лунцзін «Драконова колодязь»",
    slug: "lunjtsin-drakonova-kolodets",
    description:
      "Легендарний китайський зелений чай з гори Сіху. Плоскі листки, що нагадують мечі дракона, розкривають свіжий горіховий смак.",
    price: 450,
    weight: "50 г",
    origin: "Китай",
    image: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=800&q=80",
    featured: true,
    categorySlug: "zelenyy-chay",
  },
  {
    name: "Ассам «Золотий сон»",
    slug: "assam-zolotyy-son",
    description:
      "Міцний індійський чорний чай з малайзьких долин. Насичений, з нотками солодкого сухофрукту та меду.",
    price: 280,
    weight: "100 г",
    origin: "Індія",
    image: "https://images.unsplash.com/photo-1594631252845-29ada4c84f71?w=800&q=80",
    featured: true,
    categorySlug: "chornyy-chay",
  },
  {
    name: "Ерл Грей «Венеціанська ніч»",
    slug: "erl-greya-venetsianska-nich",
    description:
      "Класичний Earl Grey з bergamot та нотками ванілі. Вишуканий бленд для вечірнього чаювання.",
    price: 350,
    weight: "100 г",
    origin: "Шрі-Ланка",
    image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=800&q=80",
    featured: false,
    categorySlug: "chornyy-chay",
  },
  {
    name: "Ті Гуань Інь «Залізна богиня»",
    slug: "ti-guan-in-zalizna-boginya",
    description:
      "Преміальний тайванський улун з квітковим ароматом та кремовою текстурою. Кожне заварювання розкриває нові грані смаку.",
    price: 580,
    weight: "50 г",
    origin: "Тайвань",
    image: "https://images.unsplash.com/photo-1576092760541-0963b9bb6409?w=800&q=80",
    featured: true,
    categorySlug: "ulun",
  },
  {
    name: "Дahongpao «Великий червоний халат»",
    slug: "dahongpao-velykyy-chervonyy-khale",
    description:
      "Легендарний скельний улун з Уишань. Димний, мінеральний смак з довгим післясмаком.",
    price: 720,
    weight: "30 г",
    origin: "Китай",
    image: "https://images.unsplash.com/photo-1544787210-86dba7b5c72c?w=800&q=80",
    featured: false,
    categorySlug: "ulun",
  },
  {
    name: "Шен Пуер «Стародавній ліс»",
    slug: "shen-puer-starodavniy-lis",
    description:
      "Сирий пуер з древніх чайних дерев. Свіжий, з нотками квітів та легкою гірчинкою, що змінюється з віком.",
    price: 890,
    weight: "50 г",
    origin: "Китай, Юньнань",
    image: "https://images.unsplash.com/photo-1558161170-44ce2e9e0e8d?w=800&q=80",
    featured: true,
    categorySlug: "puer",
  },
  {
    name: "Шу Пуер «Тиха гора»",
    slug: "shu-puer-tikha-gora",
    description:
      "Витриманий ферментований пуер з м'яким, землистим смаком. Зігріває та заспокоює.",
    price: 650,
    weight: "50 г",
    origin: "Китай, Юньнань",
    image: "https://images.unsplash.com/photo-1563822249366-3efb37a5e3e8?w=800&q=80",
    featured: false,
    categorySlug: "puer",
  },
  {
    name: "Ромашка & Лаванда",
    slug: "romashka-lavanda",
    description:
      "Ніжний трав'яний збір для вечірнього розслаблення. Заспокоює нервову систему та покращує сон.",
    price: 180,
    weight: "50 г",
    origin: "Україна",
    image: "https://images.unsplash.com/photo-1597318181400-75f8c2a5d9f6?w=800&q=80",
    featured: false,
    categorySlug: "travyani-zbory",
  },
  {
    name: "Імбир & Лимон",
    slug: "ymbyr-lymon",
    description:
      "Бадьорий збір з імбиру, лимону та м'яти. Зігріває та підвищує імунітет.",
    price: 200,
    weight: "50 г",
    origin: "Україна",
    image: "https://images.unsplash.com/photo-1597484668212-904241e29107?w=800&q=80",
    featured: false,
    categorySlug: "travyani-zbory",
  },
];

export async function seedDatabase(prisma: PrismaClient) {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  for (const cat of categories) {
    await prisma.category.create({ data: cat });
  }

  const categoryMap = new Map(
    (await prisma.category.findMany()).map((c) => [c.slug, c.id])
  );

  for (const product of products) {
    const { categorySlug, ...data } = product;
    const categoryId = categoryMap.get(categorySlug);
    if (!categoryId) continue;

    await prisma.product.create({
      data: { ...data, categoryId, images: "[]" },
    });
  }
}
