import { useEffect, useRef } from 'react'
import { Check, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { LOJA, fotoProduto, porSlug } from '../conteudo'
import { useCarrinho } from '../lib/carrinho'
import { reais } from '../lib/formato'
import { linkFiltro, linkProduto } from '../lib/rota'

/** Gaveta lateral da sacola. */
export function Sacola() {
  const { itens, aberto, fechar, alterar, remover, subtotal, quantidade, avisar } = useCarrinho()
  const fecharBtn = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!aberto) return
    fecharBtn.current?.focus()
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && fechar()
    document.addEventListener('keydown', esc)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', esc)
      document.body.style.overflow = ''
    }
  }, [aberto, fechar])

  const falta = Math.max(0, LOJA.freteGratisAcima - subtotal)
  const progresso = Math.min(1, subtotal / LOJA.freteGratisAcima)

  return (
    <div className={`fixed inset-0 z-50 ${aberto ? '' : 'pointer-events-none'}`} inert={!aberto}>
      <div onClick={fechar} className={`absolute inset-0 bg-cafe/40 transition-opacity duration-300 ${aberto ? 'opacity-100' : 'opacity-0'}`} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Sacola de compras"
        className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-linho transition-transform duration-300 ease-out ${aberto ? 'translate-x-0 shadow-2xl' : 'translate-x-full'}`}
      >
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-areia px-6">
          <h2 className="titulo text-2xl">
            Sua sacola <span className="font-sans text-[14px] font-medium text-pedra">({quantidade})</span>
          </h2>
          <button ref={fecharBtn} type="button" onClick={fechar} aria-label="Fechar sacola" className="-mr-2 p-2 hover:text-terracota">
            <X size={22} strokeWidth={1.6} />
          </button>
        </header>

        {itens.length > 0 && (
          <div className="shrink-0 border-b border-areia px-6 py-4">
            <p className="mb-2 flex items-center gap-1.5 text-[13px]">
              {falta > 0 ? (
                <>
                  Faltam <strong className="tabular-nums">{reais(falta)}</strong> para o frete grátis
                </>
              ) : (
                <>
                  <Check size={15} className="text-oliva" /> Você ganhou <strong>frete grátis</strong>
                </>
              )}
            </p>
            <div className="h-1 overflow-hidden rounded-full bg-areia" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progresso * 100)} aria-label="Progresso para frete grátis">
              <div className={`h-full rounded-full transition-[width] duration-500 ${falta > 0 ? 'bg-terracota' : 'bg-oliva'}`} style={{ width: `${progresso * 100}%` }} />
            </div>
          </div>
        )}

        {itens.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-10 text-center">
            <ShoppingBag size={40} strokeWidth={1.1} className="mb-5 text-pedra" />
            <p className="titulo mb-2 text-2xl">Sua sacola está vazia</p>
            <p className="mb-7 text-[14px] text-pedra">Que tal começar pelos mais desejados da estação?</p>
            <a href={linkFiltro('todos')} onClick={fechar} className="bg-cafe px-7 py-3.5 text-[13px] font-semibold text-linho hover:bg-cafe-suave">
              Explorar a coleção
            </a>
          </div>
        ) : (
          <ul className="flex-1 divide-y divide-areia overflow-y-auto px-6">
            {itens.map((item, i) => {
              const p = porSlug(item.slug)
              if (!p) return null
              return (
                <li key={`${item.slug}-${item.cor}-${item.tamanho}`} className="flex gap-4 py-5">
                  <a href={linkProduto(p.slug)} onClick={fechar} className="shrink-0">
                    <img src={fotoProduto(p.slug, 1, true)} alt="" className="h-28 w-[90px] object-cover" />
                  </a>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <a href={linkProduto(p.slug)} onClick={fechar} className="text-[14px] leading-snug font-medium hover:underline">
                        {p.nome}
                      </a>
                      <button type="button" onClick={() => remover(i)} aria-label={`Remover ${p.nome}`} className="-mt-1 -mr-1 shrink-0 p-1 text-pedra hover:text-terracota">
                        <Trash2 size={16} strokeWidth={1.6} />
                      </button>
                    </div>
                    <p className="mt-1 text-[13px] text-pedra">
                      {item.cor} · Tam. {item.tamanho}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center border border-areia">
                        <button type="button" onClick={() => alterar(i, item.qtd - 1)} disabled={item.qtd <= 1} aria-label="Diminuir" className="flex size-8 items-center justify-center disabled:text-pedra/40">
                          <Minus size={14} />
                        </button>
                        <span className="w-7 text-center text-[13px] font-semibold tabular-nums" aria-live="polite">
                          {item.qtd}
                        </span>
                        <button type="button" onClick={() => alterar(i, item.qtd + 1)} disabled={item.qtd >= 10} aria-label="Aumentar" className="flex size-8 items-center justify-center disabled:text-pedra/40">
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="text-[14px] font-semibold tabular-nums">{reais(p.preco * item.qtd)}</span>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}

        {itens.length > 0 && (
          <footer className="shrink-0 border-t border-areia bg-linho-escuro/60 px-6 pt-5 pb-6">
            <div className="mb-1 flex items-baseline justify-between">
              <span className="text-[14px]">Subtotal</span>
              <span className="text-xl font-semibold tabular-nums">{reais(subtotal)}</span>
            </div>
            <p className="mb-4 text-[12px] text-pedra">
              ou {LOJA.parcelasSemJuros}x de {reais(subtotal / LOJA.parcelasSemJuros)} sem juros · frete e cupons no checkout
            </p>
            <button
              type="button"
              onClick={() => avisar('Demo: aqui entraria o checkout (Pix, cartão e boleto)')}
              className="w-full bg-cafe py-4 text-[14px] font-semibold text-linho transition hover:bg-cafe-suave"
            >
              Finalizar compra
            </button>
            <button type="button" onClick={fechar} className="mt-3 w-full text-[13px] font-medium text-pedra underline underline-offset-4 hover:text-cafe">
              Continuar comprando
            </button>
          </footer>
        )}
      </aside>
    </div>
  )
}

/** Aviso flutuante (toast) — confirma ações como "adicionado à sacola". */
export function Aviso() {
  const { aviso, abrir, aberto } = useCarrinho()
  if (!aviso || aberto) return null
  const p = aviso.slug ? porSlug(aviso.slug) : undefined
  return (
    <div role="status" aria-live="polite" className="fixed inset-x-4 bottom-4 z-[60] sm:inset-x-auto sm:right-6 sm:bottom-6">
      <div key={aviso.id} className="flex animate-entra items-center gap-3 bg-cafe p-3 pr-4 text-linho shadow-2xl sm:min-w-80">
        {p ? <img src={fotoProduto(p.slug, 1, true)} alt="" className="h-14 w-11 object-cover" /> : <Check size={18} className="ml-1" />}
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold">{aviso.texto}</p>
          {p && <p className="truncate text-[12px] text-linho/70">{p.nome}</p>}
        </div>
        {p && (
          <button type="button" onClick={abrir} className="shrink-0 text-[12px] font-semibold underline underline-offset-4 hover:text-terracota-suave">
            Ver sacola
          </button>
        )}
      </div>
    </div>
  )
}
