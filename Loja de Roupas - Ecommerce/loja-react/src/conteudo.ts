/**
 * Todo o conteúdo da loja num lugar só.
 * Para adaptar a um cliente, edite este arquivo — os componentes leem daqui.
 *
 * ATENÇÃO (demo): marca, CNPJ, produtos, preços e avaliações são FICTÍCIOS.
 * Fotos: Unsplash (licença Unsplash) — créditos em README.md.
 */

export const LOJA = {
  nome: 'Âmbar',
  tagline: 'Roupas em fibras naturais, feitas para durar mais que uma estação.',
  freteGratisAcima: 399,
  parcelasSemJuros: 6,
  descontoPix: 0.05,
  whatsapp: 'https://wa.me/5511900000000',
  email: 'atendimento@ambar.exemplo',
  razaoSocial: 'Âmbar Moda Ltda · CNPJ 00.000.000/0001-00',
  endereco: 'Rua Exemplo, 200 · Vila Madalena · São Paulo/SP',
}

export const AVISO_TOPO = [
  'Frete grátis acima de R$ 399',
  'Troca grátis em até 30 dias',
  '6x sem juros · 5% off no Pix',
]

/* ───────────────────────── Prova de cor ─────────────────────────
 * O movimento-assinatura: a pessoa escolhe um tecido e o acento da página
 * inteira passa a ser aquela cor. Cada tom tem três valores:
 * base (botões, selos), escura (hover, preço em promoção) e suave (fundos).
 */

export type Tom = 'terracota' | 'oliva' | 'egeu' | 'ocre'

export const TONS: Record<Tom, { nome: string; base: string; escura: string; suave: string; textura: string }> = {
  terracota: { nome: 'Terracota', base: '#B5532F', escura: '#96401F', suave: '#F0DCCF', textura: 'Linho tingido com argila' },
  oliva: { nome: 'Oliva', base: '#5E6B3A', escura: '#48532B', suave: '#E2E4D0', textura: 'Linho lavado, toque seco' },
  egeu: { nome: 'Egeu', base: '#2F5D7C', escura: '#234863', suave: '#D8E3EB', textura: 'Algodão e linho, azul de mar' },
  ocre: { nome: 'Ocre', base: '#976620', escura: '#7A5118', suave: '#F1E4CC', textura: 'Tricô de algodão, cor de sol' },
}
export const ORDEM_TONS: Tom[] = ['terracota', 'oliva', 'egeu', 'ocre']

export const PROVA = {
  selo: 'Prova de cor',
  titulo: 'Escolha um tecido. A loja veste a cor.',
  texto: 'Toque numa amostra. As peças que existem nessa cor aparecem marcadas logo abaixo e já abrem com ela selecionada.',
}

/* ───────────────────────── Catálogo ───────────────────────── */

export type CategoriaId = 'camisas' | 'calcas' | 'vestidos' | 'trico' | 'casacos'
export type Genero = 'feminino' | 'masculino' | 'unissex'
export type Filtro = 'todos' | 'novidades' | 'sale' | 'feminino' | 'masculino' | CategoriaId

export const CATEGORIAS: { id: CategoriaId; nome: string; imagem: string; chamada: string }[] = [
  { id: 'camisas', nome: 'Camisas', imagem: 'categorias/camisas.webp', chamada: 'Linho, seda e algodão pima' },
  { id: 'calcas', nome: 'Calças & Bermudas', imagem: 'categorias/calcas.webp', chamada: 'Cortes retos, cós confortável' },
  { id: 'vestidos', nome: 'Vestidos', imagem: 'categorias/vestidos.webp', chamada: 'Cetim, renda e viscose' },
  { id: 'trico', nome: 'Tricô', imagem: 'categorias/trico.webp', chamada: 'Para as noites que esfriam' },
]

/** Navegação secundária do header. */
export const NAV: { rotulo: string; filtro: Filtro; destaque?: boolean }[] = [
  { rotulo: 'Novidades', filtro: 'novidades' },
  { rotulo: 'Feminino', filtro: 'feminino' },
  { rotulo: 'Masculino', filtro: 'masculino' },
  { rotulo: 'Camisas', filtro: 'camisas' },
  { rotulo: 'Calças & Bermudas', filtro: 'calcas' },
  { rotulo: 'Vestidos', filtro: 'vestidos' },
  { rotulo: 'Tricô', filtro: 'trico' },
  { rotulo: 'Sale', filtro: 'sale', destaque: true },
]

/* ───────────────────────── Cenas da home ───────────────────────── */

export const HERO = {
  selo: 'Coleção Estio · Verão 2027',
  titulo: 'Feito para durar mais que uma estação.',
  texto: 'Linho, seda e tricô em cortes que atravessam os anos. Para quem compra menos e usa mais.',
  cta: 'Ver a coleção',
  ctaSecundario: 'Novidades',
}

export const PROMO = {
  selo: 'Seleção de verão',
  titulo: 'Até 30% off em peças escolhidas',
  texto: 'Enquanto durarem os estoques. Desconto já aplicado no preço.',
  cta: 'Aproveitar',
  /** Demo: a contagem regressiva sempre termina no próximo domingo, 23h59. Num cliente real, troque por uma data fixa. */
  termina: () => {
    const d = new Date()
    d.setDate(d.getDate() + ((7 - d.getDay()) % 7))
    d.setHours(23, 59, 59, 0)
    return d
  },
}

export const EDITORIAL = {
  selo: 'Por que pagar um pouco mais',
  titulo: 'A peça que você vai usar por anos.',
  texto: 'Não fazemos coleção descartável. O que não vende volta para a mesa de corte, não para o lixo. E o que você leva para casa foi feito para virar favorito.',
  cta: 'Ver o tricô da estação',
  produto: 'conjunto-trico-areia',
}

export const BENEFICIOS = [
  { icone: 'frete', titulo: 'Frete grátis', texto: 'Em compras acima de R$ 399 para todo o Brasil.' },
  { icone: 'troca', titulo: 'Troca fácil', texto: 'Primeira troca grátis em até 30 dias, sem burocracia.' },
  { icone: 'seguro', titulo: 'Pagamento seguro', texto: 'Pix, cartão em até 6x sem juros ou boleto.' },
  { icone: 'suporte', titulo: 'Suporte de verdade', texto: 'Gente real no WhatsApp, de segunda a sábado.' },
] as const

export const NEWSLETTER = {
  titulo: 'Ganhe 10% na primeira compra',
  texto: 'Lançamentos, bastidores do ateliê e acesso antecipado ao sale. Um e-mail por semana, no máximo.',
  cupom: 'PRIMEIRA10',
}

/* ───────────────────────── Produtos ───────────────────────── */

export type Cor = { nome: string; hex: string; tom?: Tom }
export type Produto = {
  slug: string
  nome: string
  categoria: CategoriaId
  genero: Genero
  preco: number
  precoDe?: number
  /** Quantas fotos existem em /img/produtos/{slug}-{n}.webp */
  fotos: number
  cores: Cor[]
  tamanhos: string[]
  esgotados?: string[]
  avaliacao: number
  numAvaliacoes: number
  novo?: boolean
  destaque?: boolean
  resumo: string
  descricao: string[]
  composicao: string
  modelagem: string
  comprimento: string
  /**
   * Peça fotografada no cabide (fundo transparente) em /img/cabide/{slug}.webp — entra na arara do sale.
   * altura: tamanho relativo na arara (vestido longo = 1); proporcao: largura/altura da imagem.
   */
  cabide?: { altura: number; proporcao: number }
}

const LETRAS = ['PP', 'P', 'M', 'G', 'GG']
const LETRAS_M = ['P', 'M', 'G', 'GG']
const NUMEROS = ['38', '40', '42', '44', '46']

const C = {
  terracota: { nome: 'Terracota', hex: TONS.terracota.base, tom: 'terracota' as Tom },
  oliva: { nome: 'Oliva', hex: TONS.oliva.base, tom: 'oliva' as Tom },
  egeu: { nome: 'Egeu', hex: TONS.egeu.base, tom: 'egeu' as Tom },
  ocre: { nome: 'Ocre', hex: TONS.ocre.base, tom: 'ocre' as Tom },
  areia: { nome: 'Areia', hex: '#D8C7AE' },
  cru: { nome: 'Cru', hex: '#E9E0CF' },
  offwhite: { nome: 'Off-white', hex: '#F3EFE6' },
  branco: { nome: 'Branco', hex: '#FAFAF7' },
  preto: { nome: 'Preto', hex: '#1E1B18' },
  cafe: { nome: 'Café', hex: '#3B2418' },
}

export const PRODUTOS: Produto[] = [
  {
    slug: 'camisa-mar-linho',
    nome: 'Camisa Mar em Linho',
    categoria: 'camisas',
    genero: 'masculino',
    preco: 299,
    fotos: 3,
    cores: [C.areia, C.oliva, C.egeu],
    tamanhos: LETRAS_M,
    avaliacao: 4.8,
    numAvaliacoes: 142,
    novo: true,
    destaque: true,
    resumo: 'Camisa de linho lavado com bolso no peito, manga para dobrar e caimento solto.',
    descricao: [
      'A camisa do verão inteiro. Linho lavado, que já chega macio, com bolso no peito, colarinho mole e barra reta para usar por fora.',
      'Dobre a manga, abra mais um botão e leve para a praia. Feche tudo e ela vai para o jantar.',
    ],
    composicao: '100% linho',
    modelagem: 'Solta',
    comprimento: '76 cm (tam. M)',
  },
  {
    slug: 'vestido-cetim-cafe',
    nome: 'Vestido Envelope em Cetim',
    categoria: 'vestidos',
    genero: 'feminino',
    preco: 459,
    fotos: 3,
    cores: [C.cafe, C.oliva, C.terracota],
    tamanhos: LETRAS,
    avaliacao: 4.9,
    numAvaliacoes: 84,
    novo: true,
    destaque: true,
    resumo: 'Vestido envelope em cetim fosco, manga longa e franzido lateral.',
    descricao: [
      'Do jantar ao casamento no campo: o vestido envelope em cetim fosco tem decote transpassado, franzido lateral que valoriza a cintura e manga longa com punho de botão.',
      'O cetim tem toque seco e brilho discreto, sem aquele aspecto de festa que limita o uso.',
    ],
    composicao: '97% viscose, 3% elastano',
    modelagem: 'Ajustada na cintura',
    comprimento: '98 cm (tam. M)',
  },
  {
    slug: 'calca-linho-reta',
    nome: 'Calça Reta em Linho Cru',
    categoria: 'calcas',
    genero: 'masculino',
    preco: 389,
    precoDe: 469,
    fotos: 3,
    cores: [C.cru, C.oliva],
    tamanhos: NUMEROS,
    esgotados: ['46'],
    avaliacao: 4.7,
    numAvaliacoes: 96,
    destaque: true,
    resumo: 'Calça de alfaiataria em linho, cintura alta com passante e perna reta.',
    descricao: [
      'Alfaiataria leve para o calor. Cintura alta com pregas discretas, passante largo e perna reta que cai bem com tênis ou mocassim.',
      'O linho com toque de algodão amassa menos e mantém o vinco ao longo do dia.',
    ],
    composicao: '70% linho, 30% algodão',
    modelagem: 'Reta',
    comprimento: '104 cm (tam. 42)',
  },
  {
    slug: 'conjunto-trico-areia',
    nome: 'Conjunto Tricô Areia',
    categoria: 'trico',
    genero: 'feminino',
    preco: 529,
    precoDe: 689,
    fotos: 3,
    cores: [C.areia, C.terracota, C.ocre],
    tamanhos: LETRAS,
    esgotados: ['GG'],
    avaliacao: 4.7,
    numAvaliacoes: 212,
    destaque: true,
    resumo: 'Blusa raglan e calça pantalona em tricô de algodão com ponto arroz.',
    descricao: [
      'Conforto de casa com cara de rua. A blusa tem manga raglan e ponto arroz; a calça é pantalona com cós de elástico embutido e cai reta até o chão.',
      'Use junto para um look monocromático ou separe: a blusa vai bem com jeans e a calça com uma camisa de linho.',
    ],
    composicao: '80% algodão, 20% poliamida',
    modelagem: 'Regular',
    comprimento: 'Blusa 60 cm · Calça 104 cm (tam. M)',
  },
  {
    slug: 'camisa-camp-linho',
    nome: 'Camisa Camp Collar em Linho',
    categoria: 'camisas',
    genero: 'masculino',
    preco: 279,
    precoDe: 339,
    fotos: 2,
    cores: [C.areia, C.egeu, C.terracota],
    tamanhos: LETRAS_M,
    avaliacao: 4.6,
    numAvaliacoes: 71,
    destaque: true,
    resumo: 'Camisa de manga curta com gola camp, caimento reto e botões de coco.',
    descricao: [
      'A gola aberta e a manga curta fazem dela a camisa mais fresca da coleção. Botões de coco natural e barra reta.',
      'Por cima de uma camiseta branca ou sozinha, com a gola bem aberta.',
    ],
    composicao: '100% linho',
    modelagem: 'Reta',
    comprimento: '72 cm (tam. M)',
  },
  {
    slug: 'vestido-longo-oliva',
    nome: 'Vestido Slip Longo',
    categoria: 'vestidos',
    genero: 'feminino',
    preco: 499,
    fotos: 3,
    cores: [C.oliva, C.ocre, C.cafe],
    tamanhos: LETRAS,
    avaliacao: 4.7,
    numAvaliacoes: 66,
    novo: true,
    destaque: true,
    resumo: 'Vestido slip cortado no viés, com alças finas e fenda lateral discreta.',
    descricao: [
      'Cortado no viés para acompanhar o corpo sem marcar. Alças finas, decote reto e uma fenda lateral discreta que facilita o passo.',
      'Funciona sozinho no calor e com tricô por cima quando a noite esfria.',
    ],
    composicao: '100% viscose acetinada',
    modelagem: 'Fluida, cortada no viés',
    comprimento: '128 cm (tam. M)',
  },
  {
    slug: 'trico-gola-alta-ocre',
    nome: 'Tricô Gola Alta Canelado',
    categoria: 'trico',
    genero: 'unissex',
    preco: 349,
    precoDe: 429,
    fotos: 2,
    cores: [C.ocre, C.cru],
    tamanhos: LETRAS,
    avaliacao: 4.8,
    numAvaliacoes: 58,
    destaque: true,
    resumo: 'Tricô canelado de gola alta, ajustado no corpo, em algodão e lã merino.',
    descricao: [
      'Canelado fino que veste rente ao corpo sem apertar. A gola alta dobra ou fica em pé.',
      'Por baixo de camisa aberta ou sozinho com calça de linho: a peça que faz a ponte entre as estações.',
    ],
    composicao: '60% algodão, 40% lã merino',
    modelagem: 'Ajustada',
    comprimento: '66 cm (tam. M)',
  },
  {
    slug: 'camisa-alma-linho',
    nome: 'Camisa Alma em Linho Laise',
    categoria: 'camisas',
    genero: 'feminino',
    preco: 279,
    precoDe: 349,
    fotos: 4,
    cores: [C.offwhite, C.egeu],
    tamanhos: LETRAS,
    esgotados: ['PP'],
    avaliacao: 4.8,
    numAvaliacoes: 126,
    destaque: true,
    resumo: 'Camisa ampla em linho com bordado laise, punhos largos e caimento leve.',
    descricao: [
      'A camisa que resolve o verão inteiro. Cortada em linho puro com bordado laise delicado, ela tem ombro levemente caído, punhos largos e comprimento que funciona por dentro ou por fora da calça.',
      'O linho amacia a cada lavagem e respira no calor, por isso fica cada vez mais confortável com o tempo.',
    ],
    composicao: '100% linho',
    modelagem: 'Ampla',
    comprimento: '72 cm (tam. M)',
  },
  {
    slug: 'bermuda-linho',
    nome: 'Bermuda de Linho com Cordão',
    categoria: 'calcas',
    genero: 'masculino',
    preco: 229,
    fotos: 2,
    cores: [C.offwhite, C.egeu, C.oliva],
    tamanhos: LETRAS_M,
    avaliacao: 4.7,
    numAvaliacoes: 88,
    novo: true,
    resumo: 'Bermuda de linho com cós de elástico e cordão, bolsos faca e barra italiana.',
    descricao: [
      'Do barco para o almoço sem trocar de roupa. Cós de elástico com cordão, bolsos faca e barra italiana que deixa tudo mais arrumado.',
    ],
    composicao: '100% linho',
    modelagem: 'Reta',
    comprimento: '46 cm (tam. M)',
  },
  {
    slug: 'camisa-gola-padre',
    nome: 'Camisa Gola Padre Off-white',
    categoria: 'camisas',
    genero: 'masculino',
    preco: 269,
    fotos: 2,
    cores: [C.offwhite, C.terracota],
    tamanhos: LETRAS_M,
    avaliacao: 4.6,
    numAvaliacoes: 47,
    resumo: 'Camisa de linho com gola padre, abotoamento inteiro e manga longa.',
    descricao: [
      'Sem colarinho, a camisa fica mais leve e mais moderna. Linho de trama fechada, abotoamento inteiro e punho simples.',
    ],
    composicao: '100% linho',
    modelagem: 'Regular',
    comprimento: '74 cm (tam. M)',
  },
  {
    slug: 'regata-linho-branca',
    nome: 'Regata Linho Ombro Largo',
    categoria: 'camisas',
    genero: 'feminino',
    preco: 179,
    fotos: 2,
    cores: [C.branco, C.areia],
    tamanhos: LETRAS,
    avaliacao: 4.6,
    numAvaliacoes: 73,
    resumo: 'Regata em linho com ombro largo e decote em V com amarração.',
    descricao: ['A blusa mais fresca do guarda-roupa: linho leve, ombro largo e decote V com amarração.', 'Fica bem com a calça de alfaiataria e com o short de praia.'],
    composicao: '100% linho',
    modelagem: 'Ampla',
    comprimento: '62 cm (tam. M)',
  },
  {
    slug: 'camiseta-algodao-pima',
    nome: 'Camiseta Algodão Pima',
    categoria: 'camisas',
    genero: 'unissex',
    preco: 129,
    precoDe: 159,
    fotos: 2,
    cabide: { altura: 0.6, proporcao: 0.811 },
    cores: [C.branco, C.preto, C.oliva],
    tamanhos: LETRAS,
    avaliacao: 4.8,
    numAvaliacoes: 301,
    resumo: 'Camiseta de algodão pima peruano, gola careca reforçada.',
    descricao: ['Algodão pima de fibra longa: mais macio, mais resistente e sem bolinhas. Gola careca com ribana reforçada que não laceia.'],
    composicao: '100% algodão pima',
    modelagem: 'Reta',
    comprimento: '68 cm (tam. M)',
  },
  {
    slug: 'trico-caramelo',
    nome: 'Suéter Tricô Inglês',
    categoria: 'trico',
    genero: 'unissex',
    preco: 359,
    precoDe: 449,
    fotos: 2,
    cores: [{ nome: 'Caramelo', hex: '#A8672F', tom: 'ocre' }, C.cru],
    tamanhos: LETRAS,
    avaliacao: 4.7,
    numAvaliacoes: 88,
    novo: true,
    resumo: 'Suéter gola alta em tricô inglês, ombro caído e punho canelado.',
    descricao: ['Ponto inglês encorpado, gola alta dobrável e ombro caído. Aquece sem pesar.'],
    composicao: '60% algodão, 40% lã merino',
    modelagem: 'Ampla',
    comprimento: '64 cm (tam. M)',
  },
  {
    slug: 'vestido-renda-areia',
    nome: 'Vestido Longo Renda Areia',
    categoria: 'vestidos',
    genero: 'feminino',
    preco: 719,
    precoDe: 899,
    fotos: 3,
    cores: [C.areia],
    tamanhos: LETRAS,
    esgotados: ['PP', 'P'],
    avaliacao: 4.9,
    numAvaliacoes: 41,
    resumo: 'Vestido longo trapézio em renda de algodão, com alças finas e forro.',
    descricao: [
      'Renda de algodão trabalhada em pequenos quadrados, em um vestido trapézio que se move com o corpo. Alças finas reguláveis e forro de algodão até o joelho.',
      'Para cerimônias diurnas, viagens e todos os dias que pedem um pouco mais de presença.',
    ],
    composicao: '100% algodão (renda e forro)',
    modelagem: 'Trapézio',
    comprimento: '132 cm (tam. M)',
  },
  {
    slug: 'camisa-seda-ameixa',
    nome: 'Camisa de Seda Ameixa',
    categoria: 'camisas',
    genero: 'feminino',
    preco: 349,
    precoDe: 429,
    fotos: 3,
    cores: [{ nome: 'Ameixa', hex: '#3A2340' }, C.offwhite],
    tamanhos: LETRAS,
    avaliacao: 4.6,
    numAvaliacoes: 98,
    resumo: 'Camisa de seda lavada com gola clássica e botões de madrepérola.',
    descricao: [
      'Seda lavada com toque de pêssego e brilho suave. Gola clássica, abotoamento em madrepérola e barra curva que fica bem por dentro da calça.',
      'Uma peça que eleva o jeans de sábado e segura sozinha a reunião de segunda.',
    ],
    composicao: '100% seda',
    modelagem: 'Regular',
    comprimento: '70 cm (tam. M)',
  },

  /* ── Peças do sale fotografadas no cabide (arara) ── */
  {
    slug: 'camiseta-flame-mescla',
    nome: 'Camiseta Flamê Mescla',
    categoria: 'camisas',
    genero: 'unissex',
    preco: 119,
    precoDe: 149,
    fotos: 2,
    cabide: { altura: 0.6, proporcao: 0.744 },
    cores: [{ nome: 'Azul-mescla', hex: '#9DB4C8', tom: 'egeu' }, { nome: 'Cinza-mescla', hex: '#B9B9B6' }],
    tamanhos: LETRAS,
    avaliacao: 4.6,
    numAvaliacoes: 64,
    resumo: 'Camiseta de malha flamê, com textura irregular e barra da manga dobrada.',
    descricao: ['O fio flamê tem espessuras diferentes ao longo do comprimento e deixa a malha com aquele aspecto mesclado e vivo. Leve, fresca e com caimento reto.'],
    composicao: '100% algodão flamê',
    modelagem: 'Reta',
    comprimento: '68 cm (tam. M)',
  },
  {
    slug: 'manga-longa-algodao',
    nome: 'Camiseta Manga Longa Algodão',
    categoria: 'camisas',
    genero: 'unissex',
    preco: 149,
    precoDe: 189,
    fotos: 2,
    cabide: { altura: 0.8, proporcao: 0.562 },
    cores: [C.preto, C.offwhite],
    tamanhos: LETRAS,
    avaliacao: 4.7,
    numAvaliacoes: 52,
    resumo: 'Manga longa em malha de algodão encorpada, punho canelado e gola careca.',
    descricao: ['A peça de transição do guarda-roupa: sozinha nas noites de verão ou por baixo da camisa aberta quando esfria.'],
    composicao: '100% algodão',
    modelagem: 'Regular',
    comprimento: '70 cm (tam. M)',
  },
  {
    slug: 'camiseta-oversized-preta',
    nome: 'Camiseta Oversized Peso Pesado',
    categoria: 'camisas',
    genero: 'unissex',
    preco: 139,
    precoDe: 179,
    fotos: 2,
    cabide: { altura: 0.74, proporcao: 0.677 },
    cores: [C.preto, C.areia],
    tamanhos: LETRAS,
    avaliacao: 4.8,
    numAvaliacoes: 118,
    resumo: 'Camiseta ampla em malha 240 g, ombro caído e gola alta reforçada.',
    descricao: ['Malha grossa que não fica transparente e não deforma. Ombro caído e comprimento um pouco maior, para o caimento amplo.'],
    composicao: '100% algodão (240 g/m²)',
    modelagem: 'Oversized',
    comprimento: '74 cm (tam. M)',
  },
  {
    slug: 'vestido-babado-verde',
    nome: 'Vestido Longo Babado',
    categoria: 'vestidos',
    genero: 'feminino',
    preco: 389,
    precoDe: 489,
    fotos: 2,
    cabide: { altura: 1, proporcao: 0.369 },
    cores: [{ nome: 'Verde-garrafa', hex: '#1F6B4A', tom: 'oliva' }, C.cafe],
    tamanhos: LETRAS,
    avaliacao: 4.7,
    numAvaliacoes: 37,
    resumo: 'Vestido longo com decote ombro a ombro e babado, em malha fluida.',
    descricao: ['Decote ombro a ombro com babado que cai sobre os braços e saia reta até o tornozelo. Um vestido de festa que não pede salto.'],
    composicao: '95% viscose, 5% elastano',
    modelagem: 'Fluida',
    comprimento: '138 cm (tam. M)',
  },
  {
    slug: 'jaqueta-bomber-terracota',
    nome: 'Jaqueta Bomber Terracota',
    categoria: 'casacos',
    genero: 'unissex',
    preco: 459,
    precoDe: 599,
    fotos: 2,
    cabide: { altura: 0.76, proporcao: 0.723 },
    cores: [C.terracota, C.preto],
    tamanhos: LETRAS,
    avaliacao: 4.8,
    numAvaliacoes: 45,
    resumo: 'Bomber leve em tafetá acetinado, com bolso utilitário na manga e punhos canelados.',
    descricao: ['O casaco das noites de meia-estação: corta o vento, pesa quase nada e dobra dentro da mochila. Bolso com zíper na manga e forro respirável.'],
    composicao: '100% poliamida reciclada',
    modelagem: 'Regular',
    comprimento: '66 cm (tam. M)',
  },
]

export const TABELA_MEDIDAS = {
  colunas: ['Tamanho', 'Peito/Busto', 'Cintura', 'Quadril'],
  linhas: [
    ['PP', '80–84', '62–66', '88–92'],
    ['P', '85–90', '67–72', '93–98'],
    ['M', '91–97', '73–80', '99–104'],
    ['G', '98–104', '81–88', '105–110'],
    ['GG', '105–112', '89–96', '111–118'],
  ],
}

export const CUIDADOS = 'Lavar à mão ou na máquina em ciclo delicado, água fria. Não usar alvejante. Secar à sombra. Passar em temperatura média, do avesso.'

/** Avaliações DE EXEMPLO (fictícias, para demonstrar o layout). Cada produto mostra três delas. */
export const AVALIACOES = [
  { nome: 'Juliana M.', cidade: 'Belo Horizonte', nota: 5, data: '12 nov 2026', tamanho: 'M', titulo: 'Caimento perfeito', texto: 'Comprei no meu tamanho de sempre e serviu certinho. O tecido é ainda mais bonito pessoalmente.' },
  { nome: 'Rafael T.', cidade: 'São Paulo', nota: 5, data: '03 nov 2026', tamanho: 'G', titulo: 'Qualidade que aparece', texto: 'Já lavei várias vezes e continua igual. Acabamento por dentro impecável, dá pra ver o cuidado.' },
  { nome: 'Patrícia L.', cidade: 'Curitiba', nota: 4, data: '28 out 2026', tamanho: 'G', titulo: 'Linda, veste um pouco amplo', texto: 'Amei a cor e o toque. Achei um pouco maior do que esperava; se gosta de mais ajustado, peça um número abaixo.' },
  { nome: 'Pedro H.', cidade: 'Recife', nota: 5, data: '19 out 2026', tamanho: 'M', titulo: 'Virou favorita', texto: 'Uso toda semana. Fresquinha no calor daqui e não amassa tanto quanto eu imaginava.' },
  { nome: 'Beatriz A.', cidade: 'Porto Alegre', nota: 5, data: '07 out 2026', tamanho: 'PP', titulo: 'Entrega rápida', texto: 'Chegou em três dias, embalagem linda e sem plástico. A peça é exatamente como nas fotos.' },
  { nome: 'Lucas C.', cidade: 'Rio de Janeiro', nota: 4, data: '22 set 2026', tamanho: 'M', titulo: 'Vale o investimento', texto: 'Não é barata, mas dá pra sentir a diferença. Troquei o tamanho sem nenhuma dor de cabeça.' },
]

/* ───────────────────────── Helpers ───────────────────────── */

const base = import.meta.env.BASE_URL

export const img = (caminho: string) => `${base}img/${caminho}`
export const fotoProduto = (slug: string, n: number, pequena = false) => img(`produtos/${slug}-${n}${pequena ? '-sm' : ''}.webp`)

export const porSlug = (slug: string) => PRODUTOS.find((p) => p.slug === slug)

export const descontoPct = (p: Produto) => (p.precoDe ? Math.round((1 - p.preco / p.precoDe) * 100) : 0)

export const nomeCategoria = (id: CategoriaId) => CATEGORIAS.find((c) => c.id === id)?.nome ?? ROTULO_FILTRO[id]

/** A cor do produto que combina com o tom escolhido na prova de cor (se existir). */
export const corDoTom = (p: Produto, tom: Tom | null) => (tom ? p.cores.find((c) => c.tom === tom) : undefined)

export function filtrar(filtro: Filtro): Produto[] {
  if (filtro === 'todos') return PRODUTOS.filter((p) => p.destaque)
  if (filtro === 'novidades') return PRODUTOS.filter((p) => p.novo)
  if (filtro === 'sale') return PRODUTOS.filter((p) => p.precoDe)
  if (filtro === 'feminino' || filtro === 'masculino') return PRODUTOS.filter((p) => p.genero === filtro || p.genero === 'unissex')
  return PRODUTOS.filter((p) => p.categoria === filtro)
}

export const ROTULO_FILTRO: Record<Filtro, string> = {
  todos: 'Mais desejados',
  novidades: 'Novidades',
  sale: 'Sale',
  feminino: 'Feminino',
  masculino: 'Masculino',
  camisas: 'Camisas',
  calcas: 'Calças & Bermudas',
  vestidos: 'Vestidos',
  trico: 'Tricô',
  casacos: 'Casacos & Jaquetas',
}
