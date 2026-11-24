import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent, type MouseEvent } from 'react'
import { ArrowDown, ArrowRight, Check, Copy, Headphones, RefreshCw, ShieldCheck, Truck } from 'lucide-react'
import {
  BENEFICIOS, CATEGORIAS, EDITORIAL, HERO, NEWSLETTER, ORDEM_TONS, PRODUTOS, PROVA, ROTULO_FILTRO, TONS,
  corDoTom, filtrar, img, type Filtro, type Tom,
} from '../conteudo'
import { useMotor } from '../lib/motor'
import { linkFiltro, linkProduto, useRota } from '../lib/rota'
import { useTom } from '../lib/tom'
import { CardProduto } from '../ui/CardProduto'
import { container } from '../ui/base'
import { AraraSale } from './AraraSale'
import './home.css'

/* ───────────── Cena 1 · Abertura: luz de janela ───────────── */

function Abertura() {
  const palavras = HERO.titulo.split(' ')
  const antes = palavras.slice(0, -1).join(' ')
  const ultima = palavras.at(-1)
  return (
    <section className="abertura text-linho">
      <div className="abertura__vidros" aria-hidden>
        <div className="abertura__vidro">
          <div data-fx-paralaxe="0.1">
            <img src={img('hero-ela.webp')} alt="" fetchPriority="high" style={{ objectPosition: '62% 30%' }} />
          </div>
        </div>
        <div className="abertura__vidro">
          <div data-fx-paralaxe="0.16">
            <img src={img('hero-ele.webp')} alt="" fetchPriority="high" style={{ objectPosition: '45% 28%' }} />
          </div>
        </div>
      </div>
      <div className="abertura__sol" aria-hidden />

      <div className={`${container} relative flex h-full items-end pb-12 md:pb-20`}>
        <div className="abertura__texto relative z-0 max-w-2xl">
          <p className="selo mb-5 text-linho/85" data-fx="surgir">
            {HERO.selo}
          </p>
          <h1 className="titulo text-[2.9rem] md:text-7xl xl:text-[5.6rem]" data-fx="subir" data-fx-atraso="120" data-fx-duracao="1200">
            {antes} <em className="text-terracota-suave">{ultima}</em>
          </h1>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-linho/90 md:text-base" data-fx="subir" data-fx-atraso="320">
            {HERO.texto}
          </p>
          <div className="mt-8 flex flex-wrap gap-3" data-fx="subir" data-fx-atraso="460">
            <a href={linkFiltro('todos')} className="group inline-flex items-center gap-2 bg-linho px-7 py-4 text-[13px] font-semibold text-cafe transition hover:bg-white">
              {HERO.cta}
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </a>
            <a href={linkFiltro('novidades')} className="inline-flex items-center border border-linho/70 px-7 py-4 text-[13px] font-semibold transition hover:bg-linho/10">
              {HERO.ctaSecundario}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ───────────── Cena 2 · Categorias (grade assimétrica) ───────────── */

function Categorias() {
  return (
    <section className={`${container} py-24 md:py-32`}>
      <div className="mb-10 grid gap-6 md:mb-14 lg:grid-cols-[1.15fr_1.2fr] lg:items-end">
        <div data-fx="esquerda">
          <p className="selo mb-3 text-terracota">Compre por categoria</p>
          <h2 className="titulo text-4xl md:text-6xl">Por onde começar?</h2>
        </div>
        <p className="max-w-md text-[15px] leading-relaxed text-pedra" data-fx="direita" data-fx-atraso="120">
          Feminino, masculino e o que serve para todo mundo. Tudo em fibra natural, com tabela de medidas em cada peça.
        </p>
      </div>
      <div className="categorias__grade">
        {CATEGORIAS.map((c, i) => {
          const qtd = PRODUTOS.filter((p) => p.categoria === c.id).length
          return (
            <a
              key={c.id}
              href={linkFiltro(c.id)}
              data-fx={i === 0 ? 'esquerda' : 'direita'}
              data-fx-atraso={String(i * 110)}
              className="group relative block overflow-hidden bg-linho-escuro"
            >
              <img src={img(c.imagem)} alt="" loading="lazy" className="absolute inset-0 size-full object-cover transition duration-[1000ms] ease-out group-hover:scale-[1.05]" />
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-cafe/75 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-linho md:p-7">
                <p className="mb-1 hidden text-[12px] text-linho/80 sm:block">{c.chamada}</p>
                <h3 className={`titulo ${i === 0 ? 'text-4xl md:text-6xl' : 'text-2xl md:text-[2rem]'}`}>{c.nome}</h3>
                <span className="mt-2 inline-flex items-center gap-1.5 text-[12px] font-semibold md:text-[13px]">
                  Ver {qtd} peças <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </a>
          )
        })}
      </div>
    </section>
  )
}

/* ───────────── Cena 3 · Prova de cor (movimento-assinatura) ───────────── */

function ProvaDeCor() {
  const { tom, escolher } = useTom()
  const painel = useRef<HTMLDivElement>(null)
  const botoes = useRef<(HTMLButtonElement | null)[]>([])
  const [tinta, setTinta] = useState<{ id: number; cor: string; x: string; y: string } | null>(null)
  const destaques = filtrar('todos')
  const naCor = tom ? destaques.filter((p) => corDoTom(p, tom)).length : 0

  const tocar = (t: Tom, alvo: HTMLElement) => {
    const r = painel.current?.getBoundingClientRect()
    const b = alvo.getBoundingClientRect()
    if (r) {
      setTinta({
        id: Date.now(),
        cor: TONS[t].suave,
        x: `${((b.left + b.width / 2 - r.left) / r.width) * 100}%`,
        y: `${((b.top + b.height / 2 - r.top) / r.height) * 100}%`,
      })
    }
    escolher(t)
  }

  // Grupo de rádio: setas movem e escolhem, como um seletor de cor de verdade.
  const teclado = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0
    if (!d) return
    e.preventDefault()
    const n = (i + d + ORDEM_TONS.length) % ORDEM_TONS.length
    const alvo = botoes.current[n]
    if (alvo) {
      alvo.focus()
      tocar(ORDEM_TONS[n], alvo)
    }
  }

  return (
    <section className={`${container} pb-24 md:pb-32`}>
      <div ref={painel} className="prova__painel px-6 py-14 md:px-14 md:py-20">
        {tinta && <div key={tinta.id} className="prova__tinta" style={{ background: tinta.cor, ['--x' as string]: tinta.x, ['--y' as string]: tinta.y }} />}
        <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-20">
          <div>
            <p className="selo mb-3 text-terracota-escura">{PROVA.selo}</p>
            <h2 className="titulo text-4xl md:text-6xl">{PROVA.titulo}</h2>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-cafe-suave">{PROVA.texto}</p>
            <p className="mt-8 min-h-12 text-[14px]" aria-live="polite">
              {tom ? (
                <>
                  <strong className="font-semibold">{naCor} peças</strong> dos mais desejados existem em{' '}
                  <strong className="font-semibold text-terracota-escura">{TONS[tom].nome}</strong>.{' '}
                  <button
                    type="button"
                    onClick={() => document.getElementById('destaques')?.scrollIntoView({ behavior: 'smooth' })}
                    className="inline-flex items-center gap-1 font-semibold underline underline-offset-4"
                  >
                    Ver as peças <ArrowDown size={14} />
                  </button>
                </>
              ) : (
                <span className="text-cafe-suave">A loja está em Terracota. Toque numa amostra para trocar.</span>
              )}
            </p>
          </div>

          <div role="radiogroup" aria-label="Cor de tecido" className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-4 lg:grid-cols-2 lg:gap-x-8">
            {ORDEM_TONS.map((t, i) => {
              const marcado = tom === t
              return (
                <button
                  key={t}
                  ref={(el) => {
                    botoes.current[i] = el
                  }}
                  type="button"
                  role="radio"
                  aria-checked={marcado}
                  tabIndex={marcado || (!tom && i === 0) ? 0 : -1}
                  onClick={(e: MouseEvent<HTMLButtonElement>) => tocar(t, e.currentTarget)}
                  onKeyDown={(e) => teclado(e, i)}
                  className="amostra-botao group text-left"
                >
                  <span className="amostra block" style={{ backgroundColor: TONS[t].base }}>
                    {marcado && (
                      <span className="absolute top-3 left-3 flex size-7 items-center justify-center rounded-full bg-linho text-cafe">
                        <Check size={15} strokeWidth={2.5} />
                      </span>
                    )}
                  </span>
                  <span className="mt-3 block text-[15px] font-semibold">{TONS[t].nome}</span>
                  <span className="block text-[12px] text-cafe-suave">{TONS[t].textura}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ───────────── Cena 4 · Destaques ───────────── */

const CHIPS: Filtro[] = ['todos', 'novidades', 'feminino', 'masculino', 'camisas', 'calcas', 'vestidos', 'trico', 'sale']

function Destaques({ filtro }: { filtro: Filtro }) {
  const secao = useRef<HTMLElement>(null)
  const produtos = filtrar(filtro)
  const anterior = useRef<Filtro | null>(null)

  // Rola até a vitrine quando o filtro muda (ou quando a página abre já filtrada).
  useEffect(() => {
    const primeira = anterior.current === null
    if (anterior.current === filtro) return
    anterior.current = filtro
    if (primeira && filtro === 'todos') return
    const el = secao.current
    if (!el) return
    const topo = el.getBoundingClientRect().top
    if (topo < 0 || topo > window.innerHeight * 0.4) el.scrollIntoView({ behavior: 'smooth' })
  }, [filtro])

  return (
    <section ref={secao} id="destaques" className={`${container} scroll-mt-6 pb-24 md:pb-32`}>
      <div className="mb-8 md:mb-10">
        <p className="selo mb-3 text-terracota">Seleção da semana</p>
        <h2 className="titulo text-4xl md:text-6xl">{ROTULO_FILTRO[filtro]}</h2>
      </div>
      <div className="sem-barra -mx-5 mb-10 flex gap-2 overflow-x-auto px-5 md:mx-0 md:flex-wrap md:px-0" role="list">
        {CHIPS.map((f) => (
          <a
            key={f}
            role="listitem"
            href={linkFiltro(f)}
            aria-current={f === filtro ? 'true' : undefined}
            className={`shrink-0 rounded-full border px-4 py-2 text-[13px] font-semibold transition ${
              f === filtro ? 'border-cafe bg-cafe text-linho' : f === 'sale' ? 'border-terracota/40 text-terracota hover:border-terracota' : 'border-areia hover:border-cafe'
            }`}
          >
            {f === 'todos' ? 'Todos' : ROTULO_FILTRO[f]}
          </a>
        ))}
      </div>
      <div key={filtro} className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 md:gap-y-14 lg:grid-cols-4">
        {produtos.map((p, i) => (
          <div key={p.slug} className="animate-entra" style={{ animationDelay: `${i * 60}ms` }}>
            <CardProduto produto={p} />
          </div>
        ))}
      </div>
    </section>
  )
}

/* ───────────── Cena 5 · Sale na arara + editorial (o fundo escurece) ───────────── */

function PromoEditorial() {
  return (
    <section className="bg-cafe pt-20 md:pt-28">
      <div className={`${container} pb-20 md:pb-28`}>
        <AraraSale />
      </div>
      <div className="relative h-[60vh] min-h-[480px] overflow-hidden">
        <div className="editorial__foto" data-fx-paralaxe="0.18">
          <picture>
            <source media="(min-width: 768px)" srcSet={img('editorial.webp')} />
            <img
              src={img('editorial-mobile.webp')}
              alt="Pessoa com blusa de tricô cor de areia em frente a uma parede de madeira"
              loading="lazy"
              className="size-full object-cover object-[50%_20%] md:object-[50%_12%]"
            />
          </picture>
        </div>
        <div className={`${container} relative flex h-full items-end pb-12 md:items-center md:justify-end md:pb-0`}>
          <div className="relative isolate max-w-md text-linho">
            <div aria-hidden className="absolute -inset-16 -z-10 bg-[radial-gradient(ellipse_at_center,rgb(30_20_14/0.7),transparent_70%)]" />
            <p className="selo mb-4 text-terracota-suave">{EDITORIAL.selo}</p>
            <h2 className="titulo text-4xl md:text-6xl">{EDITORIAL.titulo}</h2>
            <p className="mt-5 text-[15px] leading-relaxed text-linho/90">{EDITORIAL.texto}</p>
            <a href={linkProduto(EDITORIAL.produto)} className="group mt-7 inline-flex items-center gap-2 border-b border-linho pb-1 text-[13px] font-semibold">
              {EDITORIAL.cta}
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ───────────── Cena 6 · Fechamento: benefícios + uma chamada ───────────── */

const ICONES = { frete: Truck, troca: RefreshCw, seguro: ShieldCheck, suporte: Headphones }

function Fechamento() {
  const [email, setEmail] = useState('')
  const [erro, setErro] = useState('')
  const [ok, setOk] = useState(false)
  const [copiado, setCopiado] = useState(false)

  const enviar = (e: FormEvent) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setErro('Confira o e-mail: parece que falta alguma coisa.')
      return
    }
    setErro('')
    setOk(true)
  }
  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(NEWSLETTER.cupom)
      setCopiado(true)
      window.setTimeout(() => setCopiado(false), 2000)
    } catch {
      /* sem permissão de área de transferência: o cupom continua visível */
    }
  }

  return (
    <section>
      <ul className={`${container} grid grid-cols-2 gap-x-5 gap-y-10 py-20 md:py-24 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-areia`} aria-label="Benefícios">
        {BENEFICIOS.map((b) => {
          const Icone = ICONES[b.icone]
          return (
            <li key={b.titulo} className="flex flex-col items-start lg:px-8 lg:first:pl-0">
              <Icone size={24} strokeWidth={1.4} className="mb-4 text-terracota" />
              <h3 className="titulo mb-1.5 text-xl">{b.titulo}</h3>
              <p className="max-w-[16rem] text-[13px] leading-relaxed text-pedra">{b.texto}</p>
            </li>
          )
        })}
      </ul>

      <div className="bg-terracota-suave">
        <div className={`${container} grid items-center gap-8 py-20 md:py-28 lg:grid-cols-[1.2fr_1fr] lg:gap-16`}>
          <div>
            <p className="selo mb-3 text-terracota-escura">Newsletter</p>
            <h2 className="titulo text-4xl md:text-6xl" data-fx="palavras" data-fx-duracao="900">
              {NEWSLETTER.titulo}
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-cafe-suave">{NEWSLETTER.texto}</p>
          </div>

          {ok ? (
            <div className="animate-entra border border-terracota/30 bg-linho/60 p-6" role="status">
              <p className="mb-3 flex items-center gap-2 font-semibold">
                <Check size={18} className="text-terracota" /> Prontinho! Seu cupom de boas-vindas:
              </p>
              <div className="flex items-center gap-3">
                <code className="flex-1 border border-dashed border-terracota bg-linho px-4 py-3 text-lg font-bold tracking-[0.2em] text-terracota-escura">{NEWSLETTER.cupom}</code>
                <button type="button" onClick={copiar} className="flex items-center gap-2 bg-cafe px-4 py-3.5 text-[13px] font-semibold text-linho hover:bg-cafe-suave">
                  {copiado ? <Check size={15} /> : <Copy size={15} />}
                  {copiado ? 'Copiado' : 'Copiar'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={enviar} noValidate>
              <div className="flex flex-col gap-2 sm:flex-row sm:gap-0">
                <label htmlFor="news-email" className="sr-only">
                  Seu e-mail
                </label>
                <input
                  id="news-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (erro) setErro('')
                  }}
                  placeholder="seu@email.com"
                  aria-invalid={!!erro}
                  aria-describedby={erro ? 'news-erro' : 'news-nota'}
                  className="h-14 w-full min-w-0 border border-cafe/25 bg-linho px-5 text-[15px] outline-none placeholder:text-pedra/70 focus:border-cafe sm:flex-1 sm:border-r-0"
                />
                <button type="submit" className="h-14 shrink-0 bg-terracota px-8 text-[14px] font-semibold text-white transition hover:bg-terracota-escura">
                  Quero meu cupom
                </button>
              </div>
              {erro ? (
                <p id="news-erro" className="mt-2 text-[13px] font-medium text-terracota-escura">
                  {erro}
                </p>
              ) : (
                <p id="news-nota" className="mt-3 text-[12px] text-cafe-suave/85">
                  Ao assinar, você concorda com nossa Política de Privacidade. Cancele quando quiser.
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

/* ───────────── Página ───────────── */

export default function Home() {
  useMotor()
  const { params } = useRota()
  const bruto = params.get('filtro') as Filtro | null
  const filtro: Filtro = bruto && bruto in ROTULO_FILTRO ? bruto : 'todos'

  return (
    <>
      <Abertura />
      <Categorias />
      <ProvaDeCor />
      <Destaques filtro={filtro} />
      <PromoEditorial />
      <Fechamento />
    </>
  )
}
