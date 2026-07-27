"use client";

import React from "react";
import { Loader2 } from "lucide-react";

/**
 * <Button /> — a single component for all buttons in the app.
 *
 * Variants and sizes map to the tokens in globals.css, same pattern as <Text />.
 *
 * Icons: pass a rendered lucide element, not the component reference.
 * This matters in the Next.js App Router — Server Components can only pass
 * plain, already-rendered JSX to Client Components as props, not raw
 * component functions (those fail with a "classes or objects with methods
 * are not supported" error). Button auto-sizes whatever icon you pass in
 * to match the button's `size`, unless you set a size on the icon yourself.
 *
 * Usage:
 *   <Button>Save changes</Button>
 *   <Button variant="outline" size="sm">Cancel</Button>
 *   <Button prefixIcon={<Plus />}>Add item</Button>
 *   <Button suffixIcon={<ArrowRight />} variant="primary">Continue</Button>
 *   <Button prefixIcon={<Trash2 />} variant="danger">Delete</Button>
 *   <Button isLoading>Saving...</Button>
 *   <Button fullWidth variant="secondary">Full width</Button>
 */

// ---- Token maps (keep these in sync with globals.css) ----

const variantMap = {
  primary:
    "bg-primary text-white hover:bg-primary-hover border border-transparent",
  secondary:
    "bg-surface-secondary text-text hover:bg-border border border-transparent",
  outline:
    "bg-transparent text-text border border-border hover:bg-surface-secondary",
  ghost:
    "bg-transparent text-text border border-transparent hover:bg-surface-secondary",
  danger:
    "bg-error text-white hover:bg-error/90 border border-transparent",
} as const;

// Responsive ladder per size: smaller on mobile, scales up at md/lg.
// These are written out as full literal strings (not built with template
// strings) because Tailwind's compiler only generates CSS for class names
// it can find as literal text in source — a class assembled at runtime
// like `${bp}:h-${n}` would never make it into the compiled CSS.
const sizeMap = {
  sm: "h-8 px-3 text-sm gap-1.5 rounded-sm",
  md: "h-9 px-3.5 text-sm gap-1.5 rounded-sm md:h-10 md:px-4 md:text-base md:gap-2 md:rounded-md",
  lg: "h-10 px-5 text-sm gap-1.5 rounded-md md:h-12 md:px-8 md:text-base md:gap-2 md:rounded-lg lg:h-14 lg:px-12 lg:text-lg lg:gap-2.5",
} as const;

// Icon sizing uses Tailwind width/height classes rather than the numeric
// `size` prop, since only CSS classes can respond to breakpoints — a plain
// number can't change based on screen width.
const iconClassMap = {
  sm: "size-3.5",
  md: "size-3.5 md:size-4",
  lg: "size-3.5 md:size-4 lg:size-[18px]",
} as const;

type Variant = keyof typeof variantMap;
type Size = keyof typeof sizeMap;

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

// Only auto-size the icon if the caller didn't already size it themselves
// (via `size` or their own width/height classes) — an explicit choice on
// the icon element always wins over the button's default.
function renderIcon(
  icon: React.ReactElement<{ size?: number | string; className?: string }> | undefined,
  autoSizeClasses: string
) {
  if (!icon) return null;
  const hasExplicitSize = icon.props.size !== undefined || icon.props.className !== undefined;
  return React.cloneElement(icon, {
    className: hasExplicitSize ? icon.props.className : autoSizeClasses,
  });
}

type ButtonOwnProps = {
  variant?: Variant;
  size?: Size;
  /** Rendered lucide element, e.g. <Plus /> (not the Plus component itself) */
  prefixIcon?: React.ReactElement<{ size?: number | string; className?: string }>;
  /** Rendered lucide element, e.g. <ArrowRight /> (not the ArrowRight component itself) */
  suffixIcon?: React.ReactElement<{ size?: number | string; className?: string }>;
  isLoading?: boolean;
  fullWidth?: boolean;
  className?: string;
  children?: React.ReactNode;
};

type ButtonProps = ButtonOwnProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonOwnProps>;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      prefixIcon,
      suffixIcon,
      isLoading = false,
      fullWidth = false,
      disabled,
      className,
      children,
      ...rest
    },
    ref
  ) => {
    const iconClasses = iconClassMap[size];

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-colors duration-150 cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          variantMap[variant],
          sizeMap[size],
          fullWidth && "w-full",
          className
        )}
        {...rest}
      >
        {isLoading ? (
          <Loader2 className={cn(iconClasses, "animate-spin")} />
        ) : (
          renderIcon(prefixIcon, iconClasses)
        )}
        {children}
        {!isLoading && renderIcon(suffixIcon, iconClasses)}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;