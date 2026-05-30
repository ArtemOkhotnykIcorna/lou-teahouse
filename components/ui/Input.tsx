import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, id, ...props }: InputProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-tea-700">
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          "w-full px-4 py-3 rounded-xl border border-cream-300 bg-cream-50 text-tea-900 placeholder:text-tea-400 focus:outline-none focus:ring-2 focus:ring-tea-500/30 focus:border-tea-500 transition-all",
          error && "border-red-400",
          className
        )}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function Textarea({ label, className, id, ...props }: TextareaProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-tea-700">
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={cn(
          "w-full px-4 py-3 rounded-xl border border-cream-300 bg-cream-50 text-tea-900 placeholder:text-tea-400 focus:outline-none focus:ring-2 focus:ring-tea-500/30 focus:border-tea-500 transition-all resize-y min-h-[100px]",
          className
        )}
        {...props}
      />
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, options, className, id, ...props }: SelectProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-tea-700">
          {label}
        </label>
      )}
      <select
        id={id}
        className={cn(
          "w-full px-4 py-3 rounded-xl border border-cream-300 bg-cream-50 text-tea-900 focus:outline-none focus:ring-2 focus:ring-tea-500/30 focus:border-tea-500 transition-all",
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
