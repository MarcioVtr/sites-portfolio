const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export const reais = (v: number) => brl.format(v)
