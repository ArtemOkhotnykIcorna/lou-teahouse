import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import { updateCategory } from "@/app/actions/admin";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface EditCategoryPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({
  params,
}: EditCategoryPageProps) {
  const { id } = await params;
  const db = await getDb();
  const category = await db.category.findUnique({ where: { id } });

  if (!category) notFound();

  return (
    <div className="max-w-2xl">
      <Link
        href="/admin/categories"
        className="inline-flex items-center gap-2 text-tea-600 hover:text-tea-800 text-sm mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Назад
      </Link>

      <h1 className="font-serif text-3xl text-tea-900 mb-8">
        Редагувати: {category.name}
      </h1>

      <form
        action={updateCategory}
        className="bg-cream-50 rounded-2xl border border-cream-200 p-6 space-y-5"
      >
        <input type="hidden" name="id" value={category.id} />
        <Input
          id="name"
          name="name"
          label="Назва"
          required
          defaultValue={category.name}
        />
        <Textarea
          id="description"
          name="description"
          label="Опис"
          defaultValue={category.description ?? ""}
        />
        <Input
          id="image"
          name="image"
          label="URL зображення"
          defaultValue={category.image ?? ""}
        />
        <Input
          id="sortOrder"
          name="sortOrder"
          type="number"
          label="Порядок сортування"
          defaultValue={category.sortOrder}
        />
        <Button type="submit" size="lg">
          Зберегти зміни
        </Button>
      </form>
    </div>
  );
}
