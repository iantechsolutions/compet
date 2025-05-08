import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "~/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/85", // Para crear
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/85", // Para eliminar
        outline:
          "border border-input bg-accent/80 shadow-sm hover:bg-accent/60 text-secondary-foreground", // Para botones de Cerrar
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80", // Para Editar
        ghost: "hover:text-muted-foreground mx-0", // Para Info
        link: "text-primary underline-offset-4 hover:underline",
        transparent:
          "bg-transparent hover:bg-transparent shadow-none border-none text-primary ",
        sidebar:"bg-transparent hover:bg-transparent shadow-none border-none text-primary",
        sidebar_subitem: "bg-blue-400/50 hover:bg-transparent shadow-none border-none text-primary",
      },
      size: {
        default: "h-7 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-10 px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
