import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border bg-[#e8e0d4] border-[#4d3d30] px-3 py-2 text-sm placeholder:text-[#4d3d30] placeholder:text-opacity-40 ring-offset-[#ede7ea] file:border-0 file:bg-transparent file:text-sm file:font-medium  focus-visible:outline-2 focus-visible:outline-[#4d3d30] placeholder:opacity-65 disabled:cursor-not-allowed disabled:opacity-50",
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
