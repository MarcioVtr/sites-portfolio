import { CATEGORIAS, LOJA } from '../conteudo'
import { useCarrinho } from '../lib/carrinho'
import { linkFiltro } from '../lib/rota'
import { Marca, container } from './base'

const PAGAMENTOS = ['Pix', 'Visa', 'Mastercard', 'Elo', 'Amex', 'Boleto']

export function Rodape() {
  const { avisar } = useCarrinho()
  const demo = () => avisar('Demo: página disponível na versão completa')
  const ajuda = ['Trocas e devoluções', 'Prazos de entrega', 'Guia de medidas', 'Perguntas frequentes']
  const marca = ['O ateliê', 'Sustentabilidade', 'Lojas parceiras', 'Trabalhe conosco']

  return (
    <footer className="bg-cafe text-linho">
      <div className={`${container} grid grid-cols-2 gap-x-6 gap-y-12 py-16 md:grid-cols-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:py-20`}>
        <div className="col-span-2 max-w-sm md:col-span-3 lg:col-span-1">
          <Marca className="text-3xl" />
          <p className="mt-5 text-[14px] leading-relaxed text-linho/70">{LOJA.tagline}</p>
          <div className="mt-6 flex gap-5 text-[13px] font-semibold">
            {['Instagram', 'Pinterest', 'TikTok'].map((r) => (
              <button key={r} type="button" onClick={demo} className="underline-offset-4 hover:text-terracota-suave hover:underline">
                {r}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="selo mb-5 text-linho/50">Comprar</h3>
          <ul className="space-y-3 text-[14px]">
            {CATEGORIAS.map((c) => (
              <li key={c.id}>
                <a href={linkFiltro(c.id)} className="hover:text-terracota-suave">
                  {c.nome}
                </a>
              </li>
            ))}
            <li>
              <a href={linkFiltro('sale')} className="text-terracota-suave hover:underline">
                Sale
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="selo mb-5 text-linho/50">Ajuda</h3>
          <ul className="space-y-3 text-[14px]">
            {ajuda.map((a) => (
              <li key={a}>
                <button type="button" onClick={demo} className="text-left hover:text-terracota-suave">
                  {a}
                </button>
              </li>
            ))}
            <li>
              <a href={LOJA.whatsapp} target="_blank" rel="noreferrer" className="hover:text-terracota-suave">
                WhatsApp
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="selo mb-5 text-linho/50">Âmbar</h3>
          <ul className="space-y-3 text-[14px]">
            {marca.map((a) => (
              <li key={a}>
                <button type="button" onClick={demo} className="text-left hover:text-terracota-suave">
                  {a}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-linho/10">
        <div className={`${container} flex flex-col gap-5 py-7 text-[12px] text-linho/60 lg:flex-row lg:items-center lg:justify-between`}>
          <ul className="flex flex-wrap gap-2" aria-label="Formas de pagamento">
            {PAGAMENTOS.map((p) => (
              <li key={p} className="rounded border border-linho/20 px-2.5 py-1 font-semibold text-linho/80">
                {p}
              </li>
            ))}
          </ul>
          <p>
            {LOJA.razaoSocial} · {LOJA.endereco}
          </p>
          <p>Demo de portfólio · marca e produtos fictícios</p>
        </div>
      </div>
    </footer>
  )
}
