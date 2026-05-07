'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './Contact.module.css'

type FormState = 'idle' | 'sending' | 'success' | 'error'

const serviceOptions = [
  { value: '', label: 'Qual serviço você precisa?' },
  { value: 'automation', label: '⚡ Automação' },
  { value: 'marketing',  label: '📣 Marketing' },
  { value: 'software',   label: '💻 Software' },
  { value: 'all',        label: '🚀 Os três juntos' },
]

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const [formState, setFormState] = useState<FormState>('idle')
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', message: '' })

  useEffect(() => {
    let ctx: import('gsap').Context | undefined
    ;(async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)
      if (!sectionRef.current) return

      ctx = gsap.context(() => {
        gsap.from('.contact-left',  { x: -50, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 72%' } })
        gsap.from('.contact-right', { x:  50, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 72%' } })
      }, sectionRef)
    })()
    return () => ctx?.revert()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.service) return
    setFormState('sending')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setFormState(res.ok ? 'success' : 'error')
    } catch {
      setFormState('error')
    }
  }

  return (
    <section id="contato" ref={sectionRef} className={`section ${styles.section}`}>
      <div className={`container ${styles.inner}`}>
        {/* Left — copy */}
        <div className={`contact-left ${styles.left}`}>
          <span className={styles.tag}>◈ Contato</span>
          <h2 className={`text-h2 ${styles.title}`}>
            Pronto para<br />
            <span className="gradient-text">crescer de verdade?</span>
          </h2>
          <p className={styles.desc}>
            Conta pra gente o que tá travando seu negócio. A gente escuta,
            entende e propõe uma solução — sem enrolação e sem compromisso.
          </p>

          <div className={styles.stats}>
            {[
              { value: '3',   label: 'Pilares de serviço' },
              { value: '48h', label: 'Resposta garantida' },
              { value: '∞',   label: 'Possibilidades' },
            ].map(s => (
              <div key={s.label} className={styles.stat}>
                <span className={styles.statValue}>{s.value}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — form */}
        <div className={`contact-right ${styles.right}`}>
          <div className={`glass-strong ${styles.formCard}`}>
            {formState === 'success' ? (
              <div className={styles.success}>
                <span className={styles.successIcon}>✓</span>
                <h3 className={styles.successTitle}>Mensagem enviada!</h3>
                <p className={styles.successDesc}>Retornamos em até 48 horas. Até já.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label className={styles.label}>Nome *</label>
                    <input name="name" value={form.name} onChange={handleChange} placeholder="Seu nome" className={styles.input} required />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Email *</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="seu@email.com" className={styles.input} required />
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.field}>
                    <label className={styles.label}>WhatsApp</label>
                    <input name="phone" value={form.phone} onChange={handleChange} placeholder="+55 11 99999-9999" className={styles.input} />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Serviço *</label>
                    <select name="service" value={form.service} onChange={handleChange} className={`${styles.input} ${styles.select}`} required>
                      {serviceOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Mensagem</label>
                  <textarea name="message" value={form.message} onChange={handleChange} placeholder="Fale um pouco sobre seu negócio e o que você precisa..." className={`${styles.input} ${styles.textarea}`} rows={4} />
                </div>

                {formState === 'error' && (
                  <p className={styles.errorMsg}>Algo deu errado. Tente novamente ou nos chame no Instagram.</p>
                )}

                <button type="submit" className={styles.submit} disabled={formState === 'sending'}>
                  {formState === 'sending' ? (
                    <><span className={styles.spinner} />Enviando...</>
                  ) : (
                    <>Enviar mensagem <span aria-hidden="true">→</span></>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
