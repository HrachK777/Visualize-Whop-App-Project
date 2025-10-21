import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`
}

export const ticksNumber = (data : any, datakey : any) => {
    const spacing = data.length > 12 ? 3 : 2;
    const ticks = data.map((d: any, i: number) => (i % spacing === 0 ? d[datakey] : null)).filter(Boolean);
    return ticks as string[];
  }