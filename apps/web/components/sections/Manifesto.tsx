'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const ease = [0.32, 0.72, 0, 1] as const
const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

const lines = [
  { text: 'Na filosofia antiga, Gnose não era apenas saber.', accent: true },
  { text: 'Era um conhecimento que transformava.', accent: false },
  { text: 'A diferença entre acumular informação', accent: false },
  { text: 'e ser verdadeiramente iluminado por ela.', accent: true },
]

export function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null)

  /* ── GSAP clip-path reveal ───────────────────────────────────────────── */
  useEffect(() => {
    if (!sectionRef.current) return
    let ctx: { revert: () => void } | null = null

    import('gsap').then(async ({ gsap }) => {
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        gsap.fromTo('.manifesto-line',
          {
            clipPath: 'inset(0 100% 0 0)',
            opacity: 0,
          },
          {
            clipPath: 'inset(0 0% 0 0)',
            opacity: 1,
            duration: 1.1,
            stagger: 0.25,
            ease: 'power3.inOut',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 72%',
              toggleActions: 'play none none none',
            },
          }
        )
      }, sectionRef)
    })

    return () => ctx?.revert()
  }, [])

  return (
    <section ref={sectionRef} id="manifesto" className="relative border-y border-white/[0.06] bg-[#0a0a0a] py-32">
      <div className="container max-w-3xl">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease }}
          className="mb-10 text-xs font-semibold uppercase tracking-[0.14em] text-violet-500"
        >
          ◈ Sobre a Gnos
        </motion.p>

        <div className="flex flex-col gap-1.5 mb-12">
          {lines.map((l, i) => (
            <p
              key={i}
              className={`manifesto-line font-sans text-3xl font-semibold leading-tight tracking-tight sm:text-4xl md:text-5xl ${
                l.accent ? 'text-zinc-100' : 'text-zinc-600'
              }`}
              style={{ clipPath: 'inset(0 100% 0 0)', opacity: 0 }}
            >
              {l.text}
            </p>
          ))}
        </div>

        <motion.p
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.6, ease, delay: 0.5 }}
          className="border-l-2 border-violet-500/40 pl-5 text-base leading-relaxed text-zinc-500 sm:text-lg"
        >
          É esse princípio que guia tudo que construímos. Cada automação, cada
          campanha, cada linha de código. Não somos uma agência — somos parceiros
          de conhecimento.
        </motion.p>
      </div>
    </section>
  )
}
