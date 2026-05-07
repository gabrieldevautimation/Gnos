'use client'

import { useEffect, useRef } from 'react'
import styles from './Process.module.css'

const steps = [
  {
    number: '01',
    title: 'Diagnóstico',
    description: 'Entendemos seu negócio, mapeamos os gargalos e identificamos onde automação, marketing ou software geram mais impacto.',
  },
  {
    number: '02',
    title: 'Proposta',
    description: 'Desenvolvemos uma solução sob medida com escopo claro, cronograma realista e investimento definido. Sem surpresas.',
  },
  {
    number: '03',
    title: 'Execução',
    description: 'Construímos rápido e com qualidade. Você acompanha cada entrega em tempo real pelo nosso portal de clientes.',
  },
  {
    number: '04',
    title: 'Resultado',
    description: 'Entregamos, medimos e evoluímos. Seu negócio opera melhor. Esse é o único resultado que nos interessa.',
  },
]

export function Process() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    let ctx: import('gsap').Context | undefined
    ;(async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)
      if (!sectionRef.current) return

      ctx = gsap.context(() => {
        gsap.from('.process-header', {
          y: 40, opacity: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        })
        gsap.from('.process-step', {
          x: -40, opacity: 0, duration: 0.7, stagger: 0.18, ease: 'power3.out',
          scrollTrigger: { trigger: '.process-list', start: 'top 75%' },
        })
        gsap.from('.process-line-fill', {
          scaleY: 0, duration: 1.2, ease: 'power2.out',
          transformOrigin: 'top center',
          scrollTrigger: { trigger: '.process-list', start: 'top 70%' },
        })
      }, sectionRef)
    })()
    return () => ctx?.revert()
  }, [])

  return (
    <section id="processo" ref={sectionRef} className={`section ${styles.section}`}>
      <div className="container">
        <div className={`process-header ${styles.header}`}>
          <span className={styles.tag}>◈ Como trabalhamos</span>
          <h2 className={`text-h2 ${styles.title}`}>
            Simples.<br />
            <span className="gradient-text">Do diagnóstico ao resultado.</span>
          </h2>
        </div>

        <div className={`process-list ${styles.list}`}>
          {/* Connecting line */}
          <div className={styles.lineTrack}>
            <div className={`process-line-fill ${styles.lineFill}`} />
          </div>

          {steps.map((step, i) => (
            <div key={step.number} className={`process-step ${styles.step}`}>
              <div className={styles.stepLeft}>
                <div className={styles.stepNumber}>{step.number}</div>
                {i < steps.length - 1 && <div className={styles.stepConnector} />}
              </div>
              <div className={styles.stepContent}>
                <h3 className={`text-h3 ${styles.stepTitle}`}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
