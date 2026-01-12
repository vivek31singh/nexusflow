import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface PanelProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Whether the panel should use a light background variant
   * @default false
   */
  variant?: "default" | "subtle";
  /**
   * Whether the panel should have a border
   * @default true
   */
  bordered?: boolean;
  /**
   * Custom padding classes
   * @default "p-4"
   */
  padding?: string;
}

/**
 * Panel - A reusable UI primitive for standardized panel components.
 * Provides consistent borders, padding, and styling across the application.
 * 
 * Used throughout the 4-panel layout system for Workspace, Channel, Main, and Agent panels.
 */
export const Panel = forwardRef<HTMLDivElement, PanelProps>(
  ({ className, variant = "default", bordered = true, padding = "p-4", children, ...props }, ref) => {
    const baseStyles = "flex flex-col overflow-hidden";
    
    const variantStyles = {
      default: "bg-slate-50 dark:bg-slate-900/50",
      subtle: "bg-white dark:bg-slate-900",
    };
    
    const borderStyles = bordered
      ? "border border-slate-200 dark:border-slate-800"
      : "";
    
    return (
      <div
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          borderStyles,
          padding,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Panel.displayName = "Panel";
