import { useEffect } from 'react'

/**
 * Liga o motor Sites Incríveis (public/fx/, arquivo intocado) numa página React.
 *
 * O motor varre a página uma vez ao carregar. Como a home é montada pelo React
 * (e remontada ao voltar da página de produto), injetamos o script de novo a
 * cada montagem: ele arma os elementos data-fx-* que acabaram de nascer.
 * Use data-fx-* só em elementos que o React não recria (texto fixo, cenas).
 */
export function useMotor() {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = `${import.meta.env.BASE_URL}fx/sites-incriveis.js`
    script.dataset.motor = 'sites-incriveis'
    document.body.appendChild(script)

    return () => {
      script.remove()
      // O "fundo que viaja" pinta o <body>; fora da home ele não deve valer.
      const raiz = document.documentElement
      raiz.classList.remove('fx-fundo-ativo')
      raiz.style.removeProperty('--fx-fundo')
      raiz.style.removeProperty('--fx-tinta')
    }
  }, [])
}
