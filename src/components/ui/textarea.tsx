import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn( 
          "flex min-h-[80px] w-full rounded-md border bg-[#e8e0d4] border-[#4d3d30] px-3 py-2 text-sm  placeholder:text-[#4d3d30] placeholder:text-opacity-40 focus-visible:ring-[#4d3d30] focus-visible:ring-offset-1 focus-visible:outline-2 focus-visible:outline-[#4d3d30] disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300",
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
