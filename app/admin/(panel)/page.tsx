import { getDb } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { Package, FolderOpen, ShoppingCart, TrendingUp } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  const db = await getDb();
  const [productCount, categoryCount, orderCount, recentOrders, totalRevenue] =
    await Promise.all([
      db.product.count(),
      db.category.count(),
      db.order.count(),
      db.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { items: true },
      }),
      db.order.aggregate({ _sum: { total: true } }),
    ]);

  const stats = [
    {
      label: "Товари",
      value: productCount,
      icon: Package,
      href: "/admin/products",
    },
    {
      label: "Категорії",
      value: categoryCount,
      icon: FolderOpen,
      href: "/admin/categories",
    },
    {
      label: "Замовлення",
      value: orderCount,
      icon: ShoppingCart,
      href: "/admin/orders",
    },
    {
      label: "Дохід",
      value: formatPrice(totalRevenue._sum.total ?? 0),
      icon: TrendingUp,
      href: "/admin/orders",
    },
  ];

  const statusLabels: Record<string, string> = {
    pending: "Очікує",
    processing: "В обробці",
    shipped: "Відправлено",
    delivered: "Доставлено",
    cancelled: "Скасовано",
  };

  return (
    <div>
      <h1 className="font-serif text-3xl text-tea-900 mb-8">Дашборд</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="bg-cream-50 rounded-2xl p-6 border border-cream-200 hover:border-tea-300 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <Icon className="w-5 h-5 text-tea-600" />
              </div>
              <p className="text-2xl font-serif text-tea-900">{stat.value}</p>
              <p className="text-sm text-tea-600 mt-1">{stat.label}</p>
            </Link>
          );
        })}
      </div>

      <div className="bg-cream-50 rounded-2xl border border-cream-200 overflow-hidden">
        <div className="p-6 border-b border-cream-200">
          <h2 className="font-serif text-xl text-tea-900">
            Останні замовлення
          </h2>
        </div>
        {recentOrders.length === 0 ? (
          <p className="p-6 text-tea-600">Замовлень поки немає</p>
        ) : (
          <div className="divide-y divide-cream-200">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="p-4 flex items-center justify-between hover:bg-cream-100/50 transition-colors"
              >
                <div>
                  <p className="font-medium text-tea-900">
                    {order.orderNumber}
                  </p>
                  <p className="text-sm text-tea-600">
                    {order.customerName} · {order.items.length} товар(ів)
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-tea-900">
                    {formatPrice(order.total)}
                  </p>
                  <p className="text-xs text-tea-500">
                    {statusLabels[order.status] ?? order.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
