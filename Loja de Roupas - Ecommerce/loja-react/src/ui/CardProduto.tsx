import { useEffect, useRef, useState } from 'react'
import { Plus, ShoppingBag, X } from 'lucide-react'
import { TONS, corDoTom, fotoProduto, type Produto } from '../conteudo'
import { useCarrinho } from '../lib/carrinho'
import { linkProduto } from '../lib/rota'
import { useTom } from '../lib/tom'
import { Preco, SeloDesconto } from './base'

/**
 * Card de produto: segunda foto no hover, botão "Adicionar ao carrinho" que sobe
 * no hover (mouse) ou fica como ícone (toque) e abre a escolha de tamanho.
 */
export function CardProduto({ produto, prioridade = false }: { produto: Produto; prioridade?: boolean }) {
  const { adicionar } = useCarrinho()
  const { tom } = useTom()
  const naCor = corDoTom(produto, tom)
  const [escolhendo, setEscolhendo] = useState(false)
  const painel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!escolhendo) return
    painel.current?.querySelector<HTMLButtonElement>('button:not(:disabled)')?.focus()
    const fora = (e: PointerEvent) => {
      if (!painel.current?.contains(e.target as Node)) setEscolhendo(false)
    }
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setEscolhendo(false)
    document.addEventListener('pointerdown', fora)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('pointerdown', fora)
      document.removeEventListener('keydown', esc)
    }
  }, [escolhendo])

  const escolher = (tamanho: string) => {
    adicionar({ slug: produto.slug, cor: (naCor ?? produto.cores[0]).nome, tamanho, qtd: 1 })
    setEscolhendo(false)
  }

  return (
    <article className="group relative">
      <div className="relative aspect-[4/5] overflow-hidden bg-linho-escuro">
        <a href={linkProduto(produto.slug)} className="absolute inset-0" aria-label={produto.nome}>
          <img
            src={fotoProduto(produto.slug, 1, true)}
            alt=""
            loading={prioridade ? 'eager' : 'lazy'}
            className="absolute inset-0 size-full object-cover transition duration-700 ease-out mouse:group-hover:scale-[1.04]"
          />
          {produto.fotos > 1 && (
            <img
              src={fotoProduto(produto.slug, 2, true)}
              alt=""
              loading="lazy"
              className="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-500 mouse:group-hover:opacity-100"
            />
          )}
        </a>

        <div className="pointer-events-none absolute top-3 left-3 flex flex-col items-start gap-1.5">
          <SeloDesconto produto={produto} />
          {produto.novo && <span className="bg-linho px-2 py-1 text-[11px] font-bold tracking-wide">NOVO</span>}
        </div>

        {naCor && tom && (
          <span key={tom} className="pointer-events-none absolute top-3 right-3 flex animate-entra items-center gap-1.5 bg-linho/95 py-1 pr-2.5 pl-1.5 text-[11px] font-bold">
            <span className="size-3 rounded-full ring-1 ring-cafe/20" style={{ background: naCor.hex }} />
            Tem em {TONS[tom].nome}
          </span>
        )}

        {/* Mouse: botão largo que sobe no hover */}
        {!escolhendo && (
          <button
            type="button"
            onClick={() => setEscolhendo(true)}
            className="absolute inset-x-3 bottom-3 hidden translate-y-3 items-center justify-center gap-2 bg-cafe py-3 text-[13px] font-semibold text-linho opacity-0 transition duration-300 ease-out hover:bg-cafe-suave focus-visible:translate-y-0 focus-visible:opacity-100 mouse:flex mouse:group-hover:translate-y-0 mouse:group-hover:opacity-100"
          >
            <ShoppingBag size={16} strokeWidth={1.75} />
            Adicionar ao carrinho
          </button>
        )}

        {/* Toque: ícone sempre visível */}
        {!escolhendo && (
          <button
            type="button"
            onClick={() => setEscolhendo(true)}
            aria-label={`Adicionar ${produto.nome} ao carrinho`}
            className="absolute right-2.5 bottom-2.5 hidden size-10 items-center justify-center rounded-full bg-linho/95 text-cafe shadow-sm toque:flex"
          >
            <Plus size={18} />
          </button>
        )}

        {escolhendo && (
          <div
            ref={painel}
            role="group"
            aria-label="Escolha o tamanho"
            className="absolute inset-x-2 bottom-2 animate-entra bg-linho p-3 shadow-lg md:inset-x-3 md:bottom-3"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[12px] font-semibold">Escolha o tamanho</span>
              <button type="button" onClick={() => setEscolhendo(false)} aria-label="Fechar" className="-m-1 p-1 text-pedra hover:text-cafe">
                <X size={14} />
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {produto.tamanhos.map((t) => {
                const esgotado = produto.esgotados?.includes(t)
                return (
                  <button
                    key={t}
                    type="button"
                    disabled={esgotado}
                    onClick={() => escolher(t)}
                    aria-label={esgotado ? `${t} esgotado` : `Tamanho ${t}`}
                    className="h-9 min-w-9 flex-1 border border-areia px-1 text-[12px] font-semibold transition hover:border-cafe hover:bg-cafe hover:text-linho disabled:cursor-not-allowed disabled:text-pedra/50 disabled:line-through disabled:hover:border-areia disabled:hover:bg-transparent"
                  >
                    {t}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <div className="mt-3.5 space-y-1.5">
        <h3 className="text-[14px] leading-snug font-medium md:text-[15px]">
          <a href={linkProduto(produto.slug)} className="hover:underline hover:underline-offset-4">
            {produto.nome}
          </a>
        </h3>
        <Preco produto={produto} />
        {produto.cores.length > 1 && (
          <div className="flex items-center gap-1.5 pt-0.5" aria-label={`${produto.cores.length} cores`}>
            {produto.cores.map((c) => (
              <span key={c.nome} title={c.nome} className="size-3 rounded-full ring-1 ring-cafe/15" style={{ background: c.hex }} />
            ))}
          </div>
        )}
      </div>
    </article>
  )
}
