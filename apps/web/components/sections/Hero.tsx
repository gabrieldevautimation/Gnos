'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const ease = [0.32, 0.72, 0, 1] as const

const item = {
  hidden: { opacity: 0, y: 14 },
  show:   { opacity: 1, y: 0 },
}

export function Hero() {
  const sectionRef = useRef<HTMLSectionElement>(null)
  const canvasRef  = useRef<HTMLCanvasElement>(null)

  const go = (id: string) => document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })

  /* ── Canvas particles ────────────────────────────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf: number
    let mouse = { x: -500, y: -500 }

    interface Particle { x: number; y: number; vx: number; vy: number; r: number }
    let particles: Particle[] = []

    const resize = () => {
      canvas.width  = canvas.offsetWidth * devicePixelRatio
      canvas.height = canvas.offsetHeight * devicePixelRatio
      ctx.scale(devicePixelRatio, devicePixelRatio)
      spawn()
    }

    const spawn = () => {
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      const count = Math.min(Math.floor((w * h) / 6000), 220)
      particles = Array.from({ length: count }, () => ({
        x:  Math.random() * w,
        y:  Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r:  Math.random() * 1.4 + 0.5,
      }))
    }

    const draw = () => {
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      ctx.clearRect(0, 0, w, h)

      const MAX = 150

      for (const p of particles) {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(124,58,237,0.35)'
        ctx.fill()
      }

      // connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const d  = Math.sqrt(dx * dx + dy * dy)
          if (d < MAX) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(124,58,237,${0.28 * (1 - d / MAX)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
        // mouse connection
        const dx = particles[i].x - mouse.x
        const dy = particles[i].y - mouse.y
        const d  = Math.sqrt(dx * dx + dy * dy)
        if (d < 180) {
          ctx.beginPath()
          ctx.moveTo(particles[i].x, particles[i].y)
          ctx.lineTo(mouse.x, mouse.y)
          ctx.strokeStyle = `rgba(167,139,250,${0.4 * (1 - d / 180)})`
          ctx.lineWidth = 0.6
          ctx.stroke()
        }
      }

      raf = requestAnimationFrame(draw)
    }

    const onMouse = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect()
      mouse = { x: e.clientX - r.left, y: e.clientY - r.top }
    }

    resize()
    draw()
    window.addEventListener('resize', resize)
    canvas.addEventListener('mousemove', onMouse)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', onMouse)
    }
  }, [])

  /* ── GSAP parallax 3D on mouse ───────────────────────────────────────── */
  useEffect(() => {
    let gsapModule: typeof import('gsap') | null = null

    import('gsap').then(mod => {
      gsapModule = mod
    })

    const handleMouseMove = (e: MouseEvent) => {
      if (!gsapModule) return
      const gsap = gsapModule.gsap
      const x = (e.clientX / window.innerWidth  - 0.5) * 2
      const y = (e.clientY / window.innerHeight - 0.5) * 2

      gsap.to('.hero-headline', {
        rotateX: -y * 4,
        rotateY: x * 4,
        transformPerspective: 1000,
        ease: 'power1.out',
        duration: 0.8,
      })
      gsap.to('.hero-badge', {
        x: x * 12,
        y: y * 8,
        ease: 'power1.out',
        duration: 0.8,
      })
      gsap.to('.hero-sub', {
        x: x * 6,
        y: y * 4,
        ease: 'power1.out',
        duration: 0.8,
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <section ref={sectionRef} id="home" className="relative flex min-h-svh flex-col justify-center overflow-hidden bg-black">
      {/* Canvas particles */}
      <canvas
        ref={canvasRef}
        className="pointer-events-auto absolute inset-0 h-full w-full scanlines"
      />

      {/* Top radial gradient — subtle brand */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(124,58,237,0.10) 0%, transparent 100%)',
        }}
      />

      {/* Vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(0,0,0,0.7) 100%)' }}
      />

      {/* Content */}
      <div className="container relative z-10 pt-36 pb-24">
        <motion.div
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.09 }}
          className="flex flex-col items-start gap-7"
        >
          {/* Badge */}
          <motion.div variants={item} transition={{ duration: 0.5, ease }} className="hero-badge">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-zinc-400 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-400" />
              Studio de Tecnologia
            </span>
          </motion.div>

          {/* Headline with glow */}
          <div className="relative">
            {/* Glow pulsante atrás do título */}
            <div
              className="pointer-events-none absolute left-0 top-1/2 -z-10 h-[120%] w-full"
              style={{
                background: 'radial-gradient(ellipse at 30% 50%, rgba(124,58,237,0.15) 0%, transparent 60%)',
                filter: 'blur(40px)',
                animation: 'glowPulse 4s ease-in-out infinite',
                transform: 'translateY(-50%)',
              }}
            />
            <motion.h1
              variants={item}
              transition={{ duration: 0.6, ease }}
              className="hero-headline max-w-3xl text-balance font-sans text-6xl font-bold tracking-tighter text-zinc-50 sm:text-7xl md:text-8xl lg:text-[5.5rem] leading-[1.0]"
              style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
            >
              <span className="block">Nós automatizamos.</span>
              <span className="block gradient-text">Você cresce.</span>
            </motion.h1>
          </div>

          {/* Subtitle */}
          <motion.p
            variants={item}
            transition={{ duration: 0.5, ease }}
            className="hero-sub max-w-md text-base leading-relaxed text-zinc-500 sm:text-lg"
          >
            Automação inteligente, marketing estratégico e software sob medida
            para negócios que recusam ficar pra trás.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={item}
            transition={{ duration: 0.5, ease }}
            className="flex flex-wrap items-center gap-3"
          >
            <button
              onClick={() => go('#contato')}
              className="shimmer-cta inline-flex items-center gap-2 rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-zinc-100"
            >
              Falar com a Gnos
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              onClick={() => go('#servicos')}
              className="inline-flex items-center rounded-md border border-white/10 px-5 py-2.5 text-sm font-medium text-zinc-400 transition-all hover:border-white/20 hover:text-zinc-200 hover:bg-white/[0.03]"
            >
              Ver serviços
            </button>
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="absolute bottom-10 left-8 flex items-center gap-3 text-xs tracking-widest text-zinc-700 uppercase"
        >
          <span className="h-px w-8 bg-zinc-800" />
          scroll
        </motion.div>
      </div>
    </section>
  )
}
