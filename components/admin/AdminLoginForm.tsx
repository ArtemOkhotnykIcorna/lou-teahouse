"use client";

import { useActionState } from "react";
import { adminLogin } from "@/app/actions/admin";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function AdminLoginForm() {
  const [state, formAction, pending] = useActionState(adminLogin, null);

  return (
    <form
      action={formAction}
      className="bg-cream-50 rounded-3xl p-8 shadow-sm border border-cream-200 space-y-5"
    >
      <Input
        id="password"
        name="password"
        type="password"
        label="Пароль"
        required
        placeholder="••••••••"
      />
      {state?.error && (
        <p className="text-sm text-red-500">{state.error}</p>
      )}
      <Button type="submit" className="w-full" size="lg" disabled={pending}>
        {pending ? "Вхід..." : "Увійти"}
      </Button>
    </form>
  );
}
