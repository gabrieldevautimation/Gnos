'use client'

import { useEffect, useRef } from 'react'
import styles from './Services.module.css'

const services = [
  {
    icon: '⚡',
    id: 'automation',
    title: 'Automação',
    description:
      'Elimine o trabalho repetitivo. Conectamos seus sistemas, criamos fluxos inteligentes com N8N e AI Agents, e fazemos sua operação rodar no piloto automático.',
    items: ['Fluxos N8N customizados', 'AI Agents', 'Integrações entre sistemas', 'WhatsApp Business API'],
  },
  {
    icon: '📣',
    id: 'marketing',
    title: 'Marketing',
    description:
      'Amplifique sua presença digital com estratégia real. Conteúdo, tráfego, posicionamento — tudo alinhado para gerar resultados mensuráveis.',
    items: ['Estratégia de conteúdo', 'Gestão de redes sociais', 'Tráfego pago', 'SEO e presença orgânica'],
  },
  {
    icon: '💻',
    id: 'software',
    title: 'Software',
    description:
      'Da ideia ao produto. Criamos dashboards, sistemas internos, sites e SaaS sob medida — com código limpo, escalável e sem dívida técnica.',
    items: ['Sites e landing pages', 'Sistemas web (SaaS)', 'Dashboards internos', 'APIs e integrações'],
  },
]

export function Services() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    let ctx: import('gsap').Context | undefined
    ;(async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)
      if (!sectionRef.current) return

      ctx = gsap.context(() => {
        gsap.from('.services-header', {
          y: 40, opacity: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        })
        gsap.from('.service-card', {
          y: 60, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: '.services-grid', start: 'top 75%' },
        })
      }, sectionRef)
    })()
    return () => ctx?.revert()
  }, [])

  return (
    <section id="servicos" ref={sectionRef} className={`section ${styles.section}`}>
      <div className="container">
        {/* Header */}
        <div className={`services-header ${styles.header}`}>
          <span className={styles.tag}>◈ O que fazemos</span>
          <h2 className={`text-h2 ${styles.title}`}>
            Três pilares.<br />
            <span className="gradient-text">Um só parceiro.</span>
          </h2>
          <p className={styles.subtitle}>
            Não somos especialistas em uma coisa. Somos especialistas em fazer
            seu negócio crescer — com as ferramentas certas.
          </p>
        </div>

        {/* Cards */}
        <div className={`services-grid ${styles.grid}`}>
          {services.map(s => (
            <div key={s.id} className={`service-card ${styles.card}`}>
              <div className={styles.cardGlow} aria-hidden="true" />

              <span className={styles.icon} aria-hidden="true">{s.icon}</span>

              <h3 className={`text-h3 ${styles.cardTitle}`}>{s.title}</h3>
              <p className={styles.cardDesc}>{s.description}</p>

              <ul className={styles.list}>
                {s.items.map(item => (
                  <li key={item} className={styles.listItem}>
                    <span className={styles.listDot} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
