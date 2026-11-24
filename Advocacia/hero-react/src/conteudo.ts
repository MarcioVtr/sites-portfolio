/**
 * Todo o conteúdo do site num lugar só.
 * Para adaptar a um cliente, edite este arquivo — os componentes leem daqui.
 *
 * ATENÇÃO (demo): números, casos e depoimentos abaixo são ILUSTRATIVOS.
 * Substitua por dados reais e autorizados antes de publicar
 * (Provimento 205/2021 da OAB sobre publicidade na advocacia).
 */

export const ESCRITORIO = {
  nome: 'Prado Ribeiro',
  nomeCompleto: 'Prado Ribeiro Advocacia',
  razaoSocial: 'Prado Ribeiro Sociedade de Advogados',
  oab: 'OAB/SP nº 00.000',
  tagline: 'Advocacia de família, trabalho e previdência, explicada em português.',
  whatsapp: 'https://wa.me/5511900000000',
  telefone: '(11) 3000-0000',
  telefoneLink: 'tel:+551130000000',
  email: 'contato@pradoribeiro.adv.br',
  endereco: 'Rua Exemplo, 100 · Pinheiros · São Paulo/SP',
  horario: 'Seg a sex, 9h às 18h',
}

export const NAV = [
  { rotulo: 'Escritório', href: '#escritorio' },
  { rotulo: 'Áreas', href: '#areas' },
  { rotulo: 'Equipe', href: '#equipe' },
  { rotulo: 'Contato', href: '#contato' },
]

export const NUMEROS = [
  { valor: 1500, prefixo: '+', sufixo: '', rotulo: 'Pessoas atendidas' },
  { valor: 20, prefixo: '', sufixo: '', rotulo: 'Anos de atuação' },
  { valor: 24, prefixo: '', sufixo: 'h', rotulo: 'Para a primeira resposta' },
  { valor: 4.9, prefixo: '', sufixo: '', rotulo: 'Avaliação no Google', decimais: 1 },
]

export type IconeArea = 'familia' | 'trabalho' | 'previdencia' | 'sucessoes' | 'consumidor' | 'imovel'

export const AREAS: { icone: IconeArea; titulo: string; texto: string }[] = [
  { icone: 'familia', titulo: 'Família', texto: 'Divórcio, guarda, pensão alimentícia e partilha de bens, conduzidos com discrição e cuidado.' },
  { icone: 'trabalho', titulo: 'Trabalho', texto: 'Demissão, verbas rescisórias, horas extras e assédio. Do lado de quem trabalha.' },
  { icone: 'previdencia', titulo: 'Previdência', texto: 'Aposentadorias, BPC/LOAS, auxílio-doença e benefícios negados pelo INSS.' },
  { icone: 'sucessoes', titulo: 'Sucessões', texto: 'Inventário, testamento e partilha de herança, na Justiça ou em cartório.' },
  { icone: 'consumidor', titulo: 'Consumidor', texto: 'Cobranças indevidas, nome negativado, voos cancelados e planos de saúde.' },
  { icone: 'imovel', titulo: 'Imobiliário', texto: 'Contratos de aluguel, usucapião e regularização do seu imóvel.' },
]

export const PASSOS = [
  { titulo: 'Conversa inicial', texto: 'Você conta o que aconteceu, sem pressa. A gente escuta antes de falar em processo.' },
  { titulo: 'Explicação clara', texto: 'Seus direitos, riscos e prazos, em português. Nada de juridiquês.' },
  { titulo: 'Estratégia combinada', texto: 'Você escolhe o caminho conosco, com honorários definidos por escrito.' },
  { titulo: 'Acompanhamento', texto: 'A cada movimentação do processo, um aviso explicando o que ela significa.' },
]

export const CASOS = [
  {
    area: 'Previdência',
    resultado: 'Aposentadoria concedida',
    texto: 'Benefício negado pelo INSS revertido em recurso, com pagamento dos valores atrasados.',
    imagem: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=900&q=75',
  },
  {
    area: 'Família',
    resultado: 'Guarda compartilhada em 4 meses',
    texto: 'Acordo construído em mediação, sem audiência litigiosa e sem desgaste para os filhos.',
    imagem: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=75',
  },
  {
    area: 'Trabalho',
    resultado: 'Rescisão paga por inteiro',
    texto: 'Verbas rescisórias quitadas, acrescidas da multa por atraso prevista na CLT.',
    imagem: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=75',
  },
]

export const EQUIPE = [
  { nome: 'Helena Prado', cargo: 'Sócia · Família e Sucessões', oab: 'OAB/SP 000.001', foto: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { nome: 'Rafael Ribeiro', cargo: 'Sócio · Trabalho', oab: 'OAB/SP 000.002', foto: 'https://randomuser.me/api/portraits/men/46.jpg' },
  { nome: 'Marta Ivo', cargo: 'Advogada · Previdência', oab: 'OAB/SP 000.003', foto: 'https://randomuser.me/api/portraits/women/65.jpg' },
  { nome: 'André Souza', cargo: 'Advogado · Consumidor', oab: 'OAB/SP 000.004', foto: 'https://randomuser.me/api/portraits/men/32.jpg' },
]

export const DEPOIMENTOS = [
  {
    texto: 'Eu chegava com medo de não entender nada. Saía de cada conversa sabendo exatamente qual era o próximo passo.',
    nome: 'Luciana M.',
    contexto: 'Divórcio e guarda',
  },
  {
    texto: 'Me explicaram em dez minutos o que eu tentei entender sozinho por meses no site do INSS. A aposentadoria saiu.',
    nome: 'José A.',
    contexto: 'Aposentadoria',
  },
  {
    texto: 'Fui demitido sem receber tudo. Em nenhum momento me senti sozinho, e sempre sabia em que pé estava o processo.',
    nome: 'Carlos R.',
    contexto: 'Rescisão trabalhista',
  },
]

export const RODAPE = [
  { titulo: 'Escritório', links: [['Sobre nós', '#escritorio'], ['Como funciona', '#escritorio'], ['Equipe', '#equipe'], ['Casos', '#casos']] },
  { titulo: 'Áreas', links: [['Família', '#areas'], ['Trabalho', '#areas'], ['Previdência', '#areas'], ['Sucessões', '#areas']] },
  { titulo: 'Atendimento', links: [['Agendar conversa', ESCRITORIO.whatsapp], ['Depoimentos', '#depoimentos'], ['Perguntas frequentes', '#'], ['Trabalhe conosco', '#']] },
  { titulo: 'Legal', links: [['Política de privacidade', '#'], ['Termos de uso', '#'], ['LGPD', '#']] },
] as const
