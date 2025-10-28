import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): any {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`
}

export const ticksNumber = (data: any, datakey: any) => {
  let spacing = data.length > 12 ? 3 : 2;
  if (data.length <= 5) {
    spacing = 1;
  }
  // const ticks = data.map((d: any, i: number) => (i % spacing === 0 ? d[datakey] : null)).filter(Boolean);
  const ticks = data.map((d: any, i: number) => (i % spacing === 0 ? d[datakey] : null)).filter((tick: any) => tick !== null && tick !== undefined);
  return ticks as any[];
}

// ✅ Format numbers to "$148k" style
export function formatCurrency1(value: any) {
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
  return value &&  `$${value.toFixed(2)}`;
}

// Memoized date formatter
export const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleString("default", {
    month: "short",
    year: "numeric"
  });
};

export const ymd = (d: number) => {
  const s = new Date(d * 1000);
  return [
    s.getFullYear(),
    String(s.getMonth() + 1).padStart(2, '0'),
    String(s.getDate()).padStart(2, '0')
  ].join('-');
}