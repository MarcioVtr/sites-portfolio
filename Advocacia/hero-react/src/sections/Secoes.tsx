import {
  BriefcaseBusiness,
  HeartHandshake,
  House,
  Mail,
  Scale,
  ScrollText,
  ShieldCheck,
  ShoppingBag,
  type LucideIcon,
} from 'lucide-react'
import { AREAS, CASOS, EQUIPE, NUMEROS, PASSOS, type IconeArea } from '../conteudo'
import { MOLDURA } from '../ui/moldura'
import { Cabecalho, Contador, IconeLinkedin, Reveal } from '../ui/base'

const ICONES: Record<IconeArea, LucideIcon> = {
  familia: HeartHandshake,
  trabalho: BriefcaseBusiness,
  previdencia: ShieldCheck,
  sucessoes: ScrollText,
  consumidor: ShoppingBag,
  imovel: House,
}

/* ---------------- 2. Números ---------------- */
// 2 colunas no celular, 4 no desktop: cada célula sabe quais divisórias desenhar
const BORDAS = [
  '',
  'border-l pl-6 sm:pl-10',
  'border-t lg:border-t-0 lg:border-l lg:pl-10',
  'border-t lg:border-t-0 border-l pl-6 sm:pl-10',
]

export function Numeros() {
  return (
    <section aria-label="Números do escritório" className="bg-[#f0f0ee]">
      <div className={MOLDURA}>
        <dl className="grid grid-cols-2 lg:grid-cols-4 border-t border-gray-300/70">
          {NUMEROS.map((n, i) => (
            <Reveal key={n.rotulo} atraso={i * 90} className={`flex flex-col-reverse py-10 sm:py-14 border-gray-300/70 ${BORDAS[i]}`}>
              <dt className="mt-2 text-[13px] text-gray-500">{n.rotulo}</dt>
              <dd className="text-[2.25rem] sm:text-[3rem] leading-none font-medium tracking-tight text-gray-900">
                <Contador valor={n.valor} decimais={n.decimais} prefixo={n.prefixo} sufixo={n.sufixo} />
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  )
}

/* ---------------- Escritório + como funciona ---------------- */
export function Escritorio() {
  return (
    <section id="escritorio" className="bg-white py-24 sm:py-32">
      <div className={`${MOLDURA} grid gap-16 lg:grid-cols-2 lg:gap-24`}>
        <div>
          <Cabecalho
            selo="O escritório"
            titulo="Um escritório que explica antes de agir."
            apoio="O Prado Ribeiro atende pessoas em momentos decisivos: uma separação, uma demissão, uma aposentadoria negada. Cada caso tem um advogado responsável, que fala com você diretamente e responde no mesmo dia."
          />
          <Reveal atraso={150} className="mt-10 flex items-center gap-4 rounded-2xl bg-[#f0f0ee] p-5 max-w-md">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white">
              <Scale size={20} strokeWidth={1.6} className="text-gray-700" />
            </span>
            <p className="text-[13px] leading-relaxed text-gray-600">
              Honorários combinados por escrito antes de começar. Sem surpresa no meio do caminho.
            </p>
          </Reveal>
        </div>

        <ol className="relative">
          {PASSOS.map((p, i) => (
            <Reveal key={p.titulo} atraso={i * 120}>
              <li className="relative flex gap-5 pb-10 last:pb-0">
                {i < PASSOS.length - 1 && <span className="absolute left-[19px] top-11 bottom-1 w-px bg-gray-200" aria-hidden="true" />}
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EDEDED] text-[13px] font-medium text-gray-700">
                  {i + 1}
                </span>
                <div className="pt-2">
                  <h3 className="text-[16px] font-medium text-gray-900">{p.titulo}</h3>
                  <p className="mt-1 text-[13.5px] leading-relaxed text-gray-500 max-w-sm">{p.texto}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ---------------- 3. Áreas de atuação ---------------- */
export function Areas() {
  return (
    <section id="areas" className="bg-[#f0f0ee] py-24 sm:py-32">
      <div className={MOLDURA}>
        <Cabecalho
          selo="Áreas de atuação"
          titulo="Os momentos em que mais precisam da gente."
          apoio="Atuamos onde o direito encontra a vida das pessoas, com especialistas dedicados a cada área."
        />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {AREAS.map((a, i) => {
            const Icone = ICONES[a.icone]
            return (
              <Reveal key={a.titulo} atraso={(i % 3) * 90}>
                <article className="group h-full rounded-2xl bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-20px_rgba(0,0,0,0.25)]">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EDEDED] text-gray-700 transition-colors duration-300 group-hover:bg-blue-500 group-hover:text-white">
                    <Icone size={20} strokeWidth={1.6} />
                  </span>
                  <h3 className="mt-6 text-[17px] font-medium text-gray-900">{a.titulo}</h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-gray-500">{a.texto}</p>
                  <a href="#contato" className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-blue-500 hover:text-blue-600 group/link">
                    Saiba mais <span className="inline-block transition-transform duration-200 group-hover/link:translate-x-0.5">→</span>
                  </a>
                </article>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ---------------- 4. Casos ---------------- */
export function Casos() {
  return (
    <section id="casos" className="bg-white py-24 sm:py-32">
      <div className={MOLDURA}>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <Cabecalho selo="Casos" titulo="Histórias que terminaram bem." />
          <Reveal className="max-w-xs">
            <p className="text-[12px] leading-relaxed text-gray-400">
              Casos divulgados com autorização e sem identificação dos clientes. Resultados anteriores não garantem resultados futuros.
            </p>
          </Reveal>
        </div>
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {CASOS.map((c, i) => {
            const Icone = ICONES[AREAS.find((a) => a.titulo === c.area)?.icone ?? 'familia']
            return (
              <Reveal key={c.resultado} atraso={i * 110}>
                <article className="group relative flex h-[440px] flex-col overflow-hidden rounded-2xl bg-gray-900 p-7 text-white">
                  <img
                    src={c.imagem}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover grayscale opacity-60 transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/70 to-gray-950/10" />
                  <span className="relative inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[12px] font-medium backdrop-blur">
                    <Icone size={14} strokeWidth={1.8} />
                    {c.area}
                  </span>
                  <div className="relative mt-auto">
                    <p className="text-[1.6rem] leading-[1.15] font-medium tracking-tight">{c.resultado}</p>
                    <p className="mt-3 text-[13.5px] leading-relaxed text-white/70">{c.texto}</p>
                  </div>
                </article>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ---------------- 5. Equipe ---------------- */
export function Equipe() {
  return (
    <section id="equipe" className="bg-[#f0f0ee] py-24 sm:py-32">
      <div className={MOLDURA}>
        <Cabecalho
          selo="Equipe"
          titulo="Quem vai estar com você."
          apoio="Advogados com nome, telefone e tempo para explicar. Cada caso tem um responsável do começo ao fim."
        />
        <div className="mt-14 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
          {EQUIPE.map((p, i) => (
            <Reveal key={p.nome} atraso={i * 90}>
              <article className="group">
                <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-[#e4e4e2]">
                  <img
                    src={p.foto}
                    alt={`Foto de ${p.nome}`}
                    loading="lazy"
                    className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-[1.03]"
                  />
                </div>
                <h3 className="mt-4 text-[15px] font-medium text-gray-900">{p.nome}</h3>
                <p className="mt-0.5 text-[13px] text-gray-500">{p.cargo}</p>
                <p className="mt-1 text-[11.5px] text-gray-400">{p.oab}</p>
                <div className="mt-3 flex gap-2">
                  <a href="#" aria-label={`LinkedIn de ${p.nome}`} className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EDEDED] text-gray-600 transition-colors hover:bg-blue-500 hover:text-white">
                    <IconeLinkedin className="h-3.5 w-3.5" />
                  </a>
                  <a href="#" aria-label={`E-mail de ${p.nome}`} className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EDEDED] text-gray-600 transition-colors hover:bg-blue-500 hover:text-white">
                    <Mail size={14} strokeWidth={1.8} />
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
