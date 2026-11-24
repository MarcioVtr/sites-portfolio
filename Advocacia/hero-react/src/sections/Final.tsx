import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { ChevronLeft, ChevronRight, Clock, Mail, MapPin, Phone, Scale } from 'lucide-react'
import { DEPOIMENTOS, ESCRITORIO, RODAPE } from '../conteudo'
import { MOLDURA } from '../ui/moldura'
import { Cabecalho, Logo, Reveal, Seta } from '../ui/base'

/* ---------------- 6. Depoimentos (carrossel) ---------------- */
export function Depoimentos() {
  const [atual, setAtual] = useState(0)
  const [pausado, setPausado] = useState(false)
  const toqueX = useRef<number | null>(null)
  const total = DEPOIMENTOS.length

  const ir = useCallback((i: number) => setAtual(((i % total) + total) % total), [total])

  useEffect(() => {
    if (pausado || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = window.setTimeout(() => ir(atual + 1), 7000)
    return () => clearTimeout(t)
  }, [atual, pausado, ir])

  return (
    <section id="depoimentos" className="bg-white py-24 sm:py-32">
      <div className={MOLDURA}>
        <Cabecalho selo="Depoimentos" titulo="O que dizem quem passou por aqui." />

        <Reveal className="mt-14">
          <div
            role="region"
            aria-roledescription="carrossel"
            aria-label="Depoimentos de clientes"
            tabIndex={0}
            onMouseEnter={() => setPausado(true)}
            onMouseLeave={() => setPausado(false)}
            onFocus={() => setPausado(true)}
            onBlur={() => setPausado(false)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') ir(atual + 1)
              if (e.key === 'ArrowLeft') ir(atual - 1)
            }}
            onTouchStart={(e) => (toqueX.current = e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (toqueX.current === null) return
              const dx = e.changedTouches[0].clientX - toqueX.current
              if (Math.abs(dx) > 50) ir(atual + (dx < 0 ? 1 : -1))
              toqueX.current = null
            }}
            className="rounded-3xl bg-[#f0f0ee] p-8 sm:p-14 outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <div className="overflow-hidden">
              <div className="flex transition-transform duration-700 ease-out" style={{ transform: `translateX(-${atual * 100}%)` }}>
                {DEPOIMENTOS.map((d, i) => (
                  <figure
                    key={d.nome}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${i + 1} de ${total}`}
                    aria-hidden={i !== atual}
                    className="w-full shrink-0 pr-2"
                  >
                    <blockquote className="max-w-3xl text-[1.25rem] sm:text-[1.75rem] leading-[1.3] font-medium tracking-tight text-gray-900">
                      “{d.texto}”
                    </blockquote>
                    <figcaption className="mt-8 flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[13px] font-medium text-gray-700">
                        {d.nome.charAt(0)}
                      </span>
                      <span>
                        <span className="block text-[14px] font-medium text-gray-900">{d.nome}</span>
                        <span className="block text-[12.5px] text-gray-500">{d.contexto}</span>
                      </span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>

            <div className="mt-10 flex items-center justify-between">
              <div className="flex gap-2" role="tablist" aria-label="Escolher depoimento">
                {DEPOIMENTOS.map((d, i) => (
                  <button
                    key={d.nome}
                    role="tab"
                    aria-selected={i === atual}
                    aria-label={`Depoimento ${i + 1}`}
                    onClick={() => ir(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${i === atual ? 'w-8 bg-blue-500' : 'w-2 bg-gray-300 hover:bg-gray-400'}`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => ir(atual - 1)}
                  aria-label="Depoimento anterior"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-gray-700 transition-colors hover:bg-blue-500 hover:text-white"
                >
                  <ChevronLeft size={18} strokeWidth={1.8} />
                </button>
                <button
                  onClick={() => ir(atual + 1)}
                  aria-label="Próximo depoimento"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-gray-700 transition-colors hover:bg-blue-500 hover:text-white"
                >
                  <ChevronRight size={18} strokeWidth={1.8} />
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ---------------- 7. CTA final ---------------- */
export function Contato() {
  return (
    <section id="contato" className="bg-white pb-24 sm:pb-32">
      <div className={MOLDURA}>
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-blue-500 px-8 py-14 sm:px-16 sm:py-20 text-white">
            <Scale
              aria-hidden="true"
              strokeWidth={0.6}
              className="pointer-events-none absolute -right-10 -bottom-16 h-[340px] w-[340px] text-white/15 sm:h-[460px] sm:w-[460px]"
            />
            <div className="relative max-w-xl">
              <p className="text-[11.5px] font-medium text-white/80 mb-3">Primeira conversa sem compromisso</p>
              <h2 className="text-[2rem] sm:text-[2.75rem] leading-[1.08] font-medium tracking-tight">Vamos conversar sobre o seu caso?</h2>
              <p className="mt-4 text-[14px] leading-relaxed text-white/80 max-w-md">
                Conte o que está acontecendo. Em até 24 horas, um advogado responde explicando quais caminhos existem.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                <a
                  href={ESCRITORIO.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[14px] font-medium text-blue-600 transition-all duration-200 hover:bg-gray-900 hover:text-white"
                >
                  Falar pelo WhatsApp <Seta />
                </a>
                <a href={ESCRITORIO.telefoneLink} className="text-[13px] font-medium text-white/85 underline-offset-4 hover:underline">
                  ou ligue {ESCRITORIO.telefone}
                </a>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            { Icone: MapPin, rotulo: 'Endereço', valor: ESCRITORIO.endereco },
            { Icone: Clock, rotulo: 'Horário', valor: ESCRITORIO.horario },
            { Icone: Mail, rotulo: 'E-mail', valor: ESCRITORIO.email, href: `mailto:${ESCRITORIO.email}` },
          ].map(({ Icone, rotulo, valor, href }, i) => (
            <Reveal key={rotulo} atraso={i * 90}>
              <div className="flex items-start gap-4 rounded-2xl bg-[#f0f0ee] p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-gray-700">
                  <Icone size={17} strokeWidth={1.7} />
                </span>
                <div className="min-w-0">
                  <p className="text-[11.5px] font-medium text-gray-400">{rotulo}</p>
                  {href ? (
                    <a href={href} className="block truncate text-[13.5px] text-gray-800 hover:text-blue-500">{valor}</a>
                  ) : (
                    <p className="text-[13.5px] text-gray-800">{valor}</p>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------- 8. Rodapé ---------------- */
const ANO = new Date().getFullYear()

export function Rodape() {
  const [msg, setMsg] = useState<{ ok: boolean; texto: string } | null>(null)

  const assinar = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const campo = e.currentTarget.elements.namedItem('email') as HTMLInputElement
    const valido = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(campo.value.trim())
    setMsg(valido ? { ok: true, texto: 'Inscrição confirmada. Obrigado!' } : { ok: false, texto: 'Digite um e-mail válido.' })
    if (valido) e.currentTarget.reset()
  }

  return (
    <footer className="bg-[#f0f0ee] pt-20">
      <div className={MOLDURA}>
        <div className="grid gap-14 lg:grid-cols-[1.1fr_2fr]">
          <div>
            <a href="#inicio" className="inline-flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full" style={{ backgroundColor: '#EDEDED' }}>
                <Logo />
              </span>
              <span className="text-[15px] font-medium text-gray-900">{ESCRITORIO.nomeCompleto}</span>
            </a>
            <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-gray-500">{ESCRITORIO.tagline}</p>

            <form onSubmit={assinar} noValidate className="mt-8 max-w-sm">
              <label htmlFor="news" className="text-[12.5px] font-medium text-gray-700">
                Receba nosso informativo mensal sobre seus direitos
              </label>
              <div className="mt-3 flex gap-2 rounded-full bg-white p-1.5 ring-1 ring-gray-200 focus-within:ring-blue-400">
                <input
                  id="news"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="seu@email.com"
                  className="min-w-0 flex-1 bg-transparent px-3 text-[13px] text-gray-900 outline-none placeholder:text-gray-400"
                />
                <button type="submit" className="rounded-full bg-blue-500 px-4 py-2 text-[12.5px] font-medium text-white transition-colors hover:bg-blue-600">
                  Assinar
                </button>
              </div>
              <p role="status" aria-live="polite" className={`mt-2 min-h-5 text-[12px] ${msg?.ok ? 'text-emerald-600' : 'text-red-500'}`}>
                {msg?.texto}
              </p>
            </form>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
            {RODAPE.map((col) => (
              <div key={col.titulo}>
                <h3 className="text-[12.5px] font-medium text-gray-900">{col.titulo}</h3>
                <ul className="mt-4 space-y-3">
                  {col.links.map(([rotulo, href]) => (
                    <li key={rotulo}>
                      <a href={href} className="text-[13px] text-gray-500 transition-colors hover:text-gray-900">
                        {rotulo}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-gray-300/70 py-8 text-[12px] text-gray-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {ANO} {ESCRITORIO.razaoSocial} · {ESCRITORIO.oab}
          </p>
          <p className="flex items-center gap-4">
            <a href={ESCRITORIO.telefoneLink} className="inline-flex items-center gap-1.5 hover:text-gray-700">
              <Phone size={13} /> {ESCRITORIO.telefone}
            </a>
            <a href={`mailto:${ESCRITORIO.email}`} className="inline-flex items-center gap-1.5 hover:text-gray-700">
              <Mail size={13} /> E-mail
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
