import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { PRODUTOS, PROMO, descontoPct, img, type Produto } from '../conteudo'
import { reais } from '../lib/formato'
import { linkFiltro, linkProduto } from '../lib/rota'
import './arara.css'

/**
 * Arara do Sale: as peças em promoção (fotos reais no cabide, fundo transparente)
 * penduradas de lado num trilho cromado,
 * em 3D de verdade (rotateY sob perspectiva). Passar o mouse vira a peça de
 * frente e afasta as vizinhas; clicar tira a peça da arara para uma vista grande.
 *
 * Tudo é desenhado numa "prancheta" com medidas fixas e escalada para a largura
 * da seção. Celular usa uma prancheta própria (mais estreita, texto maior).
 */

type Prancheta = {
  W: number; H: number
  trilho: { x0: number; x1: number; y: number }
  g: { w: number; h: number; top: number } // caixa da peça; h = altura do vestido longo (altura 1)
  slot: number; abre: number
  legendaTop: number; botaoTop: number; faixa: number
  grande: { w: number; h: number; top: number }
  setas: { top: number; tam: number; lateral: boolean }
  infoTop: number
  fonte: { legenda: number; preco: number; ui: number; nome: number; contador: number; faixa: number }
}

const DESKTOP: Prancheta = {
  W: 1500, H: 870,
  trilho: { x0: 170, x1: 1330, y: 150 }, // cabe a peça da ponta mesmo afastada (750 ± 2,5·slot ± abre)
  g: { w: 340, h: 480, top: 142 },
  slot: 160, abre: 132,
  legendaTop: 652, botaoTop: 726, faixa: 46,
  grande: { w: 380, h: 470, top: 44 },
  setas: { top: 256, tam: 46, lateral: true },
  infoTop: 540,
  fonte: { legenda: 13, preco: 12, ui: 12, nome: 40, contador: 11, faixa: 13 },
}

const CELULAR: Prancheta = {
  W: 600, H: 1060,
  trilho: { x0: 14, x1: 586, y: 120 },
  g: { w: 240, h: 380, top: 112 },
  slot: 82, abre: 74,
  legendaTop: 520, botaoTop: 616, faixa: 70,
  grande: { w: 420, h: 525, top: 90 },
  setas: { top: 320, tam: 64, lateral: true },
  infoTop: 640,
  fonte: { legenda: 20, preco: 19, ui: 18, nome: 44, contador: 18, faixa: 20 },
}

const CURVA = 'cubic-bezier(.2,.8,.2,1)'
const reduzido = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const dois = (n: number) => String(n).padStart(2, '0')

function useContagem() {
  const [alvo] = useState(PROMO.termina)
  const [agora, setAgora] = useState(() => Date.now())
  useEffect(() => {
    const t = window.setInterval(() => setAgora(Date.now()), 1000)
    return () => window.clearInterval(t)
  }, [])
  const r = Math.max(0, alvo.getTime() - agora)
  return `${dois(Math.floor(r / 864e5))}d ${dois(Math.floor(r / 36e5) % 24)}h ${dois(Math.floor(r / 6e4) % 60)}m ${dois(Math.floor(r / 1e3) % 60)}s`
}

export function AraraSale() {
  const pecas = PRODUTOS.filter((p): p is Produto & { cabide: NonNullable<Produto['cabide']> } => !!p.cabide && !!p.precoDe)
  const foto = (p: Produto) => img(`cabide/${p.slug}.webp`)
  const N = pecas.length
  const caixa = useRef<HTMLDivElement>(null)
  const grande = useRef<HTMLDivElement>(null)
  const fantasma = useRef<HTMLDivElement>(null)
  const fechar = useRef<HTMLButtonElement>(null)
  const botoes = useRef<(HTMLButtonElement | null)[]>([])
  const timer = useRef(0)

  const [largura, setLargura] = useState(1200)
  const [hov, setHov] = useState(-1)
  const [atual, setAtual] = useState(-1) // peça na vista grande
  const [aberto, setAberto] = useState(false) // página "lavada"
  const [sombra, setSombra] = useState(-1) // peça que sai no passo anterior/próximo
  const [evento, setEvento] = useState<{ tipo: 'abrir' | 'passo' | 'fechar'; d?: number; n: number } | null>(null)
  const contagem = useContagem()

  const P = largura < 768 ? CELULAR : DESKTOP
  const k = largura / P.W
  const centro = P.W / 2

  useEffect(() => {
    const el = caixa.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setLargura(e.contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  useEffect(() => () => window.clearTimeout(timer.current), [])

  // Centro da peça i quando a peça h está de frente: as da esquerda abrem para a esquerda, as da direita para a direita.
  const x = (i: number, h: number) => centro + (i - (N - 1) / 2) * P.slot + (h >= 0 && i !== h ? Math.sign(i - h) * P.abre : 0)

  // Altura da peça pendurada (camiseta é mais curta que vestido longo).
  const altura = (i: number) => pecas[i].cabide.altura * P.g.h
  // De onde a vista grande "nasce": a peça no cabide (gancho no topo, origem 50% 0).
  const origem = (i: number) => {
    const { proporcao } = pecas[i].cabide
    const naGrande = Math.min(P.grande.h, P.grande.w / proporcao)
    const escala = altura(i) / naGrande
    return `translate(${x(i, i) - centro}px, ${P.g.top - P.grande.top}px) scale(${escala})`
  }

  const abrir = (i: number) => {
    if (atual >= 0) return
    setHov(i)
    setAtual(i)
    setAberto(true)
    setEvento({ tipo: 'abrir', n: Date.now() })
  }
  const passo = (d: number) => {
    if (atual < 0 || !aberto) return
    setSombra(atual)
    const prox = (atual + d + N) % N
    setAtual(prox)
    setHov(prox)
    setEvento({ tipo: 'passo', d, n: Date.now() })
  }
  const fecharVista = () => {
    if (atual < 0 || !aberto) return
    setAberto(false)
    setEvento({ tipo: 'fechar', n: Date.now() })
  }

  // As animações da vista grande (Web Animations), depois que o React pintou a peça certa.
  useLayoutEffect(() => {
    if (!evento) return
    const big = grande.current
    const big2 = fantasma.current
    if (!big || !big2) return
    const dur = (ms: number) => (reduzido() ? 0 : ms)

    if (evento.tipo === 'abrir') {
      big.getAnimations().forEach((a) => a.cancel())
      big.animate([{ transform: origem(atual), opacity: 1 }, { transform: 'none', opacity: 1 }], { duration: dur(750), easing: CURVA, fill: 'forwards' })
      fechar.current?.focus({ preventScroll: true })
    }
    if (evento.tipo === 'passo' && evento.d) {
      const d = evento.d
      big2.animate(
        [
          { transform: 'none', opacity: 1, filter: 'blur(0)' },
          { transform: `translateX(${-d * 120}px) scale(.94)`, opacity: 0, filter: 'blur(6px)' },
        ],
        { duration: dur(600), easing: CURVA },
      )
      big.getAnimations().forEach((a) => a.cancel())
      big.animate(
        [
          { transform: `translateX(${d * 120}px) scale(.94)`, opacity: 0, filter: 'blur(6px)' },
          { transform: 'none', opacity: 1, filter: 'blur(0)' },
        ],
        { duration: dur(600), easing: CURVA, fill: 'forwards' },
      )
    }
    if (evento.tipo === 'fechar') {
      const i = atual
      big.animate([{ transform: 'none', opacity: 1 }, { transform: origem(i), opacity: 1 }], { duration: dur(650), easing: CURVA, fill: 'forwards' })
      timer.current = window.setTimeout(() => {
        big.getAnimations().forEach((a) => a.cancel())
        setAtual(-1)
        setHov(-1)
        setSombra(-1)
        requestAnimationFrame(() => requestAnimationFrame(() => botoes.current[i]?.focus({ preventScroll: true })))
      }, dur(650))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [evento])

  const teclado = (e: KeyboardEvent) => {
    if (aberto) {
      if (e.key === 'ArrowRight') passo(1)
      else if (e.key === 'ArrowLeft') passo(-1)
      else if (e.key === 'Escape') fecharVista()
      else return
      e.preventDefault()
      return
    }
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault()
      const h = e.key === 'ArrowRight' ? Math.min(N - 1, hov + 1) : hov < 0 ? N - 1 : Math.max(0, hov - 1)
      setHov(h)
      botoes.current[h]?.focus({ preventScroll: true })
    }
  }

  const p = atual >= 0 ? pecas[atual] : null
  const ps = sombra >= 0 ? pecas[sombra] : null
  const faixa = Array.from({ length: 16 }, () => ['SALE', '•', 'ATÉ 30% OFF', '•', 'ÚLTIMAS PEÇAS', '•']).flat()
  const sx = (v: number) => ({ left: v })

  return (
    <div className="arara">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-6 text-linho md:mb-10">
        <div>
          <p className="selo mb-3 text-terracota-suave">Sale · Seleção de verão</p>
          <h2 className="titulo text-4xl md:text-6xl">A arara do sale</h2>
          <p className="mt-3 max-w-md text-[14px] text-linho/75">
            <span className="mouse:inline hidden">Passe o mouse para virar as peças de frente. Clique para ver de perto.</span>
            <span className="mouse:hidden">Toque numa peça para ver de perto.</span>
          </p>
        </div>
        <p className="text-[13px] text-linho/80">
          Termina em <span className="font-semibold text-linho tabular-nums">{contagem}</span>
        </p>
      </div>

      <div ref={caixa} className="relative w-full" style={{ height: P.H * k }} onKeyDown={teclado}>
        <div
          className={`arara__prancheta ${aberto ? 'is-aberta' : ''}`}
          style={{ width: P.W, height: P.H, transform: `scale(${k})`, ['--ui' as string]: `${P.fonte.ui}px` }}
        >
          {/* trilho cromado */}
          <div className="arara__trilho dim" style={{ left: P.trilho.x0, width: P.trilho.x1 - P.trilho.x0, top: P.trilho.y }} />

          {/* as peças: botões de verdade (foco por teclado vira a peça de frente) */}
          <div className="arara__rack dim" onPointerLeave={() => !aberto && atual < 0 && setHov(-1)}>
            {pecas.map((peca, i) => (
              <button
                key={peca.slug}
                ref={(el) => {
                  botoes.current[i] = el
                }}
                type="button"
                className={`arara__g ${hov === i ? 'is-frente' : ''}`}
                style={{ ...sx(x(i, hov)), top: P.g.top, width: P.slot, height: P.g.h, marginLeft: -P.slot / 2, visibility: atual === i ? 'hidden' : undefined }}
                aria-label={`${peca.nome}, ${reais(peca.preco)}, antes ${reais(peca.precoDe ?? peca.preco)}. Ver de perto`}
                tabIndex={aberto ? -1 : 0}
                onPointerEnter={() => !aberto && atual < 0 && setHov(i)}
                onFocus={() => !aberto && atual < 0 && setHov(i)}
                onClick={() => abrir(i)}
              >
                <i style={{ left: (P.slot - P.g.w) / 2, width: P.g.w }}>
                  <img src={foto(peca)} alt="" loading="lazy" style={{ height: altura(i), width: altura(i) * peca.cabide.proporcao }} />
                </i>
              </button>
            ))}
          </div>

          {/* legenda sob a peça de frente */}
          <div className={`arara__legenda dimmer ${hov >= 0 ? 'is-on' : ''}`} style={{ ...sx(x(Math.max(hov, 0), hov)), top: P.legendaTop }} aria-hidden>
            {hov >= 0 && (
              <>
                <b style={{ fontSize: P.fonte.legenda }}>{pecas[hov].nome}</b>
                <span style={{ fontSize: P.fonte.preco }}>
                  {reais(pecas[hov].preco)} <s className="opacity-60">{reais(pecas[hov].precoDe ?? 0)}</s> · −{descontoPct(pecas[hov])}%
                </span>
              </>
            )}
          </div>

          <a href={linkFiltro('sale')} className="arara__pilula ui dim dimmer" style={{ top: P.botaoTop }}>
            Ver todo o sale
          </a>

          {/* faixa correndo */}
          <div className="arara__faixa dimmer bg-terracota" style={{ height: P.faixa, fontSize: P.fonte.faixa }} aria-hidden>
            <div>
              {faixa.map((t, i) => (
                <span key={i}>{t}</span>
              ))}
            </div>
          </div>

          {/* vista grande */}
          <div className="arara__vista" role={aberto ? 'dialog' : undefined} aria-label={p ? `${p.nome} em detalhe` : undefined} aria-hidden={!aberto}>
            <div className="arara__fundo" onClick={fecharVista} />
            <div ref={fantasma} className="arara__grande arara__grande--fantasma" style={{ width: P.grande.w, height: P.grande.h, top: P.grande.top, marginLeft: -P.grande.w / 2 }}>
              {ps && <img src={foto(ps)} alt="" />}
            </div>
            <div ref={grande} className="arara__grande" style={{ width: P.grande.w, height: P.grande.h, top: P.grande.top, marginLeft: -P.grande.w / 2 }}>
              {p && <img src={foto(p)} alt={p.nome} />}
            </div>

            <button
              type="button"
              className="arara__seta"
              aria-label="Peça anterior"
              tabIndex={aberto ? 0 : -1}
              onClick={() => passo(-1)}
              style={
                P.setas.lateral
                  ? { top: P.setas.top, left: centro - P.grande.w / 2 - 17.5 - P.setas.tam, width: P.setas.tam, height: P.setas.tam }
                  : { top: P.setas.top, left: 30, width: P.setas.tam, height: P.setas.tam }
              }
            >
              <ChevronLeft size={P.setas.tam * 0.36} strokeWidth={1.8} />
            </button>
            <button
              type="button"
              className="arara__seta"
              aria-label="Próxima peça"
              tabIndex={aberto ? 0 : -1}
              onClick={() => passo(1)}
              style={
                P.setas.lateral
                  ? { top: P.setas.top, left: centro + P.grande.w / 2 + 17.5, width: P.setas.tam, height: P.setas.tam }
                  : { top: P.setas.top, left: P.W - 30 - P.setas.tam, width: P.setas.tam, height: P.setas.tam }
              }
            >
              <ChevronRight size={P.setas.tam * 0.36} strokeWidth={1.8} />
            </button>

            <div className="arara__info" style={{ top: P.infoTop }} aria-live="polite">
              {p && (
                <>
                  <p style={{ fontSize: P.fonte.contador }} className="tracking-[0.16em] text-linho/60 tabular-nums">
                    {dois(atual + 1)} / {dois(N)}
                  </p>
                  <p className="arara__nome" style={{ fontSize: P.fonte.nome, maxWidth: P.W - 80 }}>
                    {p.nome}
                  </p>
                  <p style={{ fontSize: P.fonte.contador + 3 }} className="mb-[18px] tracking-[0.08em] text-linho/70 tabular-nums">
                    {reais(p.preco)} <s className="opacity-60">{reais(p.precoDe ?? 0)}</s> <span className="text-terracota-suave">−{descontoPct(p)}%</span>
                  </p>
                  <a href={linkProduto(p.slug)} className="arara__pilula arara__pilula--estatica ui" tabIndex={aberto ? 0 : -1}>
                    Ver a peça e escolher tamanho
                  </a>
                </>
              )}
            </div>

            <button ref={fechar} type="button" className="arara__fechar ui" tabIndex={aberto ? 0 : -1} onClick={fecharVista}>
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
