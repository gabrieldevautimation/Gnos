'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

const ease = [0.32, 0.72, 0, 1] as const
type State = 'idle' | 'sending' | 'success' | 'error'

const services = [
  { value: '',           label: 'Qual serviço você precisa?' },
  { value: 'automation', label: '⚡ Automação' },
  { value: 'marketing',  label: '📣 Marketing' },
  { value: 'software',   label: '💻 Software' },
  { value: 'all',        label: '🚀 Os três juntos' },
]

const inputCls = 'w-full rounded-lg border border-white/[0.08] bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-700 transition-all focus:outline-none focus:ring-1 focus:ring-violet-500/40 focus:border-violet-500/30'

export function Contact() {
  const [state, setState] = useState<State>('idle')
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', message: '' })

  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.service) return
    setState('sending')
    try {
      const r = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      setState(r.ok ? 'success' : 'error')
    } catch { setState('error') }
  }

  return (
    <section id="contato" className="bg-black py-32">
      <div className="container grid gap-20 lg:grid-cols-2 lg:items-center">
        {/* Left */}
        <motion.div
          initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="flex flex-col gap-6"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-500">◈ Contato</p>
          <h2 className="text-4xl font-bold tracking-tighter text-zinc-50 sm:text-5xl">
            Pronto para<br /><span className="gradient-text">crescer de verdade?</span>
          </h2>
          <p className="max-w-sm text-base leading-relaxed text-zinc-500">
            Conta pra gente o que tá travando seu negócio. A gente escuta, entende e propõe — sem enrolação e sem compromisso.
          </p>

          <div className="flex gap-10 pt-2">
            {[['3', 'Pilares'], ['48h', 'Resposta'], ['∞', 'Possibilidades']].map(([v, l]) => (
              <div key={l} className="flex flex-col gap-1">
                <span className="font-mono text-2xl font-bold text-violet-400 tracking-tight">{v}</span>
                <span className="text-xs uppercase tracking-widest text-zinc-600">{l}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right: form */}
        <motion.div
          initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
        >
          <div className="rounded-2xl border border-white/[0.08] bg-[#0d0d0d] p-8 inset-top-glow">
            {state === 'success' ? (
              <div className="flex flex-col items-center gap-4 py-10 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-violet-500/20 bg-violet-500/[0.06] text-xl font-bold text-violet-400">✓</div>
                <p className="text-lg font-semibold text-zinc-100">Mensagem enviada!</p>
                <p className="text-sm text-zinc-500">Retornamos em até 48 horas.</p>
              </div>
            ) : (
              <form onSubmit={submit} className="flex flex-col gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-zinc-500">Nome *</label>
                    <input name="name" value={form.name} onChange={set} placeholder="Seu nome" className={inputCls} required />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-zinc-500">Email *</label>
                    <input name="email" type="email" value={form.email} onChange={set} placeholder="seu@email.com" className={inputCls} required />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-zinc-500">WhatsApp</label>
                    <input name="phone" value={form.phone} onChange={set} placeholder="+55 11 99999-9999" className={inputCls} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-zinc-500">Serviço *</label>
                    <select name="service" value={form.service} onChange={set} className={inputCls} required>
                      {services.map(o => <option key={o.value} value={o.value} className="bg-zinc-950">{o.label}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-zinc-500">Mensagem</label>
                  <textarea name="message" value={form.message} onChange={set} rows={4} placeholder="Fale sobre seu negócio e o que precisa..." className={`${inputCls} resize-none`} />
                </div>

                {state === 'error' && <p className="text-xs text-red-400">Algo deu errado. Tente novamente.</p>}

                <button type="submit" disabled={state === 'sending'}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-white py-3 text-sm font-semibold text-black transition-colors hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed">
                  {state === 'sending' ? (
                    <><span className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />Enviando...</>
                  ) : 'Enviar mensagem →'}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
