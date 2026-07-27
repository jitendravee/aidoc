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
 * `size` can be a single token, or a responsive object that scales the
 * text at different breakpoints — this is opt-in, so existing usages with
 * a plain string are unaffected.
 *
 * Usage:
 *   <Text>Default paragraph text</Text>
 *   <Text as="h1" size="4xl" weight="bold" family="heading">Big Heading</Text>
 *   <Text size="sm" color="text-secondary">Muted caption</Text>
 *   <Text as="span" color="error" weight="semibold">Something went wrong</Text>
 *   <Text as="label" htmlFor="email" size="sm" weight="medium">Email</Text>
 *   <Text as="h1" size={{ base: "4xl", lg: "6xl" }}>Responsive heading</Text>
 *   <Text size="2xs" color="text-secondary">Fine print</Text>
 *   <Text size="3xs" color="text-secondary" family="mono">Timestamp</Text>
 */

// ---- Token maps (keep these in sync with globals.css) ----

const sizeMap = {
  "3xs": "text-3xs",
  "2xs": "text-2xs",
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

// Tailwind's JIT compiler scans source files for literal class name
// strings — it can't detect a class built with `${breakpoint}:text-${size}`
// at runtime. So every responsive class this component could ever emit is
// spelled out here, once, up front.
const responsiveSizeMap = {
  sm: {
    "3xs": "sm:text-3xs",
    "2xs": "sm:text-2xs",
    xs: "sm:text-xs",
    sm: "sm:text-sm",
    base: "sm:text-base",
    lg: "sm:text-lg",
    xl: "sm:text-xl",
    "2xl": "sm:text-2xl",
    "3xl": "sm:text-3xl",
    "4xl": "sm:text-4xl",
    "6xl": "sm:text-6xl",
  },
  md: {
    "3xs": "md:text-3xs",
    "2xs": "md:text-2xs",
    xs: "md:text-xs",
    sm: "md:text-sm",
    base: "md:text-base",
    lg: "md:text-lg",
    xl: "md:text-xl",
    "2xl": "md:text-2xl",
    "3xl": "md:text-3xl",
    "4xl": "md:text-4xl",
    "6xl": "md:text-6xl",
  },
  lg: {
    "3xs": "lg:text-3xs",
    "2xs": "lg:text-2xs",
    xs: "lg:text-xs",
    sm: "lg:text-sm",
    base: "lg:text-base",
    lg: "lg:text-lg",
    xl: "lg:text-xl",
    "2xl": "lg:text-2xl",
    "3xl": "lg:text-3xl",
    "4xl": "lg:text-4xl",
    "6xl": "lg:text-6xl",
  },
  xl: {
    "3xs": "xl:text-3xs",
    "2xs": "xl:text-2xs",
    xs: "xl:text-xs",
    sm: "xl:text-sm",
    base: "xl:text-base",
    lg: "xl:text-lg",
    xl: "xl:text-xl",
    "2xl": "xl:text-2xl",
    "3xl": "xl:text-3xl",
    "4xl": "xl:text-4xl",
    "6xl": "xl:text-6xl",
  },
  "2xl": {
    "3xs": "2xl:text-3xs",
    "2xs": "2xl:text-2xs",
    xs: "2xl:text-xs",
    sm: "2xl:text-sm",
    base: "2xl:text-base",
    lg: "2xl:text-lg",
    xl: "2xl:text-xl",
    "2xl": "2xl:text-2xl",
    "3xl": "2xl:text-3xl",
    "4xl": "2xl:text-4xl",
    "6xl": "2xl:text-6xl",
  },
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
type Breakpoint = keyof typeof responsiveSizeMap;
type ResponsiveFontSize = { base?: FontSize } & Partial<Record<Breakpoint, FontSize>>;
type FontWeight = keyof typeof weightMap;
type TextColor = keyof typeof colorMap;
type FontFamily = keyof typeof familyMap;
type TextAlign = keyof typeof alignMap;

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const breakpoints: Breakpoint[] = ["sm", "md", "lg", "xl", "2xl"];

function resolveSizeClasses(size: FontSize | ResponsiveFontSize): string {
  if (typeof size === "string") {
    return sizeMap[size];
  }

  const classes: string[] = [];
  if (size.base) classes.push(sizeMap[size.base]);

  for (const bp of breakpoints) {
    const value = size[bp];
    if (value) classes.push(responsiveSizeMap[bp][value]);
  }

  return classes.join(" ");
}

type TextOwnProps<E extends React.ElementType> = {
  /** HTML tag or component to render. Defaults to "p". */
  as?: E;
  size?: FontSize | ResponsiveFontSize;
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

export default function Text<E extends React.ElementType = typeof defaultElement>({
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
        resolveSizeClasses(size),
        weightMap[weight],
        colorMap[color],
        align && alignMap[align],
        italic && "italic",
        truncate && "truncate",
        className
      )}
      {...rest}
    >
      {children}
    </Component>
  );
}