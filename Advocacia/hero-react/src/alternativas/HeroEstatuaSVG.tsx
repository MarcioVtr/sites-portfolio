/* ALTERNATIVA (não usada): hero com a estátua desenhada em SVG e a versão 3D (Estatua3D.tsx).
   Para voltar a usá-la, importe este arquivo no App.tsx no lugar de sections/Hero. */
import { lazy, Suspense, useEffect, useRef, type Ref } from 'react'

// three.js só é baixado depois que o resto da página aparece
const Estatua3D = lazy(() => import('./Estatua3D'))

/**
 * Vídeo de fundo opcional. O vídeo do prompt original
 * (https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_215831_c6a8989c-d716-4d8d-8745-e972a2eec711.mp4)
 * mostra uma prótese de mão — fora do nicho. A estátua animada ocupa esse papel.
 * Para usar um vídeo jurídico próprio, coloque a URL aqui.
 */
const BACKGROUND_VIDEO = ''

/* ------------------------------------------------------------------ */
/*  Estátua da Justiça                                                 */
/* ------------------------------------------------------------------ */

const PIVOT = { x: 112, y: 74 } // onde a mão segura a balança
const PAN_LEFT = 47
const PAN_RIGHT = 177

function Pan({ x, panRef }: { x: number; panRef: Ref<SVGGElement> }) {
  return (
    <g ref={panRef}>
      <path
        d={`M${x} 74 L${x - 21} 137 M${x} 74 L${x} 139 M${x} 74 L${x + 21} 137`}
        stroke="#3c3c3c"
        strokeWidth="1"
      />
      <path d={`M${x - 25} 137 Q${x} 163 ${x + 25} 137 Z`} fill="url(#metal)" />
      <path d={`M${x - 25} 137 L${x + 25} 137`} stroke="#d9d9d9" strokeWidth="1.2" strokeLinecap="round" />
    </g>
  )
}

function JusticeStatue() {
  const beamRef = useRef<SVGGElement>(null)
  const leftPanRef = useRef<SVGGElement>(null)
  const rightPanRef = useRef<SVGGElement>(null)

  useEffect(() => {
    const beam = beamRef.current
    const left = leftPanRef.current
    const right = rightPanRef.current
    if (!beam || !left || !right) return

    const apply = (angle: number, swing: number) => {
      beam.setAttribute('transform', `rotate(${angle.toFixed(3)} ${PIVOT.x} ${PIVOT.y})`)
      // os pratos ficam pendurados na vertical (contra-rotação) + balanço de pêndulo
      const pan = (-angle + swing).toFixed(3)
      left.setAttribute('transform', `rotate(${pan} ${PAN_LEFT} ${PIVOT.y})`)
      right.setAttribute('transform', `rotate(${pan} ${PAN_RIGHT} ${PIVOT.y})`)
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      apply(0, 0)
      return
    }

    // Física: o travessão é uma mola sub-amortecida; os pratos, pêndulos.
    let angle = -17
    let vel = 0
    let swing = 0
    let swingVel = 0
    let pointer = 0 // -1 (esquerda) a 1 (direita), suavizado
    let pointerTarget = 0
    let last = performance.now()
    let started = false
    let raf = 0
    apply(angle, 0)

    const startTimer = window.setTimeout(() => {
      started = true
      last = performance.now()
    }, 1100) // começa a oscilar quando a estátua termina de subir da névoa

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') pointerTarget = (e.clientX / window.innerWidth) * 2 - 1
    }
    const onTap = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') vel += (e.clientX < window.innerWidth / 2 ? -1 : 1) * 55
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onTap, { passive: true })

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30)
      last = now
      if (started) {
        pointer += (pointerTarget - pointer) * Math.min(dt * 3, 1)
        const target = pointer * 7 + Math.sin(now / 1700) * 0.7
        const acc = -16 * (angle - target) - 1.9 * vel
        vel += acc * dt
        angle += vel * dt
        const swingAcc = -26 * swing - 1.6 * swingVel - acc * 0.55
        swingVel += swingAcc * dt
        swing += swingVel * dt
        apply(angle, swing)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(startTimer)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onTap)
    }
  }, [])

  return (
    <svg
      viewBox="0 0 400 640"
      className="statue-rise h-[66vh] sm:h-[94vh] max-h-[980px] w-auto"
      role="img"
      aria-label="Estátua da Justiça de olhos vendados, segurando uma balança e uma espada"
    >
      <defs>
        <linearGradient id="stone" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#4d4d4d" />
          <stop offset="0.42" stopColor="#272727" />
          <stop offset="1" stopColor="#0e0e0e" />
        </linearGradient>
        <linearGradient id="stoneDeep" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#2e2e2e" />
          <stop offset="1" stopColor="#0b0b0b" />
        </linearGradient>
        <linearGradient id="metal" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#d4d4d4" />
          <stop offset="0.5" stopColor="#9a9a9a" />
          <stop offset="1" stopColor="#5e5e5e" />
        </linearGradient>
        <linearGradient id="blade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#e2e2e2" />
          <stop offset="1" stopColor="#7d7d7d" />
        </linearGradient>
        <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.62" stopColor="#fff" />
          <stop offset="0.93" stopColor="#000" />
        </linearGradient>
        <mask id="mist">
          <rect width="400" height="640" fill="url(#fade)" />
        </mask>
      </defs>

      <g mask="url(#mist)">
        {/* cabelo: coque e mechas caindo nas costas */}
        <circle cx="240" cy="101" r="10.5" fill="url(#stoneDeep)" />
        <path d="M201 122 C199 100 214 90 228 92 C242 94 249 108 246 126 C245 140 249 152 254 163 C245 159 240 148 239 137 C237 119 232 108 222 106 C212 106 205 114 201 122 Z" fill="url(#stoneDeep)" />

        {/* manga que pende do braço erguido */}
        <path d="M172 190 C159 181 149 168 142 154 C137 182 145 212 160 236 C167 222 170 206 172 190 Z" fill="url(#stoneDeep)" />
        <path d="M150 170 C148 192 152 212 159 230" stroke="#fff" strokeOpacity="0.1" strokeWidth="1.2" fill="none" />

        {/* túnica: ombros caídos, cintura marcada, saia que se abre */}
        <path
          d="M168 192 C182 178 202 172 222 172 C244 172 262 178 276 192 C282 214 280 240 272 264 C278 330 288 420 300 520 C306 570 312 600 316 640 L128 640 C134 600 140 560 146 520 C156 420 166 330 172 264 C164 240 162 214 168 192 Z"
          fill="url(#stone)"
        />
        {/* dobras da saia: luz e sombra alternadas */}
        <g fill="none" strokeLinecap="round">
          <g stroke="#fff" strokeOpacity="0.09" strokeWidth="1.6">
            <path d="M184 300 C176 400 160 520 146 640" />
            <path d="M206 282 C202 380 194 500 186 640" />
            <path d="M228 282 C230 380 236 500 244 640" />
            <path d="M252 284 C260 380 272 500 288 640" />
          </g>
          <g stroke="#000" strokeOpacity="0.35" strokeWidth="2.4">
            <path d="M190 298 C184 400 170 520 158 640" />
            <path d="M213 284 C211 380 206 500 202 640" />
            <path d="M236 284 C240 380 248 500 260 640" />
          </g>
        </g>
        {/* manto em diagonal sobre o peito */}
        <path d="M170 198 C196 238 238 276 282 296 C287 326 286 356 280 384 C238 352 198 304 172 252 Z" fill="url(#stoneDeep)" />
        <path d="M170 198 C196 238 238 276 282 296" stroke="#fff" strokeOpacity="0.2" strokeWidth="1.3" fill="none" />
        <path d="M188 252 C214 290 246 322 280 344" stroke="#000" strokeOpacity="0.4" strokeWidth="2" fill="none" />
        {/* luz de borda à esquerda */}
        <path d="M168 194 C163 216 165 242 172 264 C166 330 156 420 146 520 C140 560 134 600 128 640" stroke="#fff" strokeOpacity="0.25" strokeWidth="1.4" fill="none" />

        {/* pescoço */}
        <path d="M214 148 C215 158 214 165 210 173 L236 173 C232 165 231 157 232 146 Z" fill="url(#stone)" />

        {/* braço da espada */}
        <path d="M268 190 C282 205 292 230 294 256 C296 282 296 300 296 314 L282 314 C282 298 281 280 280 262 C278 240 272 220 262 204 Z" fill="url(#stone)" />
        <path d="M268 192 C282 206 292 230 294 256" stroke="#fff" strokeOpacity="0.12" strokeWidth="1.1" fill="none" />

        {/* espada, ponta para baixo */}
        <path d="M284.5 338 L293.5 338 L291.5 560 L289 580 L286.5 560 Z" fill="url(#blade)" />
        <path d="M289 340 L289 570" stroke="#fff" strokeOpacity="0.5" strokeWidth="0.8" />
        <rect x="270" y="331" width="38" height="5" rx="2.5" fill="url(#metal)" />
        <rect x="285.5" y="306" width="7" height="27" rx="3" fill="#3a3a3a" />
        <circle cx="289" cy="303" r="4.4" fill="url(#metal)" />
        <ellipse cx="289" cy="320" rx="9" ry="10" fill="url(#stone)" />

        {/* rosto, levemente virado */}
        <path d="M203 124 C203 104 214 97 224 97 C236 97 242 107 242 122 C242 139 236 152 224 156 C212 154 204 142 203 124 Z" fill="url(#stone)" />
        <path d="M206 112 C208 104 216 99 224 99" stroke="#fff" strokeOpacity="0.18" strokeWidth="1.2" fill="none" />
        {/* venda e as pontas do laço */}
        <path d="M202.5 121 Q222 114 243 119 L243.5 130 Q222 125 203.5 132 Z" fill="#767676" />
        <path d="M242 123 C256 128 263 142 272 156" stroke="#767676" strokeWidth="3.4" strokeLinecap="round" fill="none" />
        <path d="M242 127 C252 136 251 152 258 166" stroke="#626262" strokeWidth="3" strokeLinecap="round" fill="none" />
      </g>

      {/* braço erguido, afinando do ombro ao punho */}
      <path
        d="M162 186 C150 174 141 161 135 147 C128 129 118 114 106 101 L119 94 C128 108 139 124 147 139 C155 153 166 168 180 180 Z"
        fill="url(#stone)"
      />
      <path d="M162 186 C150 174 141 161 135 147 C128 129 118 114 106 101" stroke="#fff" strokeOpacity="0.2" strokeWidth="1.2" fill="none" />

      {/* balança */}
      <path d="M112 86 L112 74" stroke="#4a4a4a" strokeWidth="3" strokeLinecap="round" />
      <g ref={beamRef}>
        <rect x={PAN_LEFT - 2} y="72" width={PAN_RIGHT - PAN_LEFT + 4} height="4" rx="2" fill="url(#metal)" />
        <circle cx={PAN_LEFT} cy="74" r="3.2" fill="#8a8a8a" />
        <circle cx={PAN_RIGHT} cy="74" r="3.2" fill="#8a8a8a" />
        <path d="M112 60 L117 74 L112 80 L107 74 Z" fill="url(#metal)" />
        <Pan x={PAN_LEFT} panRef={leftPanRef} />
        <Pan x={PAN_RIGHT} panRef={rightPanRef} />
      </g>
      {/* mão fechada segurando a balança */}
      <ellipse cx="112" cy="92" rx="9" ry="10.5" fill="url(#stone)" />
    </svg>
  )
}

/* ------------------------------------------------------------------ */

export default function Hero() {
  return (
    <section id="inicio" className="relative min-h-screen overflow-hidden bg-[#f0f0ee]">
      <style>{`
        @keyframes statue-rise {
          from { opacity: 0; transform: translateY(70px); filter: blur(8px); }
          to   { opacity: 1; transform: none; filter: blur(0); }
        }
        @keyframes mist-drift {
          0%, 100% { transform: translateX(-4%) scale(1); }
          50%      { transform: translateX(4%) scale(1.08); }
        }
        .statue-rise { animation: statue-rise 1.8s cubic-bezier(.2,.7,.2,1) both; }
        .mist { animation: mist-drift 14s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .statue-rise, .mist { animation: none; }
        }
      `}</style>

      {BACKGROUND_VIDEO && (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={BACKGROUND_VIDEO}
          autoPlay
          muted
          loop
          playsInline
        />
      )}

      {/* Estátua 3D emergindo da névoa (ocupa o papel do vídeo). Sem WebGL, cai no desenho SVG. */}
      <div className="pointer-events-none absolute inset-0">
        <div className="statue-rise absolute inset-x-0 top-[7vh] h-[64vh] sm:top-0 sm:h-full [mask-image:linear-gradient(to_bottom,black_58%,transparent_93%)]">
          <Suspense fallback={null}>
          <Estatua3D
            reserva={
              <div className="flex h-full items-start justify-center sm:items-end">
                <div className="translate-x-[6%] sm:translate-x-[10%]">
                  <JusticeStatue />
                </div>
              </div>
            }
          />
          </Suspense>
        </div>
        <div className="mist absolute bottom-[-8vh] left-1/2 -ml-[45vw] h-[34vh] w-[90vw] rounded-[50%] bg-[#f0f0ee] blur-3xl opacity-90" />
        <div className="absolute inset-x-0 bottom-0 h-[14vh] bg-gradient-to-t from-[#f0f0ee] to-transparent" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* espaço da navbar fixa */}
        <div className="h-14 sm:h-17 shrink-0" />

        <div className="flex-1 flex items-end pb-10 sm:pb-16 lg:pb-20 px-6 sm:px-12 md:px-20 lg:px-28">
          <div className="max-w-xs">
            <a
              href="#areas"
              className="inline-flex items-center gap-1.5 text-[11.5px] font-medium text-blue-500 hover:text-blue-600 transition-colors mb-3 group"
            >
              Família · Trabalho · Previdência
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">→</span>
            </a>

            <h1 className="text-[1.5rem] sm:text-[1.75rem] leading-[1.15] font-medium text-gray-900 tracking-tight mb-3">
              Advocacia clara e humana para quem precisa seguir em frente.
            </h1>

            <p className="text-[13px] text-gray-400 font-normal mb-3">Seu direito, explicado em português.</p>

            <a
              href="https://wa.me/5511900000000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[13px] font-medium text-blue-500 border border-blue-400 rounded-full px-5 py-2.5 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-200 group mb-3"
            >
              Agende uma conversa
              <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
