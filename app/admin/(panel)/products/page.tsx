import Link from "next/link";
import Image from "next/image";
import { getDb } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { deleteProduct } from "@/app/actions/admin";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default async function AdminProductsPage() {
  const db = await getDb();
  const products = await db.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl text-tea-900">Товари</h1>
        <Button href="/admin/products/new" size="sm">
          <Plus className="w-4 h-4" />
          Додати товар
        </Button>
      </div>

      <div className="bg-cream-50 rounded-2xl border border-cream-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-cream-200 text-left text-sm text-tea-600">
              <th className="p-4 font-medium">Товар</th>
              <th className="p-4 font-medium hidden sm:table-cell">
                Категорія
              </th>
              <th className="p-4 font-medium">Ціна</th>
              <th className="p-4 font-medium hidden md:table-cell">
                Наявність
              </th>
              <th className="p-4 font-medium w-24"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-200">
            {products.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-cream-100/50 transition-colors"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="font-medium text-tea-900 text-sm">
                      {product.name}
                    </span>
                  </div>
                </td>
                <td className="p-4 text-sm text-tea-600 hidden sm:table-cell">
                  {product.category.name}
                </td>
                <td className="p-4 text-sm font-medium text-tea-900">
                  {formatPrice(product.price)}
                </td>
                <td className="p-4 hidden md:table-cell">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full ${
                      product.inStock
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {product.inStock ? "В наявності" : "Немає"}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="p-2 rounded-lg hover:bg-cream-200 transition-colors"
                    >
                      <Pencil className="w-4 h-4 text-tea-600" />
                    </Link>
                    <form action={deleteProduct}>
                      <input type="hidden" name="id" value={product.id} />
                      <button
                        type="submit"
                        className="p-2 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
