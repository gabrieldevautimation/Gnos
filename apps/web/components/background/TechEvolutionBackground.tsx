'use client'

/**
 * TechEvolutionBackground
 * ──────────────────────────────────────────────────────────────────────────
 * Fundo fixo que cobre toda a página e evolui conforme o scroll.
 * Inspirado na técnica do Corn Revolution (frame por scroll), mas sem
 * frames pré-renderizados: tudo é desenhado em Canvas 2D via Path2D.
 *
 * Eras (mapeadas em scrollProgress 0 → 1):
 *  0.00–0.11  Ferramenta de pedra
 *  0.11–0.22  Roda (4000 a.C.)
 *  0.22–0.33  Prensa de Gutenberg (1455)
 *  0.33–0.44  Motor a vapor (1765)
 *  0.44–0.55  Lâmpada elétrica (1879)
 *  0.55–0.66  Rádio / telégrafo (início séc. XX)
 *  0.66–0.77  Microprocessador (1971)
 *  0.77–0.88  Smartphone (anos 2010)
 *  0.88–1.00  IA / rede neural (LLM, presente)
 *
 * Cada era é um conjunto de Path2D desenhados no centro do viewport, e o
 * crossfade entre eras consecutivas é feito por opacidade + leve
 * transformação (escala + rotação) para sensação de "evolução".
 *
 * As partículas de fundo também mudam de cor e densidade conforme a era,
 * reforçando a sensação de mudança ao longo da página.
 *
 * Dependências usadas (já presentes no projeto):
 *  - gsap@3.12.5
 *  - gsap/ScrollTrigger
 *
 * Dependências NOVAS: ZERO. Não instalar nada.
 */

import { useEffect, useRef } from 'react'

/* ─── Eras: definição declarativa ────────────────────────────────────── */

type EraId =
  | 'stone'
  | 'wheel'
  | 'press'
  | 'steam'
  | 'bulb'
  | 'radio'
  | 'chip'
  | 'phone'
  | 'ai'

interface Era {
  id: EraId
  /** Cor primária das partículas/linhas dessa era */
  color: string
  /** Cor de acento (glow) dessa era */
  accent: string
  /** Densidade relativa de partículas (1 = base) */
  density: number
  /** Função que desenha o ícone central da era. Recebe ctx normalizado:
   *  origem no centro, escala 1 = aproximadamente 220px de altura. */
  draw: (ctx: CanvasRenderingContext2D, t: number) => void
}

/* Helper: desenha com cor e largura padronizadas */
const stroke = (ctx: CanvasRenderingContext2D, color: string, w = 2) => {
  ctx.strokeStyle = color
  ctx.lineWidth = w
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
}

const ERAS: Era[] = [
  /* 1) Ferramenta de pedra — formato angular tipo machado primitivo */
  {
    id: 'stone',
    color: 'rgba(180, 150, 120, 0.55)',
    accent: 'rgba(220, 180, 140, 0.35)',
    density: 0.6,
    draw: (ctx, _t) => {
      stroke(ctx, '#b89678', 2.5)
      ctx.beginPath()
      // forma irregular de pedra lascada
      ctx.moveTo(-60, -40)
      ctx.lineTo(40, -70)
      ctx.lineTo(80, -10)
      ctx.lineTo(60, 50)
      ctx.lineTo(-20, 70)
      ctx.lineTo(-70, 20)
      ctx.closePath()
      ctx.stroke()
      // textura de lascas
      ctx.beginPath()
      ctx.moveTo(-30, -20); ctx.lineTo(20, -40)
      ctx.moveTo(10, 0);    ctx.lineTo(50, 20)
      ctx.moveTo(-40, 30);  ctx.lineTo(0, 50)
      ctx.stroke()
    },
  },

  /* 2) Roda — círculo com raios */
  {
    id: 'wheel',
    color: 'rgba(180, 140, 100, 0.6)',
    accent: 'rgba(220, 170, 110, 0.4)',
    density: 0.7,
    draw: (ctx, t) => {
      stroke(ctx, '#c9a276', 2.5)
      // aro externo
      ctx.beginPath()
      ctx.arc(0, 0, 90, 0, Math.PI * 2)
      ctx.stroke()
      // aro interno
      ctx.beginPath()
      ctx.arc(0, 0, 18, 0, Math.PI * 2)
      ctx.stroke()
      // raios — rotação lenta para dar vida
      const rot = t * 0.0006
      for (let i = 0; i < 8; i++) {
        const a = rot + (i * Math.PI) / 4
        ctx.beginPath()
        ctx.moveTo(Math.cos(a) * 18, Math.sin(a) * 18)
        ctx.lineTo(Math.cos(a) * 88, Math.sin(a) * 88)
        ctx.stroke()
      }
    },
  },

  /* 3) Prensa de Gutenberg — caixa retangular com alavanca */
  {
    id: 'press',
    color: 'rgba(160, 130, 100, 0.6)',
    accent: 'rgba(200, 160, 110, 0.4)',
    density: 0.85,
    draw: (ctx, t) => {
      stroke(ctx, '#b89070', 2.5)
      // estrutura
      ctx.beginPath()
      ctx.rect(-70, -60, 140, 120)
      ctx.stroke()
      // parafuso central (linha vertical)
      ctx.beginPath()
      ctx.moveTo(0, -90); ctx.lineTo(0, -60)
      ctx.stroke()
      // alavanca horizontal — pequena oscilação
      const lever = Math.sin(t * 0.001) * 8
      ctx.beginPath()
      ctx.moveTo(-50, -90 + lever); ctx.lineTo(50, -90 - lever)
      ctx.stroke()
      // página dentro
      ctx.beginPath()
      ctx.rect(-45, -30, 90, 60)
      ctx.stroke()
      // linhas de texto
      ctx.beginPath()
      for (let i = -20; i <= 20; i += 12) {
        ctx.moveTo(-35, i); ctx.lineTo(35, i)
      }
      ctx.stroke()
    },
  },

  /* 4) Motor a vapor — caldeira cilíndrica + chaminé + vapor */
  {
    id: 'steam',
    color: 'rgba(170, 130, 110, 0.6)',
    accent: 'rgba(210, 160, 130, 0.4)',
    density: 1,
    draw: (ctx, t) => {
      stroke(ctx, '#b08878', 2.5)
      // caldeira
      ctx.beginPath()
      ctx.rect(-80, -20, 160, 70)
      ctx.stroke()
      // rodas
      ctx.beginPath()
      ctx.arc(-50, 60, 22, 0, Math.PI * 2)
      ctx.moveTo(72, 60)
      ctx.arc(50, 60, 22, 0, Math.PI * 2)
      ctx.stroke()
      // chaminé
      ctx.beginPath()
      ctx.rect(-65, -55, 22, 35)
      ctx.stroke()
      // vapor saindo (3 nuvenzinhas oscilando)
      const phase = t * 0.002
      stroke(ctx, '#d4b8a8', 1.8)
      for (let i = 0; i < 3; i++) {
        const y = -70 - i * 18
        const x = -54 + Math.sin(phase + i) * 6
        ctx.beginPath()
        ctx.arc(x, y, 7 + i * 1.5, 0, Math.PI * 2)
        ctx.stroke()
      }
    },
  },

  /* 5) Lâmpada elétrica — bulbo + filamento brilhante */
  {
    id: 'bulb',
    color: 'rgba(255, 220, 130, 0.55)',
    accent: 'rgba(255, 200, 80, 0.5)',
    density: 1.1,
    draw: (ctx, t) => {
      stroke(ctx, '#ffd87a', 2.5)
      // bulbo (pera)
      ctx.beginPath()
      ctx.moveTo(-40, 30)
      ctx.bezierCurveTo(-60, -10, -50, -70, 0, -75)
      ctx.bezierCurveTo(50, -70, 60, -10, 40, 30)
      ctx.lineTo(-40, 30)
      ctx.stroke()
      // base/rosca
      ctx.beginPath()
      ctx.rect(-25, 30, 50, 14)
      ctx.moveTo(-22, 48); ctx.lineTo(22, 48)
      ctx.moveTo(-20, 56); ctx.lineTo(20, 56)
      ctx.moveTo(-18, 64); ctx.lineTo(18, 64)
      ctx.stroke()
      // filamento — pulsando
      const glow = 0.6 + Math.sin(t * 0.003) * 0.4
      ctx.shadowColor = `rgba(255, 200, 80, ${glow})`
      ctx.shadowBlur = 20
      stroke(ctx, `rgba(255, 230, 150, ${glow})`, 2)
      ctx.beginPath()
      ctx.moveTo(-15, 10)
      ctx.quadraticCurveTo(-10, -20, 0, -30)
      ctx.quadraticCurveTo(10, -20, 15, 10)
      ctx.stroke()
      ctx.shadowBlur = 0
    },
  },

  /* 6) Rádio / antena — caixa com mostrador e ondas */
  {
    id: 'radio',
    color: 'rgba(160, 180, 200, 0.55)',
    accent: 'rgba(180, 210, 230, 0.4)',
    density: 1.2,
    draw: (ctx, t) => {
      stroke(ctx, '#a0bcd4', 2.5)
      // corpo
      ctx.beginPath()
      ctx.rect(-90, -30, 180, 90)
      ctx.stroke()
      // mostrador
      ctx.beginPath()
      ctx.rect(-70, -15, 100, 35)
      ctx.stroke()
      // marcação do mostrador
      ctx.beginPath()
      for (let i = -65; i <= 25; i += 10) {
        ctx.moveTo(i, -15); ctx.lineTo(i, -8)
      }
      ctx.stroke()
      // ponteiro
      const sweep = Math.sin(t * 0.0015) * 35
      stroke(ctx, '#c8e0f0', 2)
      ctx.beginPath()
      ctx.moveTo(-20 + sweep, -15); ctx.lineTo(-20 + sweep, 20)
      ctx.stroke()
      // botões
      stroke(ctx, '#a0bcd4', 2)
      ctx.beginPath()
      ctx.arc(50, 15, 8, 0, Math.PI * 2)
      ctx.moveTo(80, 15)
      ctx.arc(70, 15, 5, 0, Math.PI * 2)
      ctx.stroke()
      // antena com ondas
      ctx.beginPath()
      ctx.moveTo(0, -30); ctx.lineTo(0, -85)
      ctx.stroke()
      // ondas concêntricas pulsando
      const pulse = (t * 0.001) % 1
      for (let i = 0; i < 3; i++) {
        const p = (pulse + i / 3) % 1
        ctx.globalAlpha = 1 - p
        ctx.beginPath()
        ctx.arc(0, -85, 10 + p * 30, -Math.PI * 0.7, -Math.PI * 0.3)
        ctx.stroke()
      }
      ctx.globalAlpha = 1
    },
  },

  /* 7) Microprocessador — chip com pinos e trilhas internas */
  {
    id: 'chip',
    color: 'rgba(140, 200, 255, 0.55)',
    accent: 'rgba(120, 180, 255, 0.5)',
    density: 1.3,
    draw: (ctx, t) => {
      stroke(ctx, '#7fc0ff', 2.5)
      // corpo do chip
      ctx.beginPath()
      ctx.rect(-70, -70, 140, 140)
      ctx.stroke()
      // núcleo central
      ctx.beginPath()
      ctx.rect(-40, -40, 80, 80)
      ctx.stroke()
      // pinos — em todos os 4 lados
      ctx.beginPath()
      for (let i = -55; i <= 55; i += 18) {
        // topo
        ctx.moveTo(i, -70); ctx.lineTo(i, -90)
        // base
        ctx.moveTo(i, 70);  ctx.lineTo(i, 90)
        // esquerda
        ctx.moveTo(-70, i); ctx.lineTo(-90, i)
        // direita
        ctx.moveTo(70, i);  ctx.lineTo(90, i)
      }
      ctx.stroke()
      // trilhas internas — pulso animado percorre
      const flow = (t * 0.001) % 1
      stroke(ctx, '#a8d4ff', 1.5)
      ctx.beginPath()
      ctx.moveTo(-40, -20); ctx.lineTo(0, -20); ctx.lineTo(0, 20); ctx.lineTo(40, 20)
      ctx.moveTo(-40, 10);  ctx.lineTo(-15, 10); ctx.lineTo(-15, 30); ctx.lineTo(40, 30)
      ctx.stroke()
      // ponto de luz percorrendo a trilha
      const px = -40 + flow * 80
      const py = -20 + (flow > 0.5 ? 40 : 0)
      ctx.fillStyle = '#e0f0ff'
      ctx.shadowColor = '#7fc0ff'
      ctx.shadowBlur = 15
      ctx.beginPath()
      ctx.arc(px, py, 3, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0
    },
  },

  /* 8) Smartphone — retângulo com tela e detalhes */
  {
    id: 'phone',
    color: 'rgba(180, 150, 255, 0.55)',
    accent: 'rgba(160, 130, 240, 0.5)',
    density: 1.4,
    draw: (ctx, t) => {
      stroke(ctx, '#b298ff', 2.5)
      // corpo
      const r = 14
      ctx.beginPath()
      ctx.moveTo(-50 + r, -100)
      ctx.lineTo(50 - r, -100)
      ctx.quadraticCurveTo(50, -100, 50, -100 + r)
      ctx.lineTo(50, 100 - r)
      ctx.quadraticCurveTo(50, 100, 50 - r, 100)
      ctx.lineTo(-50 + r, 100)
      ctx.quadraticCurveTo(-50, 100, -50, 100 - r)
      ctx.lineTo(-50, -100 + r)
      ctx.quadraticCurveTo(-50, -100, -50 + r, -100)
      ctx.stroke()
      // tela
      ctx.beginPath()
      ctx.rect(-42, -86, 84, 168)
      ctx.stroke()
      // notch
      ctx.beginPath()
      ctx.rect(-15, -86, 30, 6)
      ctx.stroke()
      // ícones na tela — grade pulsando
      const pulse = 0.5 + Math.sin(t * 0.002) * 0.3
      ctx.fillStyle = `rgba(178, 152, 255, ${pulse})`
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 3; col++) {
          const x = -32 + col * 24
          const y = -60 + row * 24
          ctx.fillRect(x, y, 14, 14)
        }
      }
    },
  },

  /* 9) IA / rede neural — nós conectados pulsando */
  {
    id: 'ai',
    color: 'rgba(167, 139, 250, 0.65)',
    accent: 'rgba(124, 58, 237, 0.6)',
    density: 1.6,
    draw: (ctx, t) => {
      // 3 colunas: input (4), hidden (5), output (3)
      const cols: { x: number; ys: number[] }[] = [
        { x: -100, ys: [-60, -20, 20, 60] },
        { x: 0,    ys: [-80, -40, 0, 40, 80] },
        { x: 100,  ys: [-40, 0, 40] },
      ]

      stroke(ctx, 'rgba(167, 139, 250, 0.35)', 1)

      // arestas — todas as conexões col[i] → col[i+1]
      for (let i = 0; i < cols.length - 1; i++) {
        const a = cols[i]
        const b = cols[i + 1]
        for (const ya of a.ys) {
          for (const yb of b.ys) {
            ctx.beginPath()
            ctx.moveTo(a.x, ya)
            ctx.lineTo(b.x, yb)
            ctx.stroke()
          }
        }
      }

      // pulsos viajando pelas arestas
      const phase = (t * 0.0008) % 1
      ctx.fillStyle = 'rgba(220, 200, 255, 0.9)'
      ctx.shadowColor = '#a78bfa'
      ctx.shadowBlur = 10
      for (let i = 0; i < cols.length - 1; i++) {
        const a = cols[i]
        const b = cols[i + 1]
        for (let k = 0; k < 4; k++) {
          const ya = a.ys[(k * 2) % a.ys.length]
          const yb = b.ys[(k * 3) % b.ys.length]
          const p = (phase + k * 0.13) % 1
          const x = a.x + (b.x - a.x) * p
          const y = ya + (yb - ya) * p
          ctx.beginPath()
          ctx.arc(x, y, 2.4, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      ctx.shadowBlur = 0

      // nós — pulsando
      for (const c of cols) {
        for (const y of c.ys) {
          const pulse = 0.7 + Math.sin(t * 0.003 + (c.x + y) * 0.01) * 0.3
          ctx.fillStyle = `rgba(167, 139, 250, ${pulse})`
          ctx.beginPath()
          ctx.arc(c.x, y, 6, 0, Math.PI * 2)
          ctx.fill()
          stroke(ctx, 'rgba(220, 200, 255, 0.8)', 1.5)
          ctx.beginPath()
          ctx.arc(c.x, y, 6, 0, Math.PI * 2)
          ctx.stroke()
        }
      }
    },
  },
]

/* ─── Componente ─────────────────────────────────────────────────────── */

export function TechEvolutionBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  /** scrollProgress 0..1, atualizado via GSAP ScrollTrigger */
  const progressRef = useRef(0)
  /** label da era atual, exibida em hud (opcional, pode remover) */
  const labelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let cleanupTrigger: (() => void) | null = null

    /* ── Partículas de fundo ───────────────────────────────────────── */
    interface Particle { x: number; y: number; vx: number; vy: number; r: number }
    let particles: Particle[] = []

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      spawn()
    }

    const spawn = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      // densidade base — modulada por era depois
      const count = Math.min(Math.floor((w * h) / 9000), 160)
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.2 + 0.4,
      }))
    }

    /* ── Loop de render ────────────────────────────────────────────── */
    const draw = (now: number) => {
      const w = window.innerWidth
      const h = window.innerHeight
      ctx.clearRect(0, 0, w, h)

      /* progress → era index com crossfade */
      const p = progressRef.current
      const eraFloat = p * (ERAS.length - 1)
      const i = Math.floor(eraFloat)
      const next = Math.min(i + 1, ERAS.length - 1)
      const blend = eraFloat - i
      const eraA = ERAS[i]
      const eraB = ERAS[next]

      /* fundo: leve gradiente radial baseado na cor da era atual */
      const grd = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.7)
      grd.addColorStop(0, eraA.accent.replace(/[\d.]+\)$/, '0.06)'))
      grd.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = grd
      ctx.fillRect(0, 0, w, h)

      /* partículas — cor interpolada entre A e B */
      const pColor = eraA.color
      const pColorNext = eraB.color
      const showCount = Math.floor(particles.length * (eraA.density + (eraB.density - eraA.density) * blend))

      for (let k = 0; k < showCount; k++) {
        const part = particles[k]
        part.x += part.vx
        part.y += part.vy
        if (part.x < 0 || part.x > w) part.vx *= -1
        if (part.y < 0 || part.y > h) part.vy *= -1

        ctx.beginPath()
        ctx.arc(part.x, part.y, part.r, 0, Math.PI * 2)
        ctx.fillStyle = blend < 0.5 ? pColor : pColorNext
        ctx.fill()
      }

      /* conexões esparsas entre partículas — aumentam nas eras tech */
      const connectDist = 130
      const connectOpacity = 0.15 + (eraA.density - 0.6) * 0.1
      ctx.strokeStyle = `rgba(167,139,250,${Math.max(0.05, connectOpacity)})`
      ctx.lineWidth = 0.5

      for (let a = 0; a < showCount; a++) {
        for (let b = a + 1; b < showCount; b++) {
          const dx = particles[a].x - particles[b].x
          const dy = particles[a].y - particles[b].y
          const d2 = dx * dx + dy * dy
          if (d2 < connectDist * connectDist) {
            ctx.beginPath()
            ctx.moveTo(particles[a].x, particles[a].y)
            ctx.lineTo(particles[b].x, particles[b].y)
            ctx.stroke()
          }
        }
      }

      /* ─ Ícone central das eras ─────────────────────────────────── */
      const cx = w / 2
      const cy = h / 2

      // Era A — desaparecendo
      ctx.save()
      ctx.translate(cx, cy)
      const scaleA = 1 - blend * 0.15
      ctx.scale(scaleA, scaleA)
      ctx.globalAlpha = (1 - blend) * 0.55  // sutil — fundo, não chama mais que o conteúdo
      eraA.draw(ctx, now)
      ctx.restore()

      // Era B — surgindo (só desenha se não for a mesma era)
      if (next !== i) {
        ctx.save()
        ctx.translate(cx, cy)
        const scaleB = 0.85 + blend * 0.15
        ctx.scale(scaleB, scaleB)
        ctx.globalAlpha = blend * 0.55
        eraB.draw(ctx, now)
        ctx.restore()
      }

      ctx.globalAlpha = 1

      /* atualiza label (opcional) */
      if (labelRef.current) {
        const label = blend < 0.5 ? eraA.id : eraB.id
        if (labelRef.current.dataset.era !== label) {
          labelRef.current.dataset.era = label
          labelRef.current.textContent = LABELS[label as EraId]
        }
      }

      raf = requestAnimationFrame(draw)
    }

    /* ── ScrollTrigger setup ───────────────────────────────────────── */
    const setupScroll = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      const trigger = ScrollTrigger.create({
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
        onUpdate: (self) => {
          progressRef.current = self.progress
        },
      })

      cleanupTrigger = () => trigger.kill()
    }

    resize()
    raf = requestAnimationFrame(draw)
    window.addEventListener('resize', resize)
    setupScroll()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      cleanupTrigger?.()
    }
  }, [])

  return (
    <>
      {/* canvas fixo cobrindo a viewport — atrás de tudo */}
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
      />
      {/* HUD discreta com nome da era — opcional, pode remover */}
      <div
        ref={labelRef}
        aria-hidden
        className="pointer-events-none fixed bottom-6 right-6 z-0 hidden font-mono text-[10px] uppercase tracking-[0.18em] text-white/30 sm:block"
      >
        stone
      </div>
    </>
  )
}

const LABELS: Record<EraId, string> = {
  stone: '— pedra · pré-história',
  wheel: '— roda · 4000 a.C.',
  press: '— prensa · 1455',
  steam: '— vapor · 1765',
  bulb:  '— eletricidade · 1879',
  radio: '— rádio · 1900s',
  chip:  '— microprocessador · 1971',
  phone: '— smartphone · 2010s',
  ai:    '— ia · presente',
}
