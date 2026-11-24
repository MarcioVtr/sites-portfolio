import { useEffect, useState } from 'react'
import { NAV, ESCRITORIO } from '../conteudo'
import { Logo } from '../ui/base'

/** Mesmas duas pílulas do hero, agora fixas: acompanham a rolagem e marcam a seção ativa. */
export default function Navbar() {
  const [rolou, setRolou] = useState(false)
  const [ativo, setAtivo] = useState('')

  useEffect(() => {
    const aoRolar = () => setRolou(window.scrollY > 40)
    aoRolar()
    window.addEventListener('scroll', aoRolar, { passive: true })

    const secoes = NAV.map((l) => document.querySelector(l.href)).filter((s): s is Element => !!s)
    const io = new IntersectionObserver(
      (entradas) => entradas.forEach((e) => e.isIntersecting && setAtivo(`#${e.target.id}`)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    secoes.forEach((s) => io.observe(s))
    const topo = document.getElementById('inicio')
    const ioTopo = new IntersectionObserver(([e]) => e.isIntersecting && setAtivo(''), { threshold: 0.5 })
    if (topo) ioTopo.observe(topo)

    return () => {
      window.removeEventListener('scroll', aoRolar)
      io.disconnect()
      ioTopo.disconnect()
    }
  }, [])

  const pilula = `transition-shadow duration-300 ${rolou ? 'shadow-[0_6px_24px_-10px_rgba(0,0,0,0.25)]' : ''}`

  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 top-0 z-50 flex items-center justify-center pt-4 sm:pt-6 px-4 sm:px-8 gap-2 sm:gap-3"
    >
      <a
        href="#inicio"
        aria-label={`${ESCRITORIO.nomeCompleto} — início`}
        className={`flex items-center justify-center rounded-full w-10 h-10 sm:w-11 sm:h-11 shrink-0 ${pilula}`}
        style={{ backgroundColor: '#EDEDED' }}
      >
        <Logo />
      </a>
      <div
        className={`flex items-center gap-4 sm:gap-10 rounded-xl px-4 sm:px-8 py-2.5 sm:py-3 ${pilula}`}
        style={{ backgroundColor: '#EDEDED' }}
      >
        {NAV.map((link) => (
          <a
            key={link.href}
            href={link.href}
            aria-current={ativo === link.href ? 'true' : undefined}
            className={`text-[12px] sm:text-[14px] font-medium transition-colors duration-200 ${
              ativo === link.href ? 'text-blue-500' : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            {link.rotulo}
          </a>
        ))}
      </div>
    </nav>
  )
}
