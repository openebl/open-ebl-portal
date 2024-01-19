import * as React from "react"

import { cn } from "@/lib/utils"

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-lg border border-border-dark bg-background px-3 py-2 text-[0.8125rem] leading-[1.125rem] ring-offset-border-light file:border-0 file:bg-transparent font-normal file:font-medium placeholder:text-hint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3C7EFF] focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:bg-[#F1F0F0]",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
