import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes intelligently.
 * Combines clsx for conditional classes and tailwind-merge to resolve conflicts.
 * 
 * @param inputs - Class values to merge (strings, objects, arrays)
 * @returns Merged class string
 * 
 * @example
 * cn("px-4 py-2", isActive && "bg-indigo-600", "text-white")
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
