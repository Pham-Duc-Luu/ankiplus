import { useState, useEffect } from "react";

function useBounce<T>(value: T, delay: number = 700): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set up a delay before updating the debounced value
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timeout if value changes before the delay completes
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useBounce;
