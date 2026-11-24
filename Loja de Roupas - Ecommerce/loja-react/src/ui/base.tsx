import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Star } from 'lucide-react'
import { descontoPct, type Produto } from '../conteudo'
import { reais } from '../lib/formato'

const reduzido = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Dispara uma vez quando o elemento entra na tela. */
function useNaTela<T extends Element>(limiar = 0.15) {
  const ref = useRef<T>(null)
  const [visivel, setVisivel] = useState(reduzido)
  useEffect(() => {
    const el = ref.current
    if (!el || reduzido()) return
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
      className={`transition-all duration-700 ease-out ${visivel ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'} ${className}`}
    >
      {children}
    </div>
  )
}

export function Marca({ className = '' }: { className?: string }) {
  return <span className={`font-serif tracking-[0.3em] [font-variation-settings:'opsz'_144] ${className}`}>ÂMBAR</span>
}

export function Estrelas({ nota, tamanho = 14 }: { nota: number; tamanho?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" role="img" aria-label={`Nota ${nota.toLocaleString('pt-BR')} de 5`}>
      {[0, 1, 2, 3, 4].map((i) => {
        const preenchido = Math.max(0, Math.min(1, nota - i))
        return (
          <span key={i} className="relative inline-block" style={{ width: tamanho, height: tamanho }}>
            <Star size={tamanho} strokeWidth={1.5} className="absolute inset-0 text-areia" fill="currentColor" />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${preenchido * 100}%` }}>
              <Star size={tamanho} strokeWidth={1.5} className="text-cafe" fill="currentColor" />
            </span>
          </span>
        )
      })}
    </span>
  )
}

export function SeloDesconto({ produto, className = '' }: { produto: Produto; className?: string }) {
  const pct = descontoPct(produto)
  if (!pct) return null
  return <span className={`bg-terracota px-2 py-1 text-[11px] font-bold tracking-wide text-white ${className}`}>−{pct}%</span>
}

export function Preco({ produto, grande = false }: { produto: Produto; grande?: boolean }) {
  return (
    <span className="flex flex-wrap items-baseline gap-x-2">
      <span className={`font-semibold tabular-nums ${grande ? 'text-2xl' : 'text-[15px]'} ${produto.precoDe ? 'text-terracota-escura' : ''}`}>
        {reais(produto.preco)}
      </span>
      {produto.precoDe && (
        <s className={`text-pedra tabular-nums ${grande ? 'text-base' : 'text-[13px]'}`}>
          <span className="sr-only">de </span>
          {reais(produto.precoDe)}
        </s>
      )}
    </span>
  )
}

/** Cabeçalho de seção: selo pequeno + título serif + link opcional. */
export function CabecalhoSecao({ selo, titulo, children }: { selo: string; titulo: ReactNode; children?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4 md:mb-10">
      <div>
        <p className="selo mb-3 text-terracota">{selo}</p>
        <h2 className="titulo text-4xl md:text-5xl">{titulo}</h2>
      </div>
      {children}
    </div>
  )
}

export const container = 'mx-auto w-full max-w-[1440px] px-5 md:px-10'
