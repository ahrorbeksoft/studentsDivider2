"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

type TooltipVariant = "default" | "secondary" | "destructive" | "warning" | "outline";

const TooltipVariantContext = React.createContext<TooltipVariant | undefined>(undefined);

const tooltipVariants = cva(
  "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit rounded-md px-3 py-1.5 text-xs text-balance",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        destructive: "bg-destructive text-destructive-foreground",
        warning: "bg-yellow-500 text-yellow-900 dark:bg-yellow-400 dark:text-yellow-900",
        outline: "border border-input bg-background text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function TooltipProvider({ delayDuration = 0, ...props }: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return <TooltipPrimitive.Provider data-slot="tooltip-provider" delayDuration={delayDuration} {...props} />;
}

function Tooltip({
  variant,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root> & VariantProps<typeof tooltipVariants>) {
  return (
    <TooltipProvider>
      <TooltipVariantContext.Provider value={variant as TooltipVariant}>
        <TooltipPrimitive.Root data-slot="tooltip" {...props} />
      </TooltipVariantContext.Provider>
    </TooltipProvider>
  );
}

function TooltipTrigger({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({
  className,
  sideOffset = 0,
  children,
  variant: variantProp,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content> & VariantProps<typeof tooltipVariants>) {
  const contextVariant = React.useContext(TooltipVariantContext);
  const variant = variantProp || contextVariant;
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(tooltipVariants({ variant }), className)}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow
          className={cn(
            "z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]",
            variant === "default" && "bg-primary fill-primary",
            variant === "secondary" && "bg-secondary fill-secondary",
            variant === "destructive" && "bg-destructive fill-destructive",
            variant === "warning" && "bg-yellow-500 fill-yellow-500 dark:bg-yellow-400 dark:fill-yellow-400",
            variant === "outline" && "bg-background fill-background",
            !variant && "bg-primary fill-primary",
          )}
        />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider, tooltipVariants };
