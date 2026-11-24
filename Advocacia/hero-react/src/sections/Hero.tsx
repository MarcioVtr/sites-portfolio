import { useEffect, useRef } from 'react'
import { Check } from 'lucide-react'
import { ESCRITORIO } from '../conteudo'

/**
 * Vídeo de fundo opcional (ex.: um vídeo jurídico próprio). Se preenchido, substitui a foto.
 * O vídeo do prompt original mostrava uma prótese de mão — fora do nicho.
 */
const BACKGROUND_VIDEO = ''

/**
 * Foto: estátua da Justiça (bronze, exibida em tons neutros via grayscale) — Unsplash (licença Unsplash, uso comercial permitido).
 * https://unsplash.com/photos/a8f479c573a9  · arquivos locais em /public/img
 */
const FOTO = { grande: '/img/justica-2400.jpg', media: '/img/justica-1200.jpg' }

/**
 * Movimento de câmera sobre uma escultura real — nada na estátua se mexe:
 *  - entrada: a lente encontra o foco (desfoque → nítido)
 *  - aproximação lenta e contínua (dolly), em ciclos longos
 *  - luz que atravessa o bronze devagar
 *  - paralaxe: o mouse desloca a câmera poucos pixels; a rolagem a afasta
 */
function FotoCinematica() {
  const rolagemRef = useRef<HTMLDivElement>(null)
  const maoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const rolagem = rolagemRef.current
    const mao = maoRef.current
    if (!rolagem || !mao) return

    let alvoX = 0
    let alvoY = 0
    let x = 0
    let y = 0
    let raf = 0

    const aoMover = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      alvoX = (e.clientX / window.innerWidth - 0.5) * -18
      alvoY = (e.clientY / window.innerHeight - 0.5) * -12
    }

    const quadro = () => {
      // câmera na mão: segue o mouse com inércia, sem pressa
      x += (alvoX - x) * 0.04
      y += (alvoY - y) * 0.04
      mao.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`

      // rolagem: a imagem desce mais devagar que a página e se afasta um pouco
      const s = Math.min(window.scrollY, window.innerHeight)
      rolagem.style.transform = `translate3d(0, ${(s * 0.3).toFixed(1)}px, 0) scale(${(1 + s / window.innerHeight * 0.06).toFixed(4)})`
      rolagem.style.opacity = String(1 - (s / window.innerHeight) * 0.35)

      raf = requestAnimationFrame(quadro)
    }
    raf = requestAnimationFrame(quadro)
    window.addEventListener('pointermove', aoMover, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', aoMover)
    }
  }, [])

  return (
    <div ref={rolagemRef} className="absolute inset-x-0 top-0 h-[58vh] sm:h-auto sm:inset-0 sm:left-[28%] 2xl:left-[24%] will-change-transform [mask-image:linear-gradient(to_bottom,black_78%,transparent)] sm:[mask-image:linear-gradient(to_right,transparent,black_24%)]">
      <div ref={maoRef} className="absolute -inset-6 will-change-transform">
        <div className="foco absolute inset-0 overflow-hidden">
          <img
            src={FOTO.grande}
            srcSet={`${FOTO.media} 1200w, ${FOTO.grande} 2400w`}
            sizes="100vw"
            alt="Estátua da Justiça em bronze, de olhos vendados, segurando a balança"
            fetchPriority="high"
            className="dolly h-full w-full object-cover object-[54%_40%] sm:object-[60%_80%] grayscale contrast-[1.06] brightness-[1.04]"
          />
          {/* luz atravessando o bronze */}
          <div className="luz pointer-events-none absolute inset-0 mix-blend-soft-light" />
        </div>
      </div>
    </div>
  )
}

export default function Hero() {
  return (
    <section id="inicio" className="relative min-h-screen overflow-hidden bg-[#f0f0ee]">
      <style>{`
        @keyframes foco {
          from { opacity: 0; filter: blur(18px); transform: scale(1.08); }
          to   { opacity: 1; filter: blur(0);    transform: scale(1); }
        }
        @keyframes dolly {
          from { transform: scale(1) translate3d(0, 0, 0); }
          to   { transform: scale(1.045) translate3d(-0.6%, -0.4%, 0); }
        }
        @keyframes luz {
          0%   { background-position: -60% 0; }
          100% { background-position: 160% 0; }
        }
        .foco  { animation: foco 2.8s cubic-bezier(.2,.65,.15,1) both; }
        .dolly { animation: dolly 26s ease-in-out infinite alternate; transform-origin: 60% 55%; }
        .luz {
          background-image: linear-gradient(105deg, transparent 35%, rgba(255,255,255,.5) 50%, transparent 65%);
          background-size: 60% 100%;
          background-repeat: no-repeat;
          animation: luz 16s ease-in-out 2.4s infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .foco, .dolly, .luz { animation: none; }
        }
      `}</style>

      {BACKGROUND_VIDEO ? (
        <video className="absolute inset-0 w-full h-full object-cover" src={BACKGROUND_VIDEO} autoPlay muted loop playsInline />
      ) : (
        <FotoCinematica />
      )}

      {/* leitura do texto: clareia a esquerda e funde a base com a próxima seção */}
      <div className="pointer-events-none absolute inset-0 hidden sm:block bg-gradient-to-r from-[#f0f0ee]/80 via-transparent to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[14vh] bg-gradient-to-t from-[#f0f0ee] via-[#f0f0ee]/30 to-transparent" />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* espaço da navbar fixa */}
        <div className="h-14 sm:h-17 shrink-0" />

        <div className="flex-1 flex items-start pt-[50vh] sm:items-end sm:pt-0 pb-10 sm:pb-16 lg:pb-20 px-6 sm:px-12 md:px-20 lg:px-28">
          <div className="max-w-xl">
            <a
              href="#areas"
              className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-blue-500 hover:text-blue-600 transition-colors mb-4 group"
            >
              Família · Trabalho · Previdência
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">→</span>
            </a>

            <h1 className="max-w-[34rem] text-[2rem] sm:text-[2.6rem] lg:text-[2.6rem] 2xl:text-[2.9rem] leading-[1.08] font-medium text-gray-900 tracking-tight mb-5">
              Advocacia clara e humana para quem precisa seguir em frente.
            </h1>

            <p className="max-w-[25rem] text-[15px] sm:text-[16px] leading-relaxed text-gray-600 mb-7">
              Separações, demissões e aposentadorias negadas, explicadas em português claro. Honorários combinados por
              escrito e um advogado responsável do começo ao fim.
            </p>

            <div className="flex flex-wrap items-center gap-3 mb-7">
              <a
                href={ESCRITORIO.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[14px] font-medium text-white bg-blue-500 rounded-full px-6 py-3 hover:bg-blue-600 transition-all duration-200 group"
              >
                Agende uma conversa
                <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
              </a>
              <a
                href="#escritorio"
                className="inline-flex items-center gap-2 text-[14px] font-medium text-blue-500 border border-blue-400 rounded-full px-6 py-3 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-200 group"
              >
                Como funciona
                <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
              </a>
            </div>

            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-gray-600">
              {['Atendimento online e presencial', 'Resposta em até 24h', 'Sigilo absoluto'].map((item) => (
                <li key={item} className="inline-flex items-center gap-1.5">
                  <Check size={15} strokeWidth={2} className="text-blue-500" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
