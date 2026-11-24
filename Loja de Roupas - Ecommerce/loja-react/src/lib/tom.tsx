/* oxlint-disable react/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { TONS, type Tom } from '../conteudo'

/**
 * Prova de cor (movimento-assinatura): o tom escolhido vira o acento da loja.
 * Sobrescreve --color-terracota(-escura/-suave) no <html>; como essas variáveis
 * são registradas com @property em index.css, a troca acontece em transição.
 */
type Ctx = { tom: Tom | null; escolher: (t: Tom) => void }

const TomCtx = createContext<Ctx | null>(null)
const CHAVE = 'ambar:tom'

function ler(): Tom | null {
  try {
    const t = localStorage.getItem(CHAVE)
    return t && t in TONS ? (t as Tom) : null
  } catch {
    return null
  }
}

export function TomProvider({ children }: { children: ReactNode }) {
  const [tom, setTom] = useState<Tom | null>(ler)

  useEffect(() => {
    const raiz = document.documentElement.style
    if (!tom) {
      raiz.removeProperty('--color-terracota')
      raiz.removeProperty('--color-terracota-escura')
      raiz.removeProperty('--color-terracota-suave')
      return
    }
    const t = TONS[tom]
    raiz.setProperty('--color-terracota', t.base)
    raiz.setProperty('--color-terracota-escura', t.escura)
    raiz.setProperty('--color-terracota-suave', t.suave)
    try {
      localStorage.setItem(CHAVE, tom)
    } catch {
      /* navegação privada: a escolha vale só nesta visita */
    }
  }, [tom])

  const escolher = useCallback((t: Tom) => setTom(t), [])
  const valor = useMemo(() => ({ tom, escolher }), [tom, escolher])
  return <TomCtx.Provider value={valor}>{children}</TomCtx.Provider>
}

export function useTom() {
  const c = useContext(TomCtx)
  if (!c) throw new Error('useTom fora do TomProvider')
  return c
}
