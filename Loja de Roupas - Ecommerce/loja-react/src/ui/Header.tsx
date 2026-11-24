import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { ArrowRight, Menu, Search, ShoppingBag, User, X } from 'lucide-react'
import { AVISO_TOPO, CATEGORIAS, NAV, PRODUTOS, fotoProduto, img, type Filtro } from '../conteudo'
import { useCarrinho } from '../lib/carrinho'
import { reais } from '../lib/formato'
import { linkFiltro, linkProduto, navegar, useRota } from '../lib/rota'
import { Marca, container } from './base'

const normaliza = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

function AvisoTopo() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = window.setInterval(() => setI((n) => (n + 1) % AVISO_TOPO.length), 4000)
    return () => window.clearInterval(t)
  }, [])
  return (
    <div className="bg-cafe text-[12px] font-medium tracking-wide text-linho">
      <div className={`${container} flex h-9 items-center justify-center`}>
        <p key={i} className="animate-entra md:hidden">{AVISO_TOPO[i]}</p>
        <p className="hidden items-center gap-6 md:flex">
          {AVISO_TOPO.map((t, n) => (
            <span key={t} className="flex items-center gap-6">
              {n > 0 && <span aria-hidden className="size-1 rounded-full bg-terracota" />}
              {t}
            </span>
          ))}
        </p>
      </div>
    </div>
  )
}

function Busca() {
  const [aberta, setAberta] = useState(false)
  const [termo, setTermo] = useState('')
  const caixa = useRef<HTMLDivElement>(null)
  const campo = useRef<HTMLInputElement>(null)
  const idLista = useId()

  const resultados = useMemo(() => {
    const t = normaliza(termo.trim())
    if (!t) return []
    return PRODUTOS.filter((p) => normaliza(`${p.nome} ${p.resumo} ${p.composicao} ${p.cores.map((c) => c.nome).join(' ')}`).includes(t)).slice(0, 5)
  }, [termo])

  useEffect(() => {
    if (!aberta) return
    campo.current?.focus()
    const fora = (e: PointerEvent) => !caixa.current?.contains(e.target as Node) && setAberta(false)
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setAberta(false)
    document.addEventListener('pointerdown', fora)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('pointerdown', fora)
      document.removeEventListener('keydown', esc)
    }
  }, [aberta])

  const fechar = () => {
    setAberta(false)
    setTermo('')
  }

  return (
    <div ref={caixa} className="flex items-center">
      <button
        type="button"
        onClick={() => setAberta(true)}
        aria-label="Buscar"
        aria-expanded={aberta}
        className={`flex size-10 items-center justify-center transition-opacity hover:text-terracota ${aberta ? 'pointer-events-none opacity-0' : ''}`}
      >
        <Search size={20} strokeWidth={1.6} />
      </button>

      {/* No celular cobre a linha toda do header; no desktop expande para o lado.
          Fechada fica transparente e inert (não usa `invisible`: o foco falharia no quadro da abertura). */}
      <div
        inert={!aberta}
        className={`absolute inset-0 z-10 flex items-center bg-linho px-5 transition-[width,opacity] duration-300 ease-out md:px-10 lg:right-auto lg:left-10 lg:bg-transparent lg:px-0 ${
          aberta ? 'opacity-100 lg:w-96' : 'pointer-events-none opacity-0 lg:w-10'
        }`}
      >
        <form
          role="search"
          className="flex w-full items-center gap-2 border-b border-cafe pb-1.5"
          onSubmit={(e) => {
            e.preventDefault()
            if (resultados[0]) {
              navegar(`/produto/${resultados[0].slug}`)
              fechar()
            }
          }}
        >
          <Search size={18} strokeWidth={1.6} className="shrink-0 text-pedra" />
          <input
            ref={campo}
            type="search"
            value={termo}
            onChange={(e) => setTermo(e.target.value)}
            placeholder="Buscar linho, vestido, tricô…"
            aria-label="Buscar produtos"
            aria-controls={idLista}
            className="w-full bg-transparent text-[15px] outline-none placeholder:text-pedra/70 [&::-webkit-search-cancel-button]:hidden"
            tabIndex={aberta ? 0 : -1}
          />
          <button type="button" onClick={fechar} aria-label="Fechar busca" className="shrink-0 p-1 text-pedra hover:text-cafe" tabIndex={aberta ? 0 : -1}>
            <X size={18} />
          </button>
        </form>

        {aberta && (
          <div id={idLista} className="absolute top-full right-0 left-0 animate-entra border-t border-areia bg-linho p-5 shadow-xl lg:right-auto lg:w-96 lg:border">
            {!termo.trim() && (
              <>
                <p className="selo mb-3 text-pedra">Buscas populares</p>
                <div className="flex flex-wrap gap-2">
                  {['Linho', 'Vestido', 'Tricô', 'Seda', 'Blazer'].map((s) => (
                    <button key={s} type="button" onClick={() => setTermo(s)} className="rounded-full border border-areia px-3 py-1.5 text-[13px] hover:border-cafe">
                      {s}
                    </button>
                  ))}
                </div>
              </>
            )}
            {termo.trim() && resultados.length === 0 && <p className="text-[14px] text-pedra">Nada encontrado para “{termo}”. Tente “linho” ou “vestido”.</p>}
            {resultados.length > 0 && (
              <ul className="-my-2 divide-y divide-areia/70">
                {resultados.map((p) => (
                  <li key={p.slug}>
                    <a href={linkProduto(p.slug)} onClick={fechar} className="flex items-center gap-3 py-2.5 hover:text-terracota">
                      <img src={fotoProduto(p.slug, 1, true)} alt="" className="h-16 w-13 shrink-0 object-cover" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[14px] font-medium">{p.nome}</span>
                        <span className="text-[13px] text-pedra tabular-nums">{reais(p.preco)}</span>
                      </span>
                      <ArrowRight size={16} className="shrink-0 text-pedra" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function Conta() {
  const { avisar } = useCarrinho()
  const [aberta, setAberta] = useState(false)
  const caixa = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!aberta) return
    const fora = (e: PointerEvent) => !caixa.current?.contains(e.target as Node) && setAberta(false)
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setAberta(false)
    document.addEventListener('pointerdown', fora)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('pointerdown', fora)
      document.removeEventListener('keydown', esc)
    }
  }, [aberta])
  const demo = () => {
    setAberta(false)
    avisar('Demo: login e pedidos entram na versão completa')
  }
  return (
    <div ref={caixa} className="relative hidden sm:block">
      <button type="button" onClick={() => setAberta((v) => !v)} aria-label="Minha conta" aria-expanded={aberta} className="flex size-10 items-center justify-center hover:text-terracota">
        <User size={20} strokeWidth={1.6} />
      </button>
      {aberta && (
        <div className="absolute top-full right-0 z-20 mt-2 w-64 animate-entra border border-areia bg-linho p-5 shadow-xl">
          <p className="titulo mb-1 text-xl">Olá!</p>
          <p className="mb-4 text-[13px] text-pedra">Entre para acompanhar pedidos e salvar favoritos.</p>
          <button type="button" onClick={demo} className="mb-2 w-full bg-cafe py-2.5 text-[13px] font-semibold text-linho hover:bg-cafe-suave">
            Entrar
          </button>
          <button type="button" onClick={demo} className="w-full border border-cafe py-2.5 text-[13px] font-semibold hover:bg-cafe hover:text-linho">
            Criar conta
          </button>
        </div>
      )}
    </div>
  )
}

function MenuMobile({ aberto, fechar, filtroAtivo }: { aberto: boolean; fechar: () => void; filtroAtivo: Filtro | null }) {
  useEffect(() => {
    if (!aberto) return
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && fechar()
    document.addEventListener('keydown', esc)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', esc)
      document.body.style.overflow = ''
    }
  }, [aberto, fechar])

  return (
    <div className={`fixed inset-0 z-50 lg:hidden ${aberto ? '' : 'pointer-events-none'}`} inert={!aberto}>
      <div onClick={fechar} className={`absolute inset-0 bg-cafe/40 transition-opacity duration-300 ${aberto ? 'opacity-100' : 'opacity-0'}`} />
      <nav
        aria-label="Menu"
        className={`absolute inset-y-0 left-0 flex w-[86%] max-w-sm flex-col bg-linho transition-transform duration-300 ease-out ${aberto ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex h-16 items-center justify-between border-b border-areia px-5">
          <Marca className="text-xl" />
          <button type="button" onClick={fechar} aria-label="Fechar menu" className="-mr-2 p-2">
            <X size={22} strokeWidth={1.6} />
          </button>
        </div>
        <ul className="flex-1 overflow-y-auto px-5 py-4">
          {NAV.map((n) => (
            <li key={n.filtro}>
              <a
                href={linkFiltro(n.filtro)}
                onClick={fechar}
                className={`titulo flex items-center justify-between border-b border-areia/70 py-4 text-2xl ${n.destaque ? 'text-terracota' : ''} ${filtroAtivo === n.filtro ? 'italic' : ''}`}
              >
                {n.rotulo}
                <ArrowRight size={18} strokeWidth={1.5} />
              </a>
            </li>
          ))}
        </ul>
        <div className="grid grid-cols-2 gap-2 px-5 pb-6">
          {CATEGORIAS.slice(0, 2).map((c) => (
            <a key={c.id} href={linkFiltro(c.id)} onClick={fechar} className="relative aspect-[4/3] overflow-hidden">
              <img src={img(c.imagem)} alt="" className="absolute inset-0 size-full object-cover" loading="lazy" />
              <span className="absolute inset-0 bg-gradient-to-t from-cafe/70 to-transparent" />
              <span className="absolute bottom-2 left-3 text-[13px] font-semibold text-linho">{c.nome}</span>
            </a>
          ))}
        </div>
      </nav>
    </div>
  )
}

export function Header() {
  const { quantidade, abrir } = useCarrinho()
  const { caminho, params } = useRota()
  const [rolou, setRolou] = useState(false)
  const [escondido, setEscondido] = useState(false)
  const naHome = caminho === '/'
  const [menu, setMenu] = useState(false)
  const fecharMenu = useCallback(() => setMenu(false), [])
  const filtroAtivo = caminho === '/' ? ((params.get('filtro') as Filtro | null) ?? null) : null

  useEffect(() => {
    let ultimo = window.scrollY
    const f = () => {
      const y = window.scrollY
      setRolou(y > 8)
      if (Math.abs(y - ultimo) > 6) {
        setEscondido(naHome && y > ultimo && y > 400)
        ultimo = y
      }
    }
    f()
    window.addEventListener('scroll', f, { passive: true })
    return () => window.removeEventListener('scroll', f)
  }, [naHome])

  return (
    <>
      <AvisoTopo />
      <header
        className={`sticky top-0 z-40 bg-linho/95 backdrop-blur-md transition-[transform,box-shadow] duration-500 ease-out ${rolou ? 'shadow-[0_1px_0_var(--color-areia)]' : ''} ${
          escondido ? '-translate-y-full' : ''
        }`}
      >
        <div className={`${container} relative grid h-16 grid-cols-[1fr_auto_1fr] items-center md:h-20`}>
          <div className="-ml-2 flex items-center">
            <button type="button" onClick={() => setMenu(true)} aria-label="Abrir menu" className="flex size-10 items-center justify-center lg:hidden">
              <Menu size={22} strokeWidth={1.6} />
            </button>
            <Busca />
          </div>

          <a href="#/" aria-label="Âmbar — página inicial" className="text-[1.6rem] leading-none md:text-[2rem]">
            <Marca />
          </a>

          <div className="-mr-2 flex items-center justify-end gap-1">
            <Conta />
            <button type="button" onClick={abrir} aria-label={`Abrir sacola, ${quantidade} ${quantidade === 1 ? 'item' : 'itens'}`} className="relative flex size-10 items-center justify-center hover:text-terracota">
              <ShoppingBag size={21} strokeWidth={1.6} />
              {quantidade > 0 && (
                <span key={quantidade} className="absolute top-0.5 right-0 flex h-[18px] min-w-[18px] animate-entra items-center justify-center rounded-full bg-terracota px-1 text-[10px] font-bold text-white tabular-nums">
                  {quantidade}
                </span>
              )}
            </button>
          </div>
        </div>

        <nav aria-label="Categorias" className="hidden border-t border-areia/70 lg:block">
          <ul className={`${container} flex h-12 items-center justify-center gap-8`}>
            {NAV.map((n) => (
              <li key={n.filtro}>
                <a
                  href={linkFiltro(n.filtro)}
                  className={`relative py-3 text-[13px] font-semibold tracking-wide after:absolute after:inset-x-0 after:-bottom-px after:h-px after:origin-left after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100 ${
                    filtroAtivo === n.filtro ? 'after:scale-x-100' : 'after:scale-x-0'
                  } ${n.destaque ? 'text-terracota' : ''}`}
                >
                  {n.rotulo}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <MenuMobile aberto={menu} fechar={fecharMenu} filtroAtivo={filtroAtivo} />
    </>
  )
}
