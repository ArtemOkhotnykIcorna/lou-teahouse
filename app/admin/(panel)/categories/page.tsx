import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/Button";
import { deleteCategory } from "@/app/actions/admin";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default async function AdminCategoriesPage() {
  const categories = await db.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl text-tea-900">Категорії</h1>
        <Button href="/admin/categories/new" size="sm">
          <Plus className="w-4 h-4" />
          Додати категорію
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-cream-50 rounded-2xl border border-cream-200 overflow-hidden"
          >
            {category.image && (
              <div className="relative h-32">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="p-4">
              <h3 className="font-serif text-lg text-tea-900">
                {category.name}
              </h3>
              <p className="text-sm text-tea-600 mt-1">
                {category._count.products} товар(ів)
              </p>
              {category.description && (
                <p className="text-sm text-tea-500 mt-2 line-clamp-2">
                  {category.description}
                </p>
              )}
              <div className="flex items-center gap-2 mt-4">
                <Link
                  href={`/admin/categories/${category.id}/edit`}
                  className="flex items-center gap-1 text-sm text-tea-600 hover:text-tea-800 transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Редагувати
                </Link>
                <form action={deleteCategory} className="ml-auto">
                  <input type="hidden" name="id" value={category.id} />
                  <button
                    type="submit"
                    className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Видалити
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
