import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'

export const metadata: Metadata = {
  title: {
    default: 'Gnos — Automação, Marketing e Software',
    template: '%s | Gnos',
  },
  description:
    'Transformamos negócios com automação inteligente, marketing estratégico e software sob medida. Conhecimento que move resultados.',
  keywords: [
    'automação',
    'marketing digital',
    'software sob medida',
    'desenvolvimento web',
    'N8N',
    'inteligência artificial',
    'startup',
    'tecnologia',
  ],
  authors: [{ name: 'Gnos Studio' }],
  creator: 'Gnos Studio',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://gnos.digital',
    siteName: 'Gnos',
    title: 'Gnos — Automação, Marketing e Software',
    description:
      'Transformamos negócios com automação inteligente, marketing estratégico e software sob medida.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gnos — Automação, Marketing e Software',
    description: 'Transformamos negócios com automação inteligente, marketing estratégico e software sob medida.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

export const viewport: Viewport = {
  themeColor: '#05050A',
  colorScheme: 'dark',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className="noise">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  )
}
