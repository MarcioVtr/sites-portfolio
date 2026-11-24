import { useEffect } from 'react'
import { CarrinhoProvider } from './lib/carrinho'
import { TomProvider } from './lib/tom'
import { useRota } from './lib/rota'
import Home from './paginas/Home'
import Produto from './paginas/Produto'
import { Header } from './ui/Header'
import { Rodape } from './ui/Rodape'
import { Aviso, Sacola } from './ui/Sacola'

function Paginas() {
  const { caminho } = useRota()
  const produto = caminho.match(/^\/produto\/([\w-]+)/)?.[1]

  // Ao trocar de página (não de filtro), volta ao topo.
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [caminho])

  return produto ? <Produto key={produto} slug={produto} /> : <Home />
}

export default function App() {
  return (
    <TomProvider>
    <CarrinhoProvider>
      <a href="#conteudo" onClick={(e) => (e.preventDefault(), document.getElementById('conteudo')?.focus())} className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[70] focus:bg-cafe focus:px-4 focus:py-2 focus:text-linho">
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo" tabIndex={-1} className="outline-none">
        <Paginas />
      </main>
      <Rodape />
      <Sacola />
      <Aviso />
    </CarrinhoProvider>
    </TomProvider>
  )
}
