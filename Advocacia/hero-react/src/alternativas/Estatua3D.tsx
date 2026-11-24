/* ALTERNATIVA (não usada): estátua modelada em three.js. Ver HeroEstatuaSVG.tsx. */
import { useEffect, useRef, useState, type ReactNode } from 'react'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

/**
 * Modelo 3D opcional (.glb) — por exemplo, um comprado no CGTrader/TurboSquid.
 * Coloque o arquivo em /public/modelos/ e informe o caminho aqui ('/modelos/justica.glb').
 * Vazio = usa a estátua modelada por código abaixo (com a balança animada).
 */
const MODELO_GLB = ''

/* ------------------------------------------------------------------ */
/*  Geometria                                                           */
/* ------------------------------------------------------------------ */

const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z)

/** Tubo que afina do raio r0 ao r1 (braços, fitas). */
function tuboAfinado(pontos: THREE.Vector3[], r0: number, r1: number, seg = 48, radial = 28) {
  const curva = new THREE.CatmullRomCurve3(pontos)
  const geo = new THREE.TubeGeometry(curva, seg, 1, radial, false)
  const pos = geo.attributes.position
  const v = new THREE.Vector3()
  for (let i = 0; i <= seg; i++) {
    const t = i / seg
    const centro = curva.getPointAt(t)
    const r = r0 + (r1 - r0) * t
    for (let j = 0; j <= radial; j++) {
      const k = i * (radial + 1) + j
      v.fromBufferAttribute(pos, k).sub(centro).multiplyScalar(r).add(centro)
      pos.setXYZ(k, v.x, v.y, v.z)
    }
  }
  geo.computeVertexNormals()
  return geo
}

/** Corpo: túnica torneada, com pregas na saia, ombros largos e pouca profundidade. */
function geometriaCorpo() {
  const perfil = [
    [0.0, 0.0], [0.96, 0.0], [0.92, 0.35], [0.82, 1.1], [0.66, 1.85], [0.52, 2.28], [0.43, 2.46],
    [0.49, 2.72], [0.56, 2.98], [0.55, 3.14], [0.48, 3.3], [0.3, 3.42], [0.14, 3.5], [0.12, 3.6], [0.0, 3.62],
  ].map(([r, y]) => new THREE.Vector2(r, y))
  const geo = new THREE.LatheGeometry(perfil, 160, Math.PI) // costura nas costas
  const pos = geo.attributes.position
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const y = pos.getY(i)
    const z = pos.getZ(i)
    const ang = Math.atan2(z, x)
    let r = Math.hypot(x, z)
    if (y < 2.44) {
      const amp = 0.075 * Math.pow(1 - y / 2.44, 0.75)
      r *= 1 + amp * Math.sin(ang * 13 + y * 0.9) + amp * 0.4 * Math.sin(ang * 29)
    }
    const ombro = 1 + 0.2 * Math.exp(-(((y - 3.18) / 0.3) ** 2))
    pos.setXYZ(i, Math.cos(ang) * r * ombro, y, Math.sin(ang) * r * 0.74)
  }
  geo.computeVertexNormals()
  return geo
}

function cilindroEntre(a: THREE.Vector3, b: THREE.Vector3, raio: number, mat: THREE.Material) {
  const dir = b.clone().sub(a)
  const m = new THREE.Mesh(new THREE.CylinderGeometry(raio, raio, dir.length(), 8), mat)
  m.position.copy(a).add(b).multiplyScalar(0.5)
  m.quaternion.setFromUnitVectors(V(0, 1, 0), dir.normalize())
  return m
}

type Estatua = {
  grupo: THREE.Group
  travessao: THREE.Group | null
  pratos: THREE.Group[]
}

function montarEstatua(): Estatua {
  const pedra = new THREE.MeshStandardMaterial({ color: 0x1d1d1d, roughness: 0.52, metalness: 0.05 })
  const pedraFosca = new THREE.MeshStandardMaterial({ color: 0x151515, roughness: 0.7, metalness: 0 })
  const tecido = new THREE.MeshStandardMaterial({ color: 0x3b3b3b, roughness: 0.75, metalness: 0 })
  const metal = new THREE.MeshStandardMaterial({ color: 0xcfcfcf, roughness: 0.26, metalness: 1 })

  const g = new THREE.Group()
  const add = (geo: THREE.BufferGeometry, mat: THREE.Material, p?: THREE.Vector3, esc?: THREE.Vector3, rot?: THREE.Euler) => {
    const m = new THREE.Mesh(geo, mat)
    if (p) m.position.copy(p)
    if (esc) m.scale.copy(esc)
    if (rot) m.rotation.copy(rot)
    g.add(m)
    return m
  }

  // corpo, manto diagonal e cinto
  add(geometriaCorpo(), pedra)
  add(new THREE.TorusGeometry(0.44, 0.03, 12, 96), pedraFosca, V(0, 2.46, 0), V(1, 1, 0.74), new THREE.Euler(Math.PI / 2, 0, 0))

  // pescoço, cabeça, cabelo, coque
  add(new THREE.CylinderGeometry(0.1, 0.13, 0.26, 24), pedra, V(0, 3.62, 0))
  add(new THREE.SphereGeometry(0.27, 48, 36), pedra, V(0, 3.9, 0.02), V(0.86, 1.06, 0.95))
  add(new THREE.SphereGeometry(0.28, 48, 24, 0, Math.PI * 2, 0, Math.PI * 0.5), pedraFosca, V(0, 3.94, -0.02), V(0.88, 1.05, 0.97), new THREE.Euler(-0.5, 0, 0))
  add(new THREE.SphereGeometry(0.12, 32, 24), pedraFosca, V(0, 4.02, -0.26))

  // venda + pontas do laço
  add(new THREE.TorusGeometry(0.255, 0.032, 16, 96), tecido, V(0, 3.94, 0.02), V(0.88, 0.97, 1), new THREE.Euler(Math.PI / 2 + 0.08, 0, 0))
  add(tuboAfinado([V(0.02, 3.95, -0.25), V(0.1, 3.8, -0.34), V(0.16, 3.56, -0.37)], 0.028, 0.012, 24, 10), tecido)
  add(tuboAfinado([V(-0.02, 3.95, -0.25), V(-0.06, 3.78, -0.32), V(-0.04, 3.5, -0.33)], 0.026, 0.01, 24, 10), tecido)

  // braço erguido (segura a balança)
  add(tuboAfinado([V(-0.5, 3.24, 0.02), V(-0.82, 3.42, 0.14), V(-1.07, 3.68, 0.26), V(-1.18, 4.0, 0.32), V(-1.21, 4.26, 0.34)], 0.105, 0.058), pedra)
  add(new THREE.SphereGeometry(0.088, 24, 18), pedra, V(-1.21, 4.31, 0.34), V(0.95, 1.2, 0.95))

  // manga: tecido pendendo sob o braço erguido
  add(tuboAfinado([V(-0.56, 3.3, 0.04), V(-0.74, 3.12, 0.1), V(-0.8, 2.86, 0.1), V(-0.74, 2.6, 0.06)], 0.15, 0.04), pedraFosca)
  add(new THREE.SphereGeometry(0.04, 16, 12), pedra, V(0, 3.86, 0.245), V(0.55, 1.1, 0.9))

  // braço da espada
  add(tuboAfinado([V(0.5, 3.22, 0.02), V(0.68, 2.95, 0.06), V(0.77, 2.6, 0.13), V(0.8, 2.28, 0.22), V(0.8, 2.06, 0.3)], 0.1, 0.058), pedra)
  add(new THREE.SphereGeometry(0.085, 24, 18), pedra, V(0.8, 1.99, 0.3), V(1, 1.2, 1))

  // espada, ponta para baixo
  add(new THREE.CylinderGeometry(0.026, 0.026, 0.28, 12), pedraFosca, V(0.8, 2.0, 0.3))
  add(new THREE.SphereGeometry(0.042, 16, 12), metal, V(0.8, 2.17, 0.3))
  add(new THREE.BoxGeometry(0.36, 0.04, 0.06), metal, V(0.8, 1.86, 0.3))
  const lamina = new THREE.Shape()
  lamina.moveTo(-0.036, 0)
  lamina.lineTo(0.036, 0)
  lamina.lineTo(0.03, -1.42)
  lamina.lineTo(0, -1.58)
  lamina.lineTo(-0.03, -1.42)
  lamina.closePath()
  const geoLamina = new THREE.ExtrudeGeometry(lamina, { depth: 0.012, bevelEnabled: true, bevelThickness: 0.006, bevelSize: 0.006, bevelSegments: 2 })
  add(geoLamina, metal, V(0.8, 1.85, 0.294))

  // balança: alça presa à mão, travessão que gira, pratos pendurados
  const pivo = V(-1.21, 4.5, 0.34)
  g.add(cilindroEntre(V(-1.21, 4.38, 0.34), pivo, 0.016, metal))
  const travessao = new THREE.Group()
  travessao.position.copy(pivo)
  g.add(travessao)
  const braco = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.36, 16), metal)
  braco.rotation.z = Math.PI / 2
  travessao.add(braco)
  const fiel = new THREE.Mesh(new THREE.OctahedronGeometry(0.06), metal)
  fiel.scale.set(0.6, 1.6, 0.6)
  fiel.position.y = 0.06
  travessao.add(fiel)

  const geoPrato = new THREE.LatheGeometry(
    [[0, -0.7], [0.1, -0.695], [0.19, -0.67], [0.245, -0.628], [0.25, -0.62]].map(([r, y]) => new THREE.Vector2(r, y)),
    48,
  )
  const metalDuplo = metal.clone()
  metalDuplo.side = THREE.DoubleSide
  const pratos: THREE.Group[] = []
  for (const lado of [-0.68, 0.68]) {
    const ponta = new THREE.Mesh(new THREE.SphereGeometry(0.034, 12, 10), metal)
    ponta.position.x = lado
    travessao.add(ponta)
    const prato = new THREE.Group()
    prato.position.x = lado
    travessao.add(prato)
    for (let k = 0; k < 3; k++) {
      const a = (k / 3) * Math.PI * 2 + 0.5
      prato.add(cilindroEntre(V(0, 0, 0), V(Math.cos(a) * 0.235, -0.62, Math.sin(a) * 0.235), 0.005, metal))
    }
    prato.add(new THREE.Mesh(geoPrato, metalDuplo))
    pratos.push(prato)
  }

  return { grupo: g, travessao, pratos }
}

async function carregarGLB(caminho: string): Promise<Estatua> {
  const gltf = await new GLTFLoader().loadAsync(caminho)
  const modelo = gltf.scene
  const caixa = new THREE.Box3().setFromObject(modelo)
  const tamanho = caixa.getSize(new THREE.Vector3())
  const escala = 4.8 / tamanho.y
  modelo.scale.setScalar(escala)
  caixa.setFromObject(modelo)
  modelo.position.sub(new THREE.Vector3((caixa.min.x + caixa.max.x) / 2, caixa.min.y, (caixa.min.z + caixa.max.z) / 2))
  const grupo = new THREE.Group()
  grupo.add(modelo)
  return { grupo, travessao: null, pratos: [] }
}

/* ------------------------------------------------------------------ */
/*  Componente                                                          */
/* ------------------------------------------------------------------ */

function temWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

export default function Estatua3D({ reserva }: { reserva: ReactNode }) {
  const caixaRef = useRef<HTMLDivElement>(null)
  const [semWebGL] = useState(() => !temWebGL())

  useEffect(() => {
    const caixa = caixaRef.current
    if (!caixa || semWebGL) return
    const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    renderer.outputColorSpace = THREE.SRGBColorSpace
    caixa.appendChild(renderer.domElement)
    renderer.domElement.style.display = 'block'

    const cena = new THREE.Scene()
    const pmrem = new THREE.PMREMGenerator(renderer)
    const ambiente = new RoomEnvironment()
    cena.environment = pmrem.fromScene(ambiente, 0.04).texture
    cena.environmentIntensity = 0.55

    // luz de estúdio: principal, contraluz (recorta a silhueta) e preenchimento
    const principal = new THREE.DirectionalLight(0xffffff, 2.4)
    principal.position.set(-4, 6, 6)
    const contraluz = new THREE.DirectionalLight(0xffffff, 3.6)
    contraluz.position.set(5, 4, -6)
    const contraluz2 = new THREE.DirectionalLight(0xffffff, 2)
    contraluz2.position.set(-6, 3, -4)
    cena.add(principal, contraluz, contraluz2, new THREE.HemisphereLight(0xffffff, 0x777777, 0.5))

    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100)
    const alvo = new THREE.Vector3()

    const enquadrar = () => {
      const w = caixa.clientWidth
      const h = caixa.clientHeight
      if (!w || !h) return
      renderer.setSize(w, h, false)
      renderer.domElement.style.width = '100%'
      renderer.domElement.style.height = '100%'
      const aspecto = w / h
      camera.aspect = aspecto
      const k = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))
      const altura = 6.5
      const largura = 3.8
      const dist = Math.max(altura / k, largura / (k * aspecto))
      const larguraVisivel = dist * k * aspecto
      const desvio = aspecto > 1 ? 0.09 * larguraVisivel : 0 // no desktop a estátua fica à direita do centro
      alvo.set(-0.4 - desvio, 2.75, 0)
      camera.position.set(alvo.x, 3.0, dist)
      camera.lookAt(alvo)
      camera.updateProjectionMatrix()
    }

    let estatua: Estatua | null = null
    let descartado = false
    const prontos = MODELO_GLB ? carregarGLB(MODELO_GLB).catch(() => montarEstatua()) : Promise.resolve(montarEstatua())
    prontos.then((e) => {
      if (descartado) return
      estatua = e
      cena.add(e.grupo)
      enquadrar()
      desenhar(0)
    })

    // física da balança (mola sub-amortecida + pêndulos) e giro com o mouse
    let angulo = THREE.MathUtils.degToRad(-17)
    let vel = 0
    let balanco = 0
    let balancoVel = 0
    let mouse = 0
    let mouseAlvo = 0
    let mouseY = 0
    let mouseYAlvo = 0
    const inicio = performance.now()
    let ultimo = inicio

    const desenhar = (agora: number) => {
      if (!estatua) return
      const dt = Math.min((agora - ultimo) / 1000, 1 / 30)
      ultimo = agora
      const t = (agora - inicio) / 1000

      if (!reduzido) {
        mouse += (mouseAlvo - mouse) * Math.min(dt * 2.5, 1)
        mouseY += (mouseYAlvo - mouseY) * Math.min(dt * 2.5, 1)
        estatua.grupo.rotation.y = mouse * 0.55 + Math.sin(t * 0.35) * 0.12
        estatua.grupo.rotation.x = mouseY * 0.05

        if (estatua.travessao && t > 1.1) {
          const alvoAng = THREE.MathUtils.degToRad(mouse * 7 + Math.sin(t * 0.6) * 0.7)
          const acc = -16 * (angulo - alvoAng) - 1.9 * vel
          vel += acc * dt
          angulo += vel * dt
          const accB = -26 * balanco - 1.6 * balancoVel - acc * 0.55
          balancoVel += accB * dt
          balanco += balancoVel * dt
        }
      } else {
        angulo = 0
        balanco = 0
      }
      if (estatua.travessao) {
        estatua.travessao.rotation.z = angulo
        estatua.pratos.forEach((p) => (p.rotation.z = -angulo + balanco))
      }
      renderer.render(cena, camera)
    }

    // só anima quando o hero está na tela e a aba está visível
    let raf = 0
    let visivel = true
    const laco = (agora: number) => {
      desenhar(agora)
      raf = requestAnimationFrame(laco)
    }
    const ligar = () => {
      if (reduzido || raf || !visivel || document.hidden) return
      ultimo = performance.now()
      raf = requestAnimationFrame(laco)
    }
    const desligar = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }
    const io = new IntersectionObserver(([e]) => {
      visivel = e.isIntersecting
      if (visivel) ligar()
      else desligar()
    })
    io.observe(caixa)
    const aoMudarAba = () => (document.hidden ? desligar() : ligar())
    document.addEventListener('visibilitychange', aoMudarAba)

    const ro = new ResizeObserver(() => {
      enquadrar()
      if (reduzido) desenhar(performance.now())
    })
    ro.observe(caixa)
    enquadrar()

    const aoMover = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      mouseAlvo = (e.clientX / window.innerWidth) * 2 - 1
      mouseYAlvo = (e.clientY / window.innerHeight) * 2 - 1
    }
    const aoTocar = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') vel += (e.clientX < window.innerWidth / 2 ? -1 : 1) * 0.95
    }
    window.addEventListener('pointermove', aoMover, { passive: true })
    window.addEventListener('pointerdown', aoTocar, { passive: true })
    ligar()

    return () => {
      descartado = true
      desligar()
      io.disconnect()
      ro.disconnect()
      document.removeEventListener('visibilitychange', aoMudarAba)
      window.removeEventListener('pointermove', aoMover)
      window.removeEventListener('pointerdown', aoTocar)
      cena.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose()
          ;(Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose())
        }
      })
      cena.environment?.dispose()
      pmrem.dispose()
      ambiente.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [semWebGL])

  if (semWebGL) return <>{reserva}</>
  return <div ref={caixaRef} className="h-full w-full" role="img" aria-label="Estátua da Justiça em 3D, de olhos vendados, com balança e espada" />
}
