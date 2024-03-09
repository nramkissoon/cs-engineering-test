import { cn } from "~/lib/utils";
import { Button as ShadcnButton } from "./ui/button";
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 font-semibold gap-x-2",
  {
    variants: {
      variant: {
        default: "bg-indigo-500 text-white",
      },
      size: {
        default: "py-3 px-6 h-12 rounded-xl text-base",
        sm: "py-2 px-3 h-9 rounded-[10px] text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  LeftIcon?: React.FC<React.SVGProps<SVGSVGElement>>;
  RightIcon?: React.FC<React.SVGProps<SVGSVGElement>>;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      RightIcon,
      LeftIcon,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? ShadcnButton : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {LeftIcon && <LeftIcon className="stroke-white" />}
        {props.children}
        {RightIcon && <RightIcon className="stroke-white" />}
      </Comp>
    );
  },
);
Button.displayName = "Button";
