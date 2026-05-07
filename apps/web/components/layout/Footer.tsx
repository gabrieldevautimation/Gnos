import Link from 'next/link'

const footerLinks = {
  Serviços: [
    { label: 'Automação', href: '#servicos' },
    { label: 'Marketing',  href: '#servicos' },
    { label: 'Software',   href: '#servicos' },
  ],
  Empresa: [
    { label: 'Sobre',    href: '#manifesto' },
    { label: 'Processo', href: '#processo'  },
    { label: 'Contato',  href: '#contato'   },
  ],
  Social: [
    { label: 'Instagram', href: 'https://instagram.com/gnos.br' },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#0a0a0a]">
      <div className="container py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <span className="text-violet-400">◈</span>
              <span className="text-sm font-semibold text-zinc-100 tracking-tight">Gnos</span>
            </div>
            <p className="text-sm text-zinc-600 leading-relaxed">Conhecimento que move negócios.</p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group} className="flex flex-col gap-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-600">{group}</p>
              <div className="flex flex-col gap-3">
                {links.map(l => (
                  <a key={l.label} href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined}
                    rel={l.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="text-sm text-zinc-500 hover:text-zinc-200 transition-colors">
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-white/[0.05] pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-zinc-700">© {new Date().getFullYear()} Gnos Studio. Todos os direitos reservados.</p>
          <p className="text-xs text-zinc-700">Feito com ◈ no Brasil</p>
        </div>
      </div>
    </footer>
  )
}
