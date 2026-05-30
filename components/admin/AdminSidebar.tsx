"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  ShoppingCart,
  LogOut,
  Leaf,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { adminLogout } from "@/app/actions/admin";

const links = [
  { href: "/admin", label: "Дашборд", icon: LayoutDashboard },
  { href: "/admin/products", label: "Товари", icon: Package },
  { href: "/admin/categories", label: "Категорії", icon: FolderOpen },
  { href: "/admin/orders", label: "Замовлення", icon: ShoppingCart },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-tea-900 text-cream-200 min-h-screen flex flex-col">
      <div className="p-6 border-b border-tea-800">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-tea-700 flex items-center justify-center">
            <Leaf className="w-4 h-4 text-cream-50" />
          </div>
          <div>
            <span className="font-serif text-lg text-cream-50 block">
              LOU Tea
            </span>
            <span className="text-xs text-cream-400">Адмін-панель</span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const active =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                active
                  ? "bg-tea-800 text-cream-50"
                  : "text-cream-300 hover:bg-tea-800/50 hover:text-cream-50"
              )}
            >
              <Icon className="w-5 h-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-tea-800">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-cream-400 hover:text-cream-50 transition-colors mb-1"
        >
          ← На сайт
        </Link>
        <form action={adminLogout}>
          <button
            type="submit"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-cream-400 hover:text-red-400 transition-colors w-full cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            Вийти
          </button>
        </form>
      </div>
    </aside>
  );
}
