'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './Navbar.module.css'

const navLinks = [
  { label: 'Serviços',  href: '#servicos' },
  { label: 'Processo',  href: '#processo' },
  { label: 'Sobre',     href: '#manifesto' },
  { label: 'Contato',   href: '#contato' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNav = (href: string) => {
    setMenuOpen(false)
    const el = document.querySelector(href)
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header
      ref={navRef}
      className={`${styles.nav} ${scrolled ? styles.scrolled : ''} glass`}
    >
      <div className={`container ${styles.inner}`}>
        {/* Logo */}
        <a href="#" className={styles.logo} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className={styles.logoMark}>◈</span>
          <span className={styles.logoText}>Gnos</span>
        </a>

        {/* Desktop links */}
        <nav className={styles.links}>
          {navLinks.map(link => (
            <button
              key={link.href}
              onClick={() => handleNav(link.href)}
              className={styles.link}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* CTA */}
        <button
          onClick={() => handleNav('#contato')}
          className={styles.cta}
        >
          Falar com a Gnos
        </button>

        {/* Hamburger */}
        <button
          className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileOpen : ''}`}>
        {navLinks.map(link => (
          <button key={link.href} onClick={() => handleNav(link.href)} className={styles.mobileLink}>
            {link.label}
          </button>
        ))}
        <button onClick={() => handleNav('#contato')} className={styles.mobileCta}>
          Falar com a Gnos
        </button>
      </div>
    </header>
  )
}
