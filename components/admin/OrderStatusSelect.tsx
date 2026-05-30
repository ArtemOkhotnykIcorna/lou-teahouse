"use client";

import { updateOrderStatus } from "@/app/actions/admin";

const statusOptions = [
  { value: "pending", label: "Очікує" },
  { value: "processing", label: "В обробці" },
  { value: "shipped", label: "Відправлено" },
  { value: "delivered", label: "Доставлено" },
  { value: "cancelled", label: "Скасовано" },
];

interface OrderStatusSelectProps {
  orderId: string;
  currentStatus: string;
}

export function OrderStatusSelect({
  orderId,
  currentStatus,
}: OrderStatusSelectProps) {
  return (
    <form action={updateOrderStatus}>
      <input type="hidden" name="id" value={orderId} />
      <select
        name="status"
        defaultValue={currentStatus}
        className="px-3 py-2 rounded-xl border border-cream-300 bg-cream-50 text-sm text-tea-900 cursor-pointer"
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
      >
        {statusOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </form>
  );
}
