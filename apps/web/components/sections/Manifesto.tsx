'use client'

import { useEffect, useRef } from 'react'
import styles from './Manifesto.module.css'

const text = [
  'Na filosofia antiga, Gnose não era apenas saber.',
  'Era um conhecimento que transformava.',
  'A diferença entre acumular informação',
  'e ser verdadeiramente iluminado por ela.',
]

export function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    let ctx: import('gsap').Context | undefined
    ;(async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)
      if (!sectionRef.current) return

      ctx = gsap.context(() => {
        gsap.from('.manifesto-line', {
          y: 50,
          opacity: 0,
          duration: 0.9,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 72%',
            toggleActions: 'play none none none',
          },
        })

        gsap.from('.manifesto-tag', {
          opacity: 0,
          duration: 0.7,
          delay: 0.2,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 72%',
          },
        })

        gsap.from('.manifesto-sub', {
          y: 30,
          opacity: 0,
          duration: 0.7,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
          },
        })
      }, sectionRef)
    })()
    return () => ctx?.revert()
  }, [])

  return (
    <section id="manifesto" ref={sectionRef} className={`section ${styles.section}`}>
      <div className={`container ${styles.inner}`}>
        <span className={`manifesto-tag ${styles.tag}`}>◈ Sobre a Gnos</span>

        <div className={styles.textBlock}>
          {text.map((line, i) => (
            <p key={i} className={`manifesto-line ${styles.line} ${i === 0 || i === 3 ? styles.accent : ''}`}>
              {line}
            </p>
          ))}
        </div>

        <p className={`manifesto-sub ${styles.sub}`}>
          É esse princípio que guia tudo que construímos. Cada automação, cada
          campanha, cada linha de código. Não somos uma agência — somos parceiros
          de conhecimento.
        </p>
      </div>
    </section>
  )
}
