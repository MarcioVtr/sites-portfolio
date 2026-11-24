/* eslint-disable react/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { porSlug } from '../conteudo'

export type ItemCarrinho = { slug: string; cor: string; tamanho: string; qtd: number }
type Aviso = { id: number; texto: string; slug?: string }

type Ctx = {
  itens: ItemCarrinho[]
  quantidade: number
  subtotal: number
  aberto: boolean
  abrir: () => void
  fechar: () => void
  adicionar: (item: ItemCarrinho, opcoes?: { abrir?: boolean }) => void
  alterar: (i: number, qtd: number) => void
  remover: (i: number) => void
  aviso: Aviso | null
  avisar: (texto: string, slug?: string) => void
}

const CarrinhoCtx = createContext<Ctx | null>(null)
const CHAVE = 'ambar:carrinho'

function carregar(): ItemCarrinho[] {
  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE) ?? '[]')
    return Array.isArray(salvo) ? salvo.filter((i) => porSlug(i?.slug) && i.qtd > 0) : []
  } catch {
    return []
  }
}

export function CarrinhoProvider({ children }: { children: ReactNode }) {
  const [itens, setItens] = useState<ItemCarrinho[]>(carregar)
  const [aberto, setAberto] = useState(false)
  const [aviso, setAviso] = useState<Aviso | null>(null)
  const timer = useRef<number>(0)

  useEffect(() => {
    localStorage.setItem(CHAVE, JSON.stringify(itens))
  }, [itens])

  const avisar = useCallback((texto: string, slug?: string) => {
    window.clearTimeout(timer.current)
    setAviso({ id: Date.now(), texto, slug })
    timer.current = window.setTimeout(() => setAviso(null), 3200)
  }, [])

  const adicionar = useCallback<Ctx['adicionar']>(
    (novo, opcoes) => {
      setItens((atual) => {
        const i = atual.findIndex((x) => x.slug === novo.slug && x.cor === novo.cor && x.tamanho === novo.tamanho)
        if (i === -1) return [...atual, novo]
        return atual.map((x, j) => (j === i ? { ...x, qtd: Math.min(x.qtd + novo.qtd, 10) } : x))
      })
      if (opcoes?.abrir) setAberto(true)
      else avisar('Adicionado à sacola', novo.slug)
    },
    [avisar],
  )

  const abrir = useCallback(() => setAberto(true), [])
  const fechar = useCallback(() => setAberto(false), [])

  const valor = useMemo<Ctx>(() => {
    const subtotal = itens.reduce((s, i) => s + (porSlug(i.slug)?.preco ?? 0) * i.qtd, 0)
    return {
      itens,
      quantidade: itens.reduce((s, i) => s + i.qtd, 0),
      subtotal,
      aberto,
      abrir,
      fechar,
      adicionar,
      alterar: (i, qtd) => setItens((a) => a.map((x, j) => (j === i ? { ...x, qtd: Math.max(1, Math.min(qtd, 10)) } : x))),
      remover: (i) => setItens((a) => a.filter((_, j) => j !== i)),
      aviso,
      avisar,
    }
  }, [itens, aberto, abrir, fechar, adicionar, aviso, avisar])

  return <CarrinhoCtx.Provider value={valor}>{children}</CarrinhoCtx.Provider>
}

export function useCarrinho() {
  const c = useContext(CarrinhoCtx)
  if (!c) throw new Error('useCarrinho fora do CarrinhoProvider')
  return c
}
