import { adminLogin } from "@/app/actions/admin";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Leaf } from "lucide-react";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-tea-700 flex items-center justify-center">
            <Leaf className="w-8 h-8 text-cream-50" />
          </div>
          <h1 className="font-serif text-3xl text-tea-900">LOU Tea Admin</h1>
          <p className="text-tea-600 mt-2">Введіть пароль для входу</p>
        </div>

        <form
          action={adminLogin}
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
          <Button type="submit" className="w-full" size="lg">
            Увійти
          </Button>
        </form>
      </div>
    </div>
  );
}
