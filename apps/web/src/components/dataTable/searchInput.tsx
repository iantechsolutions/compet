import { Input } from "~/components/ui/input";
import { useState, useEffect } from "react";

export default function SearchInput({
  value: initialValue,
  onChange,
  debounce = 500,
  placeholder,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
  placeholder?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = useState(initialValue);
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);
  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return (
    <div className="w-full max-w-sm flex items-center place-content-center relative">
      <Input
        {...props}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder ?? "Buscar..."}
        className="w-full px-4 h-8 rounded-full border-2 border-secondary/70"
        maxLength={100}
      />
    </div>
  );
}
