import { useEffect, useState } from "react";

export default function useDebounce<Val>(value: Val, delay: number = 300): Val {
  const [debouncedValue, setDebouncedValue] = useState<Val>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
