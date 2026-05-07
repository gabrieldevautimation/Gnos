import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default:     'border-white/[0.08] bg-white/[0.04] text-zinc-300',
        primary:     'border-violet-500/20 bg-violet-500/[0.08] text-violet-300',
        success:     'border-emerald-500/20 bg-emerald-500/[0.08] text-emerald-300',
        warning:     'border-amber-500/20 bg-amber-500/[0.08] text-amber-300',
        destructive: 'border-red-500/20 bg-red-500/[0.08] text-red-300',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
