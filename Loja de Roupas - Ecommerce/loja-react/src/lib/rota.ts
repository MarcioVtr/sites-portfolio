import { useSyncExternalStore } from 'react'

/**
 * Roteador mínimo por hash (#/produto/slug). Funciona em qualquer hospedagem
 * estática sem configurar fallback de SPA.
 */
export type Rota = { caminho: string; params: URLSearchParams }

const ler = () => window.location.hash.replace(/^#/, '') || '/'

function assinar(cb: () => void) {
  window.addEventListener('hashchange', cb)
  return () => window.removeEventListener('hashchange', cb)
}

export function useRota(): Rota {
  const bruto = useSyncExternalStore(assinar, ler, () => '/')
  const [caminho, busca = ''] = bruto.split('?')
  return { caminho: caminho || '/', params: new URLSearchParams(busca) }
}

export const href = (caminho: string) => `#${caminho}`

export function navegar(caminho: string) {
  window.location.hash = caminho
}

export const linkProduto = (slug: string) => href(`/produto/${slug}`)
export const linkFiltro = (filtro: string) => href(filtro === 'todos' ? '/' : `/?filtro=${filtro}`)
