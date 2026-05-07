import type { Metadata, Viewport } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Navbar } from '@/components/layout/Navbar'
import { TechEvolutionBackground } from '@/components/background/TechEvolutionBackground'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Gnos — Automação, Marketing e Software',
    template: '%s | Gnos',
  },
  description: 'Transformamos negócios com automação inteligente, marketing estratégico e software sob medida. Conhecimento que move resultados.',
  keywords: ['automação', 'marketing digital', 'software sob medida', 'desenvolvimento web', 'N8N', 'inteligência artificial'],
  authors: [{ name: 'Gnos Studio' }],
  creator: 'Gnos Studio',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://gnos.digital',
    siteName: 'Gnos',
    title: 'Gnos — Automação, Marketing e Software',
    description: 'Transformamos negócios com automação inteligente, marketing estratégico e software sob medida.',
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#000000',
  colorScheme: 'dark',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <TechEvolutionBackground />
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  )
}
