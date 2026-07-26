import React from "react";

/**
 * <Text /> — a single component for all text in the app.
 *
 * Every prop maps to a Tailwind utility that's generated from the CSS
 * variables in globals.css (@theme inline block). This means:
 *   - You can never pass a size/weight/color that isn't in your design system.
 *   - If you update globals.css, just update the maps below to match.
 *   - No inline styles, no arbitrary Tailwind values (like text-[19px]).
 *
 * Usage:
 *   <Text>Default paragraph text</Text>
 *   <Text as="h1" size="4xl" weight="bold" family="heading">Big Heading</Text>
 *   <Text size="sm" color="text-secondary">Muted caption</Text>
 *   <Text as="span" color="error" weight="semibold">Something went wrong</Text>
 *   <Text as="label" htmlFor="email" size="sm" weight="medium">Email</Text>
 */

// ---- Token maps (keep these in sync with globals.css) ----

const sizeMap = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
  "6xl": "text-6xl",
} as const;

const weightMap = {
  light: "font-light",
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
  extrabold: "font-extrabold",
} as const;

const colorMap = {
  foreground: "text-foreground",
  text: "text-text",
  "text-secondary": "text-text-secondary",
  primary: "text-primary",
  "primary-hover": "text-primary-hover",
  success: "text-success",
  warning: "text-warning",
  error: "text-error",
} as const;

const familyMap = {
  sans: "font-sans",
  heading: "font-heading",
  mono: "font-mono",
} as const;

const alignMap = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
  justify: "text-justify",
} as const;

type FontSize = keyof typeof sizeMap;
type FontWeight = keyof typeof weightMap;
type TextColor = keyof typeof colorMap;
type FontFamily = keyof typeof familyMap;
type TextAlign = keyof typeof alignMap;

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type TextOwnProps<E extends React.ElementType> = {
  /** HTML tag or component to render. Defaults to "p". */
  as?: E;
  size?: FontSize;
  weight?: FontWeight;
  color?: TextColor;
  family?: FontFamily;
  align?: TextAlign;
  italic?: boolean;
  truncate?: boolean;
  /** Escape hatch for one-off tweaks (e.g. margin) without breaking the system. */
  className?: string;
  children?: React.ReactNode;
};

type TextProps<E extends React.ElementType> = TextOwnProps<E> &
  Omit<React.ComponentPropsWithoutRef<E>, keyof TextOwnProps<E>>;

const defaultElement = "p";

export default function Text<
  E extends React.ElementType = typeof defaultElement,
>({
  as,
  size = "base",
  weight = "normal",
  color = "text",
  family = "sans",
  align,
  italic = false,
  truncate = false,
  className,
  children,
  ...rest
}: TextProps<E>) {
  const Component = as || defaultElement;

  return (
    <Component
      className={cn(
        familyMap[family],
        sizeMap[size],
        weightMap[weight],
        colorMap[color],
        align && alignMap[align],
        italic && "italic",
        truncate && "truncate",
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  );
}
