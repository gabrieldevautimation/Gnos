'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

const links = [
  { label: 'Serviços', href: '#servicos' },
  { label: 'Processo', href: '#processo' },
  { label: 'Sobre',    href: '#manifesto' },
  { label: 'Contato',  href: '#contato' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const go = (href: string) => {
    setOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className={cn(
      'fixed inset-x-0 top-0 z-50 transition-all duration-300',
      scrolled && 'border-b border-white/[0.06] bg-black/85 backdrop-blur-md',
    )}>
      <div className="container flex h-16 items-center gap-8">
        {/* Logo */}
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2.5 text-sm font-semibold text-zinc-100 tracking-tight mr-auto">
          <span className="text-violet-400 text-base leading-none">◈</span>
          Gnos
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <button key={l.href} onClick={() => go(l.href)}
              className="px-3 py-2 text-sm text-zinc-500 hover:text-zinc-200 transition-colors rounded-md hover:bg-white/5">
              {l.label}
            </button>
          ))}
        </nav>

        {/* CTA */}
        <button onClick={() => go('#contato')}
          className="hidden md:inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-zinc-100">
          Falar com a Gnos
        </button>

        {/* Hamburger */}
        <button onClick={() => setOpen(v => !v)} className="md:hidden p-2 text-zinc-400 hover:text-zinc-100" aria-label="Menu">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            {open ? (
              <path d="M1 1l16 16M17 1L1 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            ) : (
              <>
                <path d="M1 4h16M1 9h16M1 14h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-white/[0.06] bg-black/95 px-5 py-4 flex flex-col gap-1">
          {links.map(l => (
            <button key={l.href} onClick={() => go(l.href)}
              className="py-3 text-left text-sm text-zinc-400 hover:text-zinc-100 transition-colors border-b border-white/[0.04] last:border-0">
              {l.label}
            </button>
          ))}
          <button onClick={() => go('#contato')}
            className="mt-3 w-full rounded-md bg-white py-2.5 text-sm font-semibold text-black">
            Falar com a Gnos
          </button>
        </div>
      )}
    </header>
  )
}
