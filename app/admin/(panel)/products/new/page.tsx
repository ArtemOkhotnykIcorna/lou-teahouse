import { db } from "@/lib/db";
import { createProduct } from "@/app/actions/admin";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NewProductPage() {
  const categories = await db.category.findMany({
    orderBy: { sortOrder: "asc" },
  });

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
        Новий товар
      </h1>

      <form
        action={createProduct}
        className="bg-cream-50 rounded-2xl border border-cream-200 p-6 space-y-5"
      >
        <Input id="name" name="name" label="Назва" required />
        <Textarea
          id="description"
          name="description"
          label="Опис"
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            label="Ціна (₴)"
            required
          />
          <Input id="weight" name="weight" label="Вага" placeholder="50 г" />
        </div>
        <Input
          id="origin"
          name="origin"
          label="Походження"
          placeholder="Китай"
        />
        <Input
          id="image"
          name="image"
          label="URL зображення"
          required
          placeholder="https://images.unsplash.com/..."
        />
        <Select
          id="categoryId"
          name="categoryId"
          label="Категорія"
          required
          options={categories.map((c) => ({
            value: c.id,
            label: c.name,
          }))}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            id="stock"
            name="stock"
            type="number"
            label="Кількість на складі"
            defaultValue="100"
          />
        </div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-tea-700 cursor-pointer">
            <input type="checkbox" name="featured" className="rounded" />
            Рекомендований
          </label>
          <label className="flex items-center gap-2 text-sm text-tea-700 cursor-pointer">
            <input
              type="checkbox"
              name="inStock"
              defaultChecked
              className="rounded"
            />
            В наявності
          </label>
        </div>
        <Button type="submit" size="lg">
          Створити товар
        </Button>
      </form>
    </div>
  );
}
