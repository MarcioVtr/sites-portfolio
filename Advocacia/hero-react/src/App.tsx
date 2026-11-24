import Navbar from './sections/Navbar'
import Hero from './sections/Hero'
import { Areas, Casos, Equipe, Escritorio, Numeros } from './sections/Secoes'
import { Contato, Depoimentos, Rodape } from './sections/Final'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Numeros />
        <Escritorio />
        <Areas />
        <Casos />
        <Equipe />
        <Depoimentos />
        <Contato />
      </main>
      <Rodape />
    </>
  )
}
