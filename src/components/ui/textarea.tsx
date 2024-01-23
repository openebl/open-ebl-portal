import * as React from "react"

import { cn } from "@/lib/utils"

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-border-dark bg-background px-3 py-2 text-[0.8125rem] leading-[1.125rem] ring-offset-border-light placeholder:text-hint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3C7EFF] focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:bg-[#F1F0F0]",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
