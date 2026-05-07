import * as React from 'react'
import { cn } from '../lib/utils'

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        className={cn(
          'flex h-9 w-full appearance-none rounded-lg border border-white/[0.08] bg-zinc-950 px-3 py-2 text-sm text-zinc-100',
          'transition-all cursor-pointer',
          'focus:outline-none focus:ring-1 focus:ring-[hsl(var(--ring))]/40 focus:border-[hsl(var(--ring))]/30',
          'disabled:cursor-not-allowed disabled:opacity-50',
          // chevron
          "bg-[url(\"data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2371717a' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E\")] bg-no-repeat bg-[right_12px_center] pr-9",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
    )
  }
)
Select.displayName = 'Select'

export { Select }
