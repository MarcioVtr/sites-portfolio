import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent, type PointerEvent as RPointerEvent, type TouchEvent } from 'react'
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Leaf, Minus, Package, Plus, Ruler, Scissors, ShieldCheck, Truck, RefreshCw } from 'lucide-react'
import { AVALIACOES, CUIDADOS, LOJA, PRODUTOS, TABELA_MEDIDAS, fotoProduto, nomeCategoria, porSlug, corDoTom, type Produto as TProduto } from '../conteudo'
import { useCarrinho } from '../lib/carrinho'
import { reais } from '../lib/formato'
import { linkFiltro } from '../lib/rota'
import { useTom } from '../lib/tom'
import { CardProduto } from '../ui/CardProduto'
import { Estrelas, Preco, SeloDesconto, container } from '../ui/base'

/* ───────────── Galeria ───────────── */

function Galeria({ produto }: { produto: TProduto }) {
  const [ativa, setAtiva] = useState(1)
  const [zoom, setZoom] = useState(false)
  const [origem, setOrigem] = useState('50% 50%')
  const toqueX = useRef<number | null>(null)
  const fotos = Array.from({ length: produto.fotos }, (_, i) => i + 1)
  const ir = (d: number) => setAtiva((a) => ((a - 1 + d + produto.fotos) % produto.fotos) + 1)

  const mover = (e: RPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    setOrigem(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`)
  }

  const fimToque = (e: TouchEvent) => {
    if (toqueX.current === null) return
    const dx = e.changedTouches[0].clientX - toqueX.current
    if (Math.abs(dx) > 40) ir(dx < 0 ? 1 : -1)
    toqueX.current = null
  }

  return (
    <div className="grid gap-3 md:grid-cols-[76px_1fr] lg:grid-cols-[88px_1fr] lg:gap-4">
      {/* Miniaturas: verticais à esquerda no desktop, linha abaixo no celular */}
      <div className="sem-barra order-2 flex gap-2 overflow-x-auto md:order-1 md:flex-col md:gap-3 md:overflow-visible" role="tablist" aria-label="Fotos do produto">
        {fotos.map((n) => (
          <button
            key={n}
            type="button"
            role="tab"
            aria-selected={ativa === n}
            aria-label={`Foto ${n} de ${produto.fotos}`}
            onClick={() => setAtiva(n)}
            onMouseEnter={() => setAtiva(n)}
            className={`relative aspect-[4/5] w-[72px] shrink-0 overflow-hidden transition md:w-full ${ativa === n ? 'ring-1 ring-cafe ring-offset-2 ring-offset-linho' : 'opacity-60 hover:opacity-100'}`}
          >
            <img src={fotoProduto(produto.slug, n, true)} alt="" className="size-full object-cover" />
          </button>
        ))}
      </div>

      <div
        className={`group relative order-1 aspect-[4/5] overflow-hidden bg-linho-escuro md:order-2 ${zoom ? 'cursor-zoom-out' : 'mouse:cursor-zoom-in'}`}
        onPointerEnter={(e) => e.pointerType === 'mouse' && setZoom(true)}
        onPointerLeave={() => setZoom(false)}
        onPointerMove={mover}
        onTouchStart={(e) => (toqueX.current = e.touches[0].clientX)}
        onTouchEnd={fimToque}
      >
        {fotos.map((n) => (
          <img
            key={n}
            src={fotoProduto(produto.slug, n)}
            alt={n === 1 ? produto.nome : `${produto.nome}, detalhe ${n - 1}`}
            loading={n === 1 ? 'eager' : 'lazy'}
            style={{ transformOrigin: origem }}
            className={`absolute inset-0 size-full object-cover transition-[opacity,transform] duration-300 ease-out ${ativa === n ? 'opacity-100' : 'opacity-0'} ${
              ativa === n && zoom ? 'scale-[2.1]' : 'scale-100'
            }`}
          />
        ))}

        <div className="pointer-events-none absolute top-4 left-4 flex flex-col items-start gap-1.5">
          <SeloDesconto produto={produto} />
          {produto.novo && <span className="bg-linho px-2 py-1 text-[11px] font-bold tracking-wide">NOVO</span>}
        </div>

        {produto.fotos > 1 && (
          <>
            <button
              type="button"
              onClick={() => ir(-1)}
              aria-label="Foto anterior"
              className="absolute top-1/2 left-3 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-linho/90 opacity-100 shadow-sm transition mouse:opacity-0 mouse:group-hover:opacity-100"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => ir(1)}
              aria-label="Próxima foto"
              className="absolute top-1/2 right-3 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-linho/90 opacity-100 shadow-sm transition mouse:opacity-0 mouse:group-hover:opacity-100"
            >
              <ChevronRight size={20} />
            </button>
            <span className="absolute right-4 bottom-4 bg-linho/90 px-2.5 py-1 text-[12px] font-semibold tabular-nums md:hidden">
              {ativa} / {produto.fotos}
            </span>
          </>
        )}
        <span className="pointer-events-none absolute bottom-4 left-4 hidden bg-linho/90 px-2.5 py-1 text-[11px] font-semibold tracking-wide transition mouse:block mouse:group-hover:opacity-0">
          Passe o mouse para ampliar
        </span>
      </div>
    </div>
  )
}

/* ───────────── Área de compra ───────────── */

function Compra({ produto, verAba }: { produto: TProduto; verAba: (aba: Aba) => void }) {
  const { adicionar } = useCarrinho()
  const { tom } = useTom()
  // Se a pessoa fez a prova de cor na home, a peça já abre nessa cor.
  const [cor, setCor] = useState((corDoTom(produto, tom) ?? produto.cores[0]).nome)
  const [tamanho, setTamanho] = useState<string | null>(null)
  const [qtd, setQtd] = useState(1)
  const [erro, setErro] = useState(false)
  const [tentativas, setTentativas] = useState(0)
  const idTam = useId()

  const comprar = (abrirSacola: boolean) => {
    if (!tamanho) {
      setErro(true)
      setTentativas((n) => n + 1)
      document.getElementById(idTam)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    adicionar({ slug: produto.slug, cor, tamanho, qtd }, { abrir: abrirSacola })
  }

  return (
    <div className="lg:sticky lg:top-40">
      <p className="selo mb-3 text-terracota">
        {nomeCategoria(produto.categoria)}
        {produto.novo && ' · Novo'}
      </p>
      <h1 className="titulo text-4xl md:text-5xl">{produto.nome}</h1>

      <button type="button" onClick={() => verAba('avaliacoes')} className="mt-4 flex items-center gap-2 text-[13px] hover:underline">
        <Estrelas nota={produto.avaliacao} />
        <span className="font-semibold">{produto.avaliacao.toLocaleString('pt-BR')}</span>
        <span className="text-pedra">({produto.numAvaliacoes} avaliações)</span>
      </button>

      <div className="mt-6 border-y border-areia py-5">
        <div className="flex items-center gap-3">
          <Preco produto={produto} grande />
          <SeloDesconto produto={produto} />
        </div>
        <p className="mt-1.5 text-[13px] text-pedra">
          ou {LOJA.parcelasSemJuros}x de {reais(produto.preco / LOJA.parcelasSemJuros)} sem juros ·{' '}
          <strong className="font-semibold text-cafe">{reais(produto.preco * (1 - LOJA.descontoPix))} no Pix</strong>
        </p>
      </div>

      <p className="mt-5 text-[15px] leading-relaxed text-cafe-suave">{produto.resumo}</p>

      {/* Cor */}
      <fieldset className="mt-7">
        <legend className="mb-3 text-[13px]">
          Cor: <strong className="font-semibold">{cor}</strong>
        </legend>
        <div className="flex gap-3">
          {produto.cores.map((c) => (
            <label key={c.nome} className="cursor-pointer" title={c.nome}>
              <input type="radio" name="cor" value={c.nome} checked={cor === c.nome} onChange={() => setCor(c.nome)} className="peer sr-only" />
              <span
                className="block size-9 rounded-full ring-1 ring-cafe/20 ring-offset-[3px] ring-offset-linho transition peer-checked:ring-2 peer-checked:ring-cafe peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-terracota"
                style={{ background: c.hex }}
              />
              <span className="sr-only">{c.nome}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Tamanho */}
      <fieldset id={idTam} className="mt-7">
        <div className="mb-3 flex items-center justify-between">
          <legend className="text-[13px]">
            Tamanho: <strong className="font-semibold">{tamanho ?? '—'}</strong>
          </legend>
          <button type="button" onClick={() => verAba('especificacoes')} className="flex items-center gap-1.5 text-[13px] underline underline-offset-4 hover:text-terracota">
            <Ruler size={14} /> Guia de medidas
          </button>
        </div>
        <div key={tentativas} className={`flex flex-wrap gap-2 ${erro ? 'animate-treme' : ''}`}>
          {produto.tamanhos.map((t) => {
            const esgotado = produto.esgotados?.includes(t)
            const sel = tamanho === t
            return (
              <button
                key={t}
                type="button"
                disabled={esgotado}
                aria-pressed={sel}
                aria-label={esgotado ? `${t}, esgotado` : `Tamanho ${t}`}
                onClick={() => {
                  setTamanho(t)
                  setErro(false)
                }}
                className={`relative h-12 min-w-14 border px-3 text-[14px] font-semibold transition ${
                  sel ? 'border-cafe bg-cafe text-linho' : erro ? 'border-terracota' : 'border-areia hover:border-cafe'
                } disabled:cursor-not-allowed disabled:border-areia/60 disabled:text-pedra/40`}
              >
                {t}
                {esgotado && <span aria-hidden className="absolute inset-0 m-auto h-px w-[70%] -rotate-[25deg] bg-pedra/40" />}
              </button>
            )
          })}
        </div>
        {erro && (
          <p role="alert" className="mt-2 text-[13px] font-medium text-terracota-escura">
            Escolha um tamanho para continuar.
          </p>
        )}
        {produto.esgotados?.length ? <p className="mt-2 text-[12px] text-pedra">Tamanho riscado = esgotado. Avisamos quando voltar.</p> : null}
      </fieldset>

      {/* Quantidade + CTAs */}
      <div className="mt-8 flex gap-3">
        <div className="flex h-14 items-center border border-areia" aria-label="Quantidade">
          <button type="button" onClick={() => setQtd((q) => Math.max(1, q - 1))} disabled={qtd <= 1} aria-label="Diminuir quantidade" className="flex h-full w-11 items-center justify-center disabled:text-pedra/40">
            <Minus size={16} />
          </button>
          <span className="w-8 text-center font-semibold tabular-nums" aria-live="polite">
            {qtd}
          </span>
          <button type="button" onClick={() => setQtd((q) => Math.min(10, q + 1))} disabled={qtd >= 10} aria-label="Aumentar quantidade" className="flex h-full w-11 items-center justify-center disabled:text-pedra/40">
            <Plus size={16} />
          </button>
        </div>
        <button type="button" onClick={() => comprar(false)} className="h-14 flex-1 border border-cafe text-[14px] font-semibold transition hover:bg-cafe hover:text-linho">
          Adicionar ao carrinho
        </button>
      </div>
      <button type="button" onClick={() => comprar(true)} className="mt-3 h-14 w-full bg-terracota text-[14px] font-semibold text-white transition hover:bg-terracota-escura">
        Comprar agora
      </button>

      <ul className="mt-7 grid gap-3 text-[13px] text-cafe-suave">
        <li className="flex items-center gap-3">
          <Truck size={18} strokeWidth={1.5} className="text-terracota" />
          {produto.preco >= LOJA.freteGratisAcima ? 'Frete grátis para este produto' : `Frete grátis acima de ${reais(LOJA.freteGratisAcima)}`}
          <button type="button" onClick={() => verAba('frete')} className="ml-auto underline underline-offset-4 hover:text-terracota">
            Calcular
          </button>
        </li>
        <li className="flex items-center gap-3">
          <RefreshCw size={18} strokeWidth={1.5} className="text-terracota" />
          Primeira troca grátis em até 30 dias
        </li>
        <li className="flex items-center gap-3">
          <ShieldCheck size={18} strokeWidth={1.5} className="text-terracota" />
          Compra segura · Pix, cartão ou boleto
        </li>
      </ul>
    </div>
  )
}

/* ───────────── Abas ───────────── */

type Aba = 'descricao' | 'especificacoes' | 'avaliacoes' | 'frete'
const ABAS: { id: Aba; rotulo: string }[] = [
  { id: 'descricao', rotulo: 'Descrição' },
  { id: 'especificacoes', rotulo: 'Especificações' },
  { id: 'avaliacoes', rotulo: 'Avaliações' },
  { id: 'frete', rotulo: 'Frete' },
]

function Descricao({ produto }: { produto: TProduto }) {
  const pontos = [
    { Icone: Leaf, t: 'Fibra natural', d: produto.composicao },
    { Icone: Scissors, t: 'Feito em pequenos lotes', d: 'Cortado e costurado no nosso ateliê em Minas Gerais.' },
    { Icone: Package, t: 'Embalagem sem plástico', d: 'Papel reciclado e saquinho de algodão reutilizável.' },
  ]
  return (
    <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
      <div className="max-w-2xl space-y-4 text-[15px] leading-relaxed text-cafe-suave md:text-base">
        {produto.descricao.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      <ul className="space-y-6">
        {pontos.map(({ Icone, t, d }) => (
          <li key={t} className="flex gap-4">
            <Icone size={20} strokeWidth={1.5} className="mt-0.5 shrink-0 text-terracota" />
            <div>
              <p className="font-semibold">{t}</p>
              <p className="text-[14px] text-pedra">{d}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Especificacoes({ produto }: { produto: TProduto }) {
  const linhas: [string, string][] = [
    ['Composição', produto.composicao],
    ['Modelagem', produto.modelagem],
    ['Comprimento', produto.comprimento],
    ['Cores', produto.cores.map((c) => c.nome).join(', ')],
    ['Tamanhos', produto.tamanhos.join(' · ')],
    ['Origem', 'Feito no Brasil'],
    ['Referência', `AMB-${produto.slug.slice(0, 3).toUpperCase()}-${String(PRODUTOS.indexOf(produto) + 101)}`],
  ]
  return (
    <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
      <div>
        <dl className="divide-y divide-areia border-y border-areia">
          {linhas.map(([k, v]) => (
            <div key={k} className="grid grid-cols-[9rem_1fr] gap-4 py-3.5 text-[14px]">
              <dt className="text-pedra">{k}</dt>
              <dd className="font-medium">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 text-[13px] leading-relaxed text-pedra">
          <strong className="font-semibold text-cafe">Cuidados: </strong>
          {CUIDADOS}
        </p>
      </div>
      <div>
        <h3 className="titulo mb-1 text-2xl">Guia de medidas</h3>
        <p className="mb-5 text-[13px] text-pedra">Medidas do corpo, em centímetros. Entre dois tamanhos? Para modelagens amplas, escolha o menor.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[14px] tabular-nums">
            <thead>
              <tr className="border-b border-cafe">
                {TABELA_MEDIDAS.colunas.map((c) => (
                  <th key={c} scope="col" className="py-2.5 pr-4 font-semibold">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TABELA_MEDIDAS.linhas.map((l) => (
                <tr key={l[0]} className={`border-b border-areia ${produto.tamanhos.includes(l[0]) ? '' : 'text-pedra/50'}`}>
                  {l.map((v, i) =>
                    i === 0 ? (
                      <th key={i} scope="row" className="py-2.5 pr-4 font-semibold">
                        {v}
                      </th>
                    ) : (
                      <td key={i} className="py-2.5 pr-4">
                        {v}
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function Avaliacoes({ produto }: { produto: TProduto }) {
  const { avisar } = useCarrinho()
  const inicio = PRODUTOS.indexOf(produto) % AVALIACOES.length
  const lista = [0, 1, 2].map((i) => AVALIACOES[(inicio + i) % AVALIACOES.length])
  // Distribuição ilustrativa coerente com a nota média.
  const cinco = Math.round((produto.avaliacao - 4) * 100 * 0.85 + 8)
  const dist = [cinco, Math.max(0, 100 - cinco - 6), 4, 1, 1]

  return (
    <div>
    <p className="mb-8 inline-flex items-center gap-2 border border-dashed border-pedra/50 px-3 py-1.5 text-[12px] font-semibold text-pedra">
      Avaliações de exemplo · demonstração do layout, não são de clientes reais
    </p>
    <div className="grid gap-12 lg:grid-cols-[320px_1fr] lg:gap-20">
      <div>
        <p className="titulo text-7xl">{produto.avaliacao.toLocaleString('pt-BR', { minimumFractionDigits: 1 })}</p>
        <div className="mt-2 flex items-center gap-2">
          <Estrelas nota={produto.avaliacao} tamanho={16} />
          <span className="text-[13px] text-pedra">{produto.numAvaliacoes} avaliações</span>
        </div>
        <ul className="mt-6 space-y-2">
          {dist.map((pct, i) => (
            <li key={i} className="flex items-center gap-3 text-[13px]">
              <span className="w-3 tabular-nums">{5 - i}</span>
              <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-areia">
                <span className="block h-full rounded-full bg-cafe" style={{ width: `${pct}%` }} />
              </span>
              <span className="w-9 text-right text-pedra tabular-nums">{pct}%</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-[13px]">
          <strong className="font-semibold">Caimento:</strong> <span className="text-pedra">a maioria diz que veste no tamanho certo.</span>
        </p>
        <button type="button" onClick={() => avisar('Demo: avaliações entram na versão completa')} className="mt-6 w-full border border-cafe py-3 text-[13px] font-semibold hover:bg-cafe hover:text-linho">
          Escrever avaliação
        </button>
      </div>

      <ul className="divide-y divide-areia border-y border-areia">
        {lista.map((a) => (
          <li key={a.nome} className="py-6">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <Estrelas nota={a.nota} />
              <span className="text-[12px] text-pedra">{a.data}</span>
            </div>
            <p className="font-semibold">{a.titulo}</p>
            <p className="mt-1.5 max-w-2xl text-[14px] leading-relaxed text-cafe-suave">{a.texto}</p>
            <p className="mt-3 text-[12px] text-pedra">
              {a.nome} · {a.cidade} · comprou tam. {a.tamanho} · <span className="text-oliva">Compra verificada</span>
            </p>
          </li>
        ))}
      </ul>
    </div>
    </div>
  )
}

function Frete({ produto }: { produto: TProduto }) {
  const [cep, setCep] = useState('')
  const [calculado, setCalculado] = useState<string | null>(null)
  const digitos = cep.replace(/\D/g, '')
  const gratis = produto.preco >= LOJA.freteGratisAcima

  const calcular = (e: FormEvent) => {
    e.preventDefault()
    if (digitos.length === 8) setCalculado(digitos)
  }

  // Demo: prazos aproximados pela região do CEP (1º dígito).
  const regiao = calculado ? Number(calculado[0]) : 0
  const sp = regiao <= 1
  const opcoes = calculado
    ? [
        { nome: 'Econômica', prazo: sp ? '3 a 5 dias úteis' : regiao <= 3 ? '5 a 8 dias úteis' : '7 a 12 dias úteis', preco: gratis ? 0 : sp ? 14.9 : 22.9 },
        { nome: 'Expressa', prazo: sp ? '1 a 2 dias úteis' : regiao <= 3 ? '2 a 4 dias úteis' : '3 a 6 dias úteis', preco: sp ? 24.9 : 39.9 },
        ...(sp ? [{ nome: 'Retirada no ateliê (Vila Madalena)', prazo: 'Pronto em 1 dia útil', preco: 0 }] : []),
      ]
    : []

  return (
    <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
      <div>
        <form onSubmit={calcular} className="flex max-w-md">
          <label htmlFor="cep" className="sr-only">
            CEP
          </label>
          <input
            id="cep"
            inputMode="numeric"
            autoComplete="postal-code"
            placeholder="00000-000"
            value={cep}
            onChange={(e) => {
              const d = e.target.value.replace(/\D/g, '').slice(0, 8)
              setCep(d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d)
            }}
            className="h-12 flex-1 border border-r-0 border-areia bg-transparent px-4 tracking-wider tabular-nums outline-none focus:border-cafe"
          />
          <button type="submit" disabled={digitos.length !== 8} className="h-12 bg-cafe px-6 text-[13px] font-semibold text-linho disabled:opacity-40">
            Calcular
          </button>
        </form>
        <a href="https://buscacepinter.correios.com.br/" target="_blank" rel="noreferrer" className="mt-2 inline-block text-[12px] text-pedra underline underline-offset-4">
          Não sei meu CEP
        </a>

        {calculado && (
          <ul className="mt-6 max-w-md animate-entra divide-y divide-areia border-y border-areia" aria-live="polite">
            {opcoes.map((o) => (
              <li key={o.nome} className="flex items-center justify-between gap-4 py-3.5 text-[14px]">
                <span>
                  <span className="block font-semibold">{o.nome}</span>
                  <span className="text-[13px] text-pedra">{o.prazo}</span>
                </span>
                <span className={`font-semibold tabular-nums ${o.preco === 0 ? 'text-oliva' : ''}`}>{o.preco === 0 ? 'Grátis' : reais(o.preco)}</span>
              </li>
            ))}
          </ul>
        )}
        {calculado && <p className="mt-3 text-[12px] text-pedra">Valores simulados para esta demonstração.</p>}
      </div>

      <ul className="space-y-5 text-[14px] leading-relaxed text-cafe-suave">
        <li>
          <strong className="block font-semibold text-cafe">Frete grátis acima de {reais(LOJA.freteGratisAcima)}</strong>
          Na modalidade econômica, para todo o Brasil.
        </li>
        <li>
          <strong className="block font-semibold text-cafe">Envio em até 1 dia útil</strong>
          Pedidos aprovados até 14h saem no mesmo dia.
        </li>
        <li>
          <strong className="block font-semibold text-cafe">Troca e devolução</strong>
          Primeira troca grátis em até 30 dias. Devolução em até 7 dias após o recebimento, como prevê o Código de Defesa do Consumidor.
        </li>
      </ul>
    </div>
  )
}

function Abas({ produto, aba, setAba }: { produto: TProduto; aba: Aba; setAba: (a: Aba) => void }) {
  const base = useId()
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  const teclado = (e: KeyboardEvent, i: number) => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!d) return
    e.preventDefault()
    const n = (i + d + ABAS.length) % ABAS.length
    setAba(ABAS[n].id)
    refs.current[n]?.focus()
  }

  return (
    <div>
      <div role="tablist" aria-label="Informações do produto" className="sem-barra -mx-5 flex gap-8 overflow-x-auto border-b border-areia px-5 md:mx-0 md:gap-12 md:px-0">
        {ABAS.map((a, i) => (
          <button
            key={a.id}
            ref={(el) => {
              refs.current[i] = el
            }}
            role="tab"
            type="button"
            id={`${base}-tab-${a.id}`}
            aria-selected={aba === a.id}
            aria-controls={`${base}-painel-${a.id}`}
            tabIndex={aba === a.id ? 0 : -1}
            onClick={() => setAba(a.id)}
            onKeyDown={(e) => teclado(e, i)}
            className={`relative shrink-0 pb-4 text-[15px] font-semibold transition after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:bg-cafe after:transition-transform ${
              aba === a.id ? 'text-cafe after:scale-x-100' : 'text-pedra after:scale-x-0 hover:text-cafe'
            }`}
          >
            {a.rotulo}
            {a.id === 'avaliacoes' && <span className="ml-1.5 text-[12px] font-medium text-pedra">({produto.numAvaliacoes})</span>}
          </button>
        ))}
      </div>
      <div key={aba} role="tabpanel" id={`${base}-painel-${aba}`} aria-labelledby={`${base}-tab-${aba}`} tabIndex={0} className="animate-entra pt-10 outline-none md:pt-12">
        {aba === 'descricao' && <Descricao produto={produto} />}
        {aba === 'especificacoes' && <Especificacoes produto={produto} />}
        {aba === 'avaliacoes' && <Avaliacoes produto={produto} />}
        {aba === 'frete' && <Frete produto={produto} />}
      </div>
    </div>
  )
}

/* ───────────── Relacionados (carrossel) ───────────── */

function Relacionados({ produto }: { produto: TProduto }) {
  const trilho = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ inicio: true, fim: false, progresso: 0 })
  const lista = [
    ...PRODUTOS.filter((p) => p.categoria === produto.categoria && p.slug !== produto.slug),
    ...PRODUTOS.filter((p) => p.categoria !== produto.categoria),
  ].slice(0, 8)

  const atualizar = () => {
    const t = trilho.current
    if (!t) return
    const max = t.scrollWidth - t.clientWidth
    setPos({ inicio: t.scrollLeft <= 4, fim: t.scrollLeft >= max - 4, progresso: max > 0 ? t.scrollLeft / max : 1 })
  }

  useEffect(() => {
    const t = trilho.current
    if (!t) return
    t.scrollTo({ left: 0 })
    atualizar()
    window.addEventListener('resize', atualizar)
    return () => window.removeEventListener('resize', atualizar)
  }, [produto.slug])

  const rolar = (d: number) => trilho.current?.scrollBy({ left: d * trilho.current.clientWidth, behavior: 'smooth' })

  return (
    <section className={`${container} py-20 md:py-28`} aria-label="Produtos relacionados">
      <div className="mb-8 flex items-end justify-between gap-4 md:mb-10">
        <div>
          <p className="selo mb-3 text-terracota">Complete o look</p>
          <h2 className="titulo text-4xl md:text-5xl">Você também pode gostar</h2>
        </div>
        <div className="hidden gap-2 sm:flex">
          <button type="button" onClick={() => rolar(-1)} disabled={pos.inicio} aria-label="Anteriores" className="flex size-12 items-center justify-center rounded-full border border-cafe transition hover:bg-cafe hover:text-linho disabled:border-areia disabled:text-pedra/40 disabled:hover:bg-transparent">
            <ArrowLeft size={18} />
          </button>
          <button type="button" onClick={() => rolar(1)} disabled={pos.fim} aria-label="Próximos" className="flex size-12 items-center justify-center rounded-full border border-cafe transition hover:bg-cafe hover:text-linho disabled:border-areia disabled:text-pedra/40 disabled:hover:bg-transparent">
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      <div ref={trilho} onScroll={atualizar} className="sem-barra -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 sm:gap-5 md:mx-0 md:scroll-px-0 md:px-0">
        {lista.map((p) => (
          <div key={p.slug} className="w-[calc((100%-0.75rem)/2)] shrink-0 snap-start sm:w-[calc((100%-1.25rem)/2)] md:w-[calc((100%-2.5rem)/3)] lg:w-[calc((100%-3.75rem)/4)]">
            <CardProduto produto={p} />
          </div>
        ))}
      </div>

      <div className="mt-8 h-px bg-areia" aria-hidden>
        <div className="h-px bg-cafe transition-[width] duration-300" style={{ width: `${Math.max(12, pos.progresso * 100)}%` }} />
      </div>
    </section>
  )
}

/* ───────────── Página ───────────── */

export default function Produto({ slug }: { slug: string }) {
  const produto = porSlug(slug)
  const [aba, setAba] = useState<Aba>('descricao')
  const abas = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (produto) document.title = `${produto.nome} · Âmbar`
    return () => {
      document.title = 'Âmbar · Roupas em fibras naturais'
    }
  }, [produto])

  if (!produto) {
    return (
      <section className={`${container} flex min-h-[60vh] flex-col items-center justify-center py-24 text-center`}>
        <p className="selo mb-4 text-terracota">Erro 404</p>
        <h1 className="titulo mb-4 text-5xl">Essa peça não está mais aqui</h1>
        <p className="mb-8 text-pedra">Pode ter esgotado ou mudado de endereço.</p>
        <a href="#/" className="bg-cafe px-7 py-4 text-[13px] font-semibold text-linho">
          Voltar para a loja
        </a>
      </section>
    )
  }

  const verAba = (a: Aba) => {
    setAba(a)
    requestAnimationFrame(() => abas.current?.scrollIntoView({ behavior: 'smooth' }))
  }

  return (
    <>
      <div className={container}>
        <nav aria-label="Você está em" className="py-5 text-[12px] text-pedra md:py-7">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <a href="#/" className="hover:text-cafe">
                Início
              </a>
            </li>
            <li aria-hidden>/</li>
            <li>
              <a href={linkFiltro(produto.categoria)} className="hover:text-cafe">
                {nomeCategoria(produto.categoria)}
              </a>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-cafe">
              {produto.nome}
            </li>
          </ol>
        </nav>

        <div key={produto.slug} className="grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-16 xl:gap-24">
          <Galeria produto={produto} />
          <Compra produto={produto} verAba={verAba} />
        </div>

        <div ref={abas} className="scroll-mt-40 pt-20 md:pt-28">
          <Abas produto={produto} aba={aba} setAba={setAba} />
        </div>
      </div>

      <Relacionados produto={produto} />
    </>
  )
}
