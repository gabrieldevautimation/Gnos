'use client'

import { useEffect, useRef } from 'react'
import styles from './Hero.module.css'

// ─── Particle System ──────────────────────────────────────────────────────────
function initParticles(canvas: HTMLCanvasElement): () => void {
  const ctx = canvas.getContext('2d')!
  let animId: number
  const mouse = { x: -9999, y: -9999 }

  interface Particle {
    x: number; y: number
    vx: number; vy: number
    size: number; opacity: number
  }

  let particles: Particle[] = []

  const resize = () => {
    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight
    spawn()
  }

  const spawn = () => {
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 9000), 140)
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      size: Math.random() * 1.8 + 0.4,
      opacity: Math.random() * 0.55 + 0.1,
    }))
  }

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]!

      // Connect nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j]!
        const dx = p.x - q.x
        const dy = p.y - q.y
        const d  = Math.hypot(dx, dy)
        const MAX = 110
        if (d < MAX) {
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(q.x, q.y)
          ctx.strokeStyle = `rgba(123,94,248,${0.18 * (1 - d / MAX)})`
          ctx.lineWidth = 0.6
          ctx.stroke()
        }
      }

      // Connect to mouse
      const mdx = p.x - mouse.x
      const mdy = p.y - mouse.y
      const md  = Math.hypot(mdx, mdy)
      if (md < 160) {
        ctx.beginPath()
        ctx.moveTo(p.x, p.y)
        ctx.lineTo(mouse.x, mouse.y)
        ctx.strokeStyle = `rgba(167,139,250,${0.35 * (1 - md / 160)})`
        ctx.lineWidth = 0.9
        ctx.stroke()
      }

      // Draw dot
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(167,139,250,${p.opacity})`
      ctx.fill()
    }
  }

  const update = () => {
    particles.forEach(p => {
      p.x += p.vx
      p.y += p.vy
      if (p.x < 0)              p.x = canvas.width
      if (p.x > canvas.width)   p.x = 0
      if (p.y < 0)              p.y = canvas.height
      if (p.y > canvas.height)  p.y = 0
    })
  }

  const loop = () => { update(); draw(); animId = requestAnimationFrame(loop) }

  const onMouse = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY }
  const onLeave = ()              => { mouse.x = -9999;     mouse.y = -9999 }

  resize()
  loop()
  window.addEventListener('resize', resize)
  window.addEventListener('mousemove', onMouse)
  window.addEventListener('mouseleave', onLeave)

  return () => {
    cancelAnimationFrame(animId)
    window.removeEventListener('resize', resize)
    window.removeEventListener('mousemove', onMouse)
    window.removeEventListener('mouseleave', onLeave)
  }
}

// ─── Hero Component ───────────────────────────────────────────────────────────
export function Hero() {
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // Particles
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    return initParticles(canvas)
  }, [])

  // GSAP entrance animation
  useEffect(() => {
    let ctx: import('gsap').Context | undefined
    ;(async () => {
      const { gsap } = await import('gsap')
      if (!contentRef.current) return

      ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

        tl.from('.hero-badge', { y: 20, opacity: 0, duration: 0.7, delay: 0.3 })
          .from('.hero-line-1', { y: 60, opacity: 0, duration: 0.9 }, '-=0.3')
          .from('.hero-line-2', { y: 60, opacity: 0, duration: 0.9 }, '-=0.6')
          .from('.hero-sub',    { y: 30, opacity: 0, duration: 0.7 }, '-=0.5')
          .from('.hero-ctas',   { y: 20, opacity: 0, duration: 0.6 }, '-=0.4')
          .from('.hero-scroll', { opacity: 0, duration: 0.5 }, '-=0.2')
      }, contentRef)
    })()

    return () => ctx?.revert()
  }, [])

  const scrollToServices = () => {
    document.querySelector('#servicos')?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToContact = () => {
    document.querySelector('#contato')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className={styles.hero} id="home">
      {/* Particle canvas */}
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />

      {/* Radial glow behind content */}
      <div className={styles.radialGlow} aria-hidden="true" />

      {/* Content */}
      <div className={`container ${styles.content}`} ref={contentRef}>
        {/* Badge */}
        <div className={`hero-badge ${styles.badge}`}>
          <span className={styles.badgeDot} />
          Studio de Tecnologia
        </div>

        {/* Headline */}
        <h1 className={styles.headline}>
          <span className={`hero-line-1 ${styles.line1}`}>
            Nós automatizamos.
          </span>
          <span className={`hero-line-2 ${styles.line2} gradient-text`}>
            Você cresce.
          </span>
        </h1>

        {/* Subheadline */}
        <p className={`hero-sub ${styles.sub}`}>
          Automação inteligente, marketing estratégico e software sob medida
          <br />
          para negócios que recusam ficar pra trás.
        </p>

        {/* CTAs */}
        <div className={`hero-ctas ${styles.ctas}`}>
          <button onClick={scrollToContact} className={styles.ctaPrimary}>
            Falar com a Gnos
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button onClick={scrollToServices} className={styles.ctaSecondary}>
            Ver serviços
          </button>
        </div>

        {/* Scroll indicator */}
        <div className={`hero-scroll ${styles.scrollIndicator}`} aria-hidden="true">
          <div className={styles.scrollLine} />
          <span>scroll</span>
        </div>
      </div>
    </section>
  )
}
