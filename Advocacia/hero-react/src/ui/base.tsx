import { useEffect, useRef, useState, type ReactNode } from 'react'

export function Logo({ size = 18, color = 'rgb(84, 84, 84)' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" fill="none" aria-hidden="true">
      <path
        fill={color}
        d="M 160 88 L 194 34 L 216 0 L 256 0 L 256 40 L 221.5 93.5 L 200 128 L 256 128 L 256 256 L 96 256 L 96 168 L 64.246 220 L 40 256 L 0 256 L 0 216 L 34 162 L 56 128 L 0 128 L 0 0 L 160 0 Z"
      />
    </svg>
  )
}

const reduzido = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Dispara uma vez quando o elemento entra na tela. */
export function useNaTela<T extends Element>(limiar = 0.2) {
  const ref = useRef<T>(null)
  const [visivel, setVisivel] = useState(reduzido)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduzido()) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisivel(true)
          io.disconnect()
        }
      },
      { threshold: limiar, rootMargin: '0px 0px -40px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [limiar])
  return [ref, visivel] as const
}

/** Revela o conteúdo subindo suavemente quando entra na tela. */
export function Reveal({ children, atraso = 0, className = '' }: { children: ReactNode; atraso?: number; className?: string }) {
  const [ref, visivel] = useNaTela<HTMLDivElement>()
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${atraso}ms` }}
      className={`transition-all duration-700 ease-out ${visivel ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} ${className}`}
    >
      {children}
    </div>
  )
}

/** Número que sobe até o valor quando aparece. */
export function Contador({ valor, decimais = 0, prefixo = '', sufixo = '' }: { valor: number; decimais?: number; prefixo?: string; sufixo?: string }) {
  const [ref, visivel] = useNaTela<HTMLSpanElement>(0.6)
  const [atual, setAtual] = useState(0)
  useEffect(() => {
    if (!visivel || reduzido()) return
    let raf = 0
    const inicio = performance.now()
    const passo = (agora: number) => {
      const p = Math.min((agora - inicio) / 1600, 1)
      setAtual(valor * (1 - Math.pow(1 - p, 3)))
      if (p < 1) raf = requestAnimationFrame(passo)
    }
    raf = requestAnimationFrame(passo)
    return () => cancelAnimationFrame(raf)
  }, [visivel, valor])
  const texto = (reduzido() ? valor : atual).toLocaleString('pt-BR', { minimumFractionDigits: decimais, maximumFractionDigits: decimais })
  return (
    <span ref={ref} className="tabular-nums">
      {prefixo}
      {texto}
      {sufixo}
    </span>
  )
}

/** Cabeçalho de seção no mesmo tom do hero: selo azul + título + apoio. */
export function Cabecalho({ selo, titulo, apoio, centro = false }: { selo: string; titulo: string; apoio?: string; centro?: boolean }) {
  return (
    <Reveal className={`max-w-xl ${centro ? 'mx-auto text-center' : ''}`}>
      <p className="text-[11.5px] font-medium text-blue-500 mb-3">{selo}</p>
      <h2 className="text-[1.75rem] sm:text-[2.25rem] leading-[1.15] font-medium text-gray-900 tracking-tight">{titulo}</h2>
      {apoio && <p className="mt-3 text-[14px] leading-relaxed text-gray-500">{apoio}</p>}
    </Reveal>
  )
}

/** Seta que desliza no hover do grupo (mesmo gesto do hero). */
export function Seta() {
  return <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">→</span>
}

export function IconeLinkedin({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M6.94 8.5H3.56V20h3.38zM5.25 3a1.97 1.97 0 1 0 0 3.94 1.97 1.97 0 0 0 0-3.94M20.44 13.4c0-3.1-1.66-4.54-3.86-4.54a3.33 3.33 0 0 0-3.02 1.66V8.5h-3.38V20h3.38v-6.1c0-1.6.3-3.16 2.29-3.16 1.96 0 1.99 1.84 1.99 3.26V20h3.38z" />
    </svg>
  )
}
