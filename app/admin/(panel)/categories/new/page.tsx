import { createCategory } from "@/app/actions/admin";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewCategoryPage() {
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
        Нова категорія
      </h1>

      <form
        action={createCategory}
        className="bg-cream-50 rounded-2xl border border-cream-200 p-6 space-y-5"
      >
        <Input id="name" name="name" label="Назва" required />
        <Textarea id="description" name="description" label="Опис" />
        <Input
          id="image"
          name="image"
          label="URL зображення"
          placeholder="https://images.unsplash.com/..."
        />
        <Input
          id="sortOrder"
          name="sortOrder"
          type="number"
          label="Порядок сортування"
          defaultValue="0"
        />
        <Button type="submit" size="lg">
          Створити категорію
        </Button>
      </form>
    </div>
  );
}
