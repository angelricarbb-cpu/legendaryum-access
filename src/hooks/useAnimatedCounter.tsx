import { useState, useEffect, useRef } from 'react';

interface UseAnimatedCounterOptions {
  duration?: number;
  delay?: number;
  enabled?: boolean;
}

export const useAnimatedCounter = (
  endValue: number,
  options: UseAnimatedCounterOptions = {}
): number => {
  const { duration = 1500, delay = 0, enabled = true } = options;
  const [count, setCount] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) {
      setCount(0);
      return;
    }

    const delayTimeout = setTimeout(() => {
      const animate = (timestamp: number) => {
        if (!startTimeRef.current) {
          startTimeRef.current = timestamp;
        }

        const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
        
        // Easing function for smooth deceleration
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        
        const currentValue = Math.floor(easeOutQuart * endValue);
        setCount(currentValue);

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(animate);
        } else {
          setCount(endValue);
        }
      };

      rafRef.current = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(delayTimeout);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      startTimeRef.current = null;
    };
  }, [endValue, duration, delay, enabled]);

  return count;
};

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  delay?: number;
  enabled?: boolean;
  suffix?: string;
  prefix?: string;
  formatFn?: (n: number) => string;
}

export const AnimatedNumber = ({
  value,
  duration = 1500,
  delay = 0,
  enabled = true,
  suffix = '',
  prefix = '',
  formatFn,
}: AnimatedNumberProps) => {
  const animatedValue = useAnimatedCounter(value, { duration, delay, enabled });
  
  const formattedValue = formatFn 
    ? formatFn(animatedValue) 
    : animatedValue.toLocaleString();

  return (
    <span>
      {prefix}{formattedValue}{suffix}
    </span>
  );
};
