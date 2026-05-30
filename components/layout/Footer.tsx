import Link from "next/link";
import { Leaf, Mail, Share2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-tea-900 text-cream-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-tea-700 flex items-center justify-center">
                <Leaf className="w-4 h-4 text-cream-50" />
              </div>
              <span className="font-serif text-xl text-cream-50">LOU Tea</span>
            </div>
            <p className="text-cream-300/80 text-sm leading-relaxed max-w-xs">
              Вишукані чаї з усього світу. Кожна чашка — це подорож у світ
              ароматів та смаків.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-cream-50 mb-4">Навігація</h3>
            <nav className="flex flex-col gap-2">
              {[
                { href: "/shop", label: "Магазин" },
                { href: "/about", label: "Про нас" },
                { href: "/cart", label: "Кошик" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-cream-300/80 hover:text-cream-50 text-sm transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h3 className="font-medium text-cream-50 mb-4">Контакти</h3>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:hello@loutea.com"
                className="flex items-center gap-2 text-cream-300/80 hover:text-cream-50 text-sm transition-colors"
              >
                <Mail className="w-4 h-4" />
                hello@loutea.com
              </a>
              <a
                href="#"
                className="flex items-center gap-2 text-cream-300/80 hover:text-cream-50 text-sm transition-colors"
              >
                <Share2 className="w-4 h-4" />
                @loutea.ua
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-tea-800 mt-12 pt-8 text-center text-cream-400/60 text-sm">
          © {new Date().getFullYear()} LOU Tea. Всі права захищені.
        </div>
      </div>
    </footer>
  );
}
