import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines clsx and tailwind-merge for conditional className strings
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
