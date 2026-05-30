"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Package, CreditCard, Banknote, Store, Truck } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { formatPrice, cn } from "@/lib/utils";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import {
  createOrder,
  type DeliveryMethod,
  type PaymentMethod,
} from "@/app/actions/orders";

const PICKUP_ADDRESS = "вул. Друкарська, 11, Львів";

interface NpOption {
  ref: string;
  label: string;
}

function OptionCard({
  selected,
  onClick,
  icon: Icon,
  title,
  description,
}: {
  selected: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full text-left p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer",
        selected
          ? "border-tea-700 bg-tea-50/50 shadow-sm"
          : "border-cream-200 bg-cream-50 hover:border-cream-300"
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors",
            selected ? "bg-tea-700 text-cream-50" : "bg-cream-200 text-tea-600"
          )}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="font-medium text-tea-900">{title}</p>
          <p className="text-sm text-tea-600 mt-0.5">{description}</p>
        </div>
      </div>
    </button>
  );
}

function SearchSelect({
  label,
  placeholder,
  value,
  onChange,
  fetchUrl,
  disabled,
}: {
  label: string;
  placeholder: string;
  value: NpOption | null;
  onChange: (option: NpOption | null) => void;
  fetchUrl: (query: string) => string;
  disabled?: boolean;
}) {
  const [query, setQuery] = useState(value?.label ?? "");
  const [options, setOptions] = useState<NpOption[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const search = useCallback(
    (q: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (q.length < 2) {
        setOptions([]);
        setSearchError("");
        return;
      }
      debounceRef.current = setTimeout(async () => {
        setLoading(true);
        setSearchError("");
        try {
          const res = await fetch(fetchUrl(q));
          const json = await res.json();
          if (json.error) {
            setOptions([]);
            setOpen(false);
            setSearchError(json.error);
            return;
          }
          const results = json.data ?? [];
          setOptions(results);
          setOpen(results.length > 0);
          if (results.length === 0) {
            setSearchError("Місто не знайдено");
          }
        } catch {
          setOptions([]);
          setSearchError("Не вдалося завантажити міста");
        } finally {
          setLoading(false);
        }
      }, 300);
    },
    [fetchUrl]
  );

  return (
    <div ref={containerRef} className="relative space-y-1.5">
      <label className="block text-sm font-medium text-tea-700">{label}</label>
      <input
        type="text"
        value={query}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => {
          setQuery(e.target.value);
          onChange(null);
          search(e.target.value);
        }}
        onFocus={() => options.length > 0 && setOpen(true)}
        className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-cream-50 text-tea-900 placeholder:text-tea-400 focus:outline-none focus:ring-2 focus:ring-tea-500/30 focus:border-tea-500 transition-all disabled:opacity-50"
      />
      {loading && (
        <p className="text-xs text-tea-500">Пошук...</p>
      )}
      {searchError && !loading && (
        <p className="text-xs text-red-500">{searchError}</p>
      )}
      <AnimatePresence>
        {open && options.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute z-20 w-full mt-1 max-h-56 overflow-y-auto bg-cream-50 border border-cream-200 rounded-xl shadow-lg"
          >
            {options.map((opt) => (
              <li key={opt.ref}>
                <button
                  type="button"
                  className="w-full text-left px-4 py-2.5 text-sm text-tea-800 hover:bg-cream-100 transition-colors cursor-pointer"
                  onClick={() => {
                    onChange(opt);
                    setQuery(opt.label);
                    setOpen(false);
                  }}
                >
                  {opt.label}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export function CheckoutForm() {
  const { items, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("pickup");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [selectedCity, setSelectedCity] = useState<NpOption | null>(null);
  const [warehouses, setWarehouses] = useState<NpOption[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState<NpOption | null>(null);
  const [loadingWarehouses, setLoadingWarehouses] = useState(false);
  const [warehouseError, setWarehouseError] = useState("");

  useEffect(() => {
    if (!selectedCity) {
      setWarehouses([]);
      setSelectedWarehouse(null);
      return;
    }

    setLoadingWarehouses(true);
    setSelectedWarehouse(null);
    setWarehouseError("");
    fetch(`/api/nova-poshta?action=warehouses&cityRef=${selectedCity.ref}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.error) {
          setWarehouses([]);
          setWarehouseError(json.error);
          return;
        }
        setWarehouses(json.data ?? []);
        if (!(json.data ?? []).length) {
          setWarehouseError("Відділення не знайдено для цього міста");
        }
      })
      .catch(() => {
        setWarehouses([]);
        setWarehouseError("Не вдалося завантажити відділення");
      })
      .finally(() => setLoadingWarehouses(false));
  }, [selectedCity]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);

    if (deliveryMethod === "nova_poshta" && !selectedWarehouse) {
      setError("Оберіть відділення Нової Пошти");
      setLoading(false);
      return;
    }

    try {
      await createOrder({
        customerName: form.get("name") as string,
        customerEmail: form.get("email") as string,
        customerPhone: form.get("phone") as string,
        notes: (form.get("notes") as string) || undefined,
        paymentMethod,
        deliveryMethod,
        npCityRef: selectedCity?.ref,
        npCityName: selectedCity?.label,
        npWarehouseRef: selectedWarehouse?.ref,
        npWarehouseName: selectedWarehouse?.label,
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
      });
      clearCart();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Помилка при оформленні замовлення";
      if (!message.includes("NEXT_REDIRECT")) {
        setError(message);
        setLoading(false);
      }
    }
  }

  const submitLabel =
    paymentMethod === "online"
      ? `Оплатити ${formatPrice(totalPrice)}`
      : `Підтвердити — ${formatPrice(totalPrice)}`;

  return (
    <AnimatedSection delay={0.1}>
      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="space-y-3">
          <h2 className="font-serif text-xl text-tea-900 flex items-center gap-2">
            <Truck className="w-5 h-5 text-tea-600" />
            Доставка
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <OptionCard
              selected={deliveryMethod === "pickup"}
              onClick={() => setDeliveryMethod("pickup")}
              icon={Store}
              title="Самовивіз"
              description={PICKUP_ADDRESS}
            />
            <OptionCard
              selected={deliveryMethod === "nova_poshta"}
              onClick={() => setDeliveryMethod("nova_poshta")}
              icon={Package}
              title="Нова Пошта"
              description="Доставка у відділення"
            />
          </div>

          <AnimatePresence mode="wait">
            {deliveryMethod === "pickup" ? (
              <motion.div
                key="pickup"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-cream-100/80 text-sm text-tea-700">
                  <MapPin className="w-5 h-5 text-tea-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-tea-900">LOU Tea House</p>
                    <p>{PICKUP_ADDRESS}</p>
                    <p className="text-tea-500 mt-1">Пн–Сб: 10:00–19:00</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="np"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden space-y-4"
              >
                <SearchSelect
                  label="Місто"
                  placeholder="Почніть вводити назву міста..."
                  value={selectedCity}
                  onChange={setSelectedCity}
                  fetchUrl={(q) =>
                    `/api/nova-poshta?action=cities&q=${encodeURIComponent(q)}`
                  }
                />
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-tea-700">
                    Відділення
                  </label>
                  <select
                    value={selectedWarehouse?.ref ?? ""}
                    disabled={!selectedCity || loadingWarehouses}
                    onChange={(e) => {
                      const wh = warehouses.find((w) => w.ref === e.target.value);
                      setSelectedWarehouse(wh ?? null);
                    }}
                    className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-cream-50 text-tea-900 focus:outline-none focus:ring-2 focus:ring-tea-500/30 focus:border-tea-500 transition-all disabled:opacity-50"
                  >
                    <option value="">
                      {loadingWarehouses
                        ? "Завантаження..."
                        : selectedCity
                          ? "Оберіть відділення"
                          : "Спочатку оберіть місто"}
                    </option>
                    {warehouses.map((wh) => (
                      <option key={wh.ref} value={wh.ref}>
                        {wh.label}
                      </option>
                    ))}
                  </select>
                  {warehouseError && (
                    <p className="text-sm text-red-500">{warehouseError}</p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl text-tea-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-tea-600" />
            Оплата
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <OptionCard
              selected={paymentMethod === "online"}
              onClick={() => setPaymentMethod("online")}
              icon={CreditCard}
              title="Оплатити зараз"
              description="Monopay — картка, Apple Pay, Google Pay"
            />
            <OptionCard
              selected={paymentMethod === "cod"}
              onClick={() => setPaymentMethod("cod")}
              icon={Banknote}
              title="Оплата при отриманні"
              description="Готівка або картка кур'єру / у відділенні"
            />
          </div>
        </section>

        <section className="space-y-5">
          <h2 className="font-serif text-xl text-tea-900">Контактні дані</h2>
          <Input
            id="name"
            name="name"
            label="Ім'я та прізвище"
            required
            placeholder="Олена Петренко"
          />
          <Input
            id="email"
            name="email"
            type="email"
            label="Email"
            required
            placeholder="olena@example.com"
          />
          <Input
            id="phone"
            name="phone"
            type="tel"
            label="Телефон"
            required
            placeholder="+380 XX XXX XX XX"
          />
          <Textarea
            id="notes"
            name="notes"
            label="Коментар до замовлення"
            placeholder="Не дзвонити після 20:00..."
          />
        </section>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? "Оформлюємо..." : submitLabel}
        </Button>
      </form>
    </AnimatedSection>
  );
}
