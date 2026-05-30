import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import { updateProduct } from "@/app/actions/admin";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const db = await getDb();

  const [product, categories] = await Promise.all([
    db.product.findUnique({ where: { id } }),
    db.category.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  if (!product) notFound();

  return (
    <div className="max-w-2xl">
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-2 text-tea-600 hover:text-tea-800 text-sm mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Назад
      </Link>

      <h1 className="font-serif text-3xl text-tea-900 mb-8">
        Редагувати: {product.name}
      </h1>

      <form
        action={updateProduct}
        className="bg-cream-50 rounded-2xl border border-cream-200 p-6 space-y-5"
      >
        <input type="hidden" name="id" value={product.id} />
        <Input
          id="name"
          name="name"
          label="Назва"
          required
          defaultValue={product.name}
        />
        <Textarea
          id="description"
          name="description"
          label="Опис"
          required
          defaultValue={product.description}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            label="Ціна (₴)"
            required
            defaultValue={product.price}
          />
          <Input
            id="weight"
            name="weight"
            label="Вага"
            defaultValue={product.weight ?? ""}
          />
        </div>
        <Input
          id="origin"
          name="origin"
          label="Походження"
          defaultValue={product.origin ?? ""}
        />
        <Input
          id="image"
          name="image"
          label="URL зображення"
          required
          defaultValue={product.image}
        />
        <Select
          id="categoryId"
          name="categoryId"
          label="Категорія"
          required
          defaultValue={product.categoryId}
          options={categories.map((c) => ({
            value: c.id,
            label: c.name,
          }))}
        />
        <Input
          id="stock"
          name="stock"
          type="number"
          label="Кількість на складі"
          defaultValue={product.stock}
        />
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-tea-700 cursor-pointer">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={product.featured}
              className="rounded"
            />
            Рекомендований
          </label>
          <label className="flex items-center gap-2 text-sm text-tea-700 cursor-pointer">
            <input
              type="checkbox"
              name="inStock"
              defaultChecked={product.inStock}
              className="rounded"
            />
            В наявності
          </label>
        </div>
        <Button type="submit" size="lg">
          Зберегти зміни
        </Button>
      </form>
    </div>
  );
}
