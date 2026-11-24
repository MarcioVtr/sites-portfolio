# Âmbar — loja de roupas unissex (demo)

Homepage e página de produto de uma loja unissex em fibras naturais (linho, seda e tricô).
A homepage é uma experiência de rolagem feita com a skill **Sites Incríveis**; o plano
completo está em [`BRIEF.md`](BRIEF.md).
React + TypeScript + Tailwind v4 + Vite.

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # gera dist/ (hospedagem estática, sem configuração extra)
```

## A homepage em 6 cenas

1. **Luz de janela**: díptico ela/ele com uma faixa de sol atravessando devagar.
2. **Categorias** em grade assimétrica.
3. **Prova de cor** (movimento-assinatura): tocar numa amostra muda o acento da loja inteira. As peças nessa cor ganham o selo "Tem em …" e abrem com ela selecionada.
4. **Destaques** 4×2 com filtros (incluindo Feminino e Masculino).
5. **Arara do sale** + editorial: fotos reais de peças no cabide (fundo removido) penduradas de lado num trilho cromado, em 3D. Passar o mouse vira a peça de frente; clicar tira a peça da arara para uma vista grande com contador, setas (também ← →) e Fechar (também Esc). Faixa correndo no rodapé e contagem regressiva.
6. **Fechamento**: benefícios e newsletter com uma chamada só.

## Identidade

| | |
|---|---|
| Fundo | `#F4EFE7` linho |
| Primária | `#2B1D14` café |
| Acento (trocável pela prova de cor) | Terracota `#B5532F` · Oliva `#5E6B3A` · Egeu `#2F5D7C` · Ocre `#976620` |
| Títulos | Fraunces (serif variável, com itálico) |
| Corpo | Manrope |

Os tokens ficam em `src/index.css` (`@theme`). O acento é registrado com `@property`,
então a troca de tom é uma transição, não um salto.

## Onde mexer

- **`src/conteudo.ts`**: textos das cenas, produtos (com `genero`), preços, categorias, tons, avaliações de exemplo e regras (frete grátis, parcelas, Pix). Para adaptar a outro cliente, comece por aqui.
- `src/paginas/Home.tsx` + `home.css`: as cenas da home.
- `src/paginas/AraraSale.tsx` + `arara.css`: a arara do sale. Desenhada numa prancheta de medidas fixas (1500 px no desktop, 600 px no celular) escalada para a largura da seção; os números ficam no topo do arquivo.
- `src/paginas/Produto.tsx`: galeria com zoom, área de compra, abas e carrossel de relacionados.
- `src/ui/`: header (some ao descer na home), busca expansível, card de produto, sacola lateral, aviso e rodapé.
- `src/lib/`: carrinho, prova de cor (`tom.tsx`), motor (`motor.ts`) e roteador por hash.

## Motor de rolagem

`public/fx/sites-incriveis.js` e `.css` são o motor da skill Sites Incríveis, **sem alterações**
(© Enzo Barbatto — Sparo; ver a licença da skill). Ele varre a página uma vez, então
`useMotor()` o injeta de novo a cada vez que a home monta. Use `data-fx-*` só em
elementos que o React não recria. Com movimento reduzido ligado, tudo aparece parado e legível.

## Fotos

`public/img/produtos/{slug}-{n}.webp` (1200×1500) e `{slug}-{n}-sm.webp` (600×750).
O número de fotos de cada produto é o campo `fotos` em `conteudo.ts`.

**Arara:** entra na arara todo produto em promoção que tenha o campo `cabide` em `conteudo.ts` e uma imagem `public/img/cabide/{slug}.webp` com fundo transparente, gancho do cabide no topo e centralizado. `cabide.altura` é o tamanho relativo na arara (vestido longo = 1) e `cabide.proporcao` é largura/altura da imagem. As 6 peças atuais são fotos reais do Unsplash com o fundo removido localmente; logos de terceiros e a mão que segurava a jaqueta foram retocados. As fotos de produto dessas peças são a mesma peça sobre fundo de estúdio.

## O que é demonstração

Marca, CNPJ, produtos, preços e avaliações são **fictícios**. As avaliações aparecem com o
selo "Avaliações de exemplo". Checkout, login, cálculo de frete e newsletter são simulados
(não enviam nada para lugar nenhum).

## Créditos das fotos

Todas do [Unsplash](https://unsplash.com/license) (licença Unsplash: uso comercial livre, sem atribuição obrigatória), recortadas e convertidas para WebP.

Peças no cabide (arara): [8ACmRoleM24](https://unsplash.com/photos/8ACmRoleM24) · [AqLIkOzWDAk](https://unsplash.com/photos/AqLIkOzWDAk) · [A7f7XRKgUWc](https://unsplash.com/photos/A7f7XRKgUWc) · [6Nub980bI3I](https://unsplash.com/photos/6Nub980bI3I) · [VyI0GBHSsJ8](https://unsplash.com/photos/VyI0GBHSsJ8) · [Fg15LdqpWrs](https://unsplash.com/photos/Fg15LdqpWrs)

Demais fotos:
[QpvMdWqFe1s](https://unsplash.com/photos/QpvMdWqFe1s) ·
[pqD3qIKXFVU](https://unsplash.com/photos/pqD3qIKXFVU) ·
[S8-HvjNfs2g](https://unsplash.com/photos/S8-HvjNfs2g) ·
[fbwPvGN6U1Y](https://unsplash.com/photos/fbwPvGN6U1Y) ·
[hAMJpesMeDE](https://unsplash.com/photos/hAMJpesMeDE) ·
[WEYrIctDyn4](https://unsplash.com/photos/WEYrIctDyn4) ·
[6Yt7ROM7KMA](https://unsplash.com/photos/6Yt7ROM7KMA) ·
[DSKNz2MZWW4](https://unsplash.com/photos/DSKNz2MZWW4) ·
[rz3sw-8VNCw](https://unsplash.com/photos/rz3sw-8VNCw) ·
[OCV0rpL6hGQ](https://unsplash.com/photos/OCV0rpL6hGQ) ·
[sv9Dc1UkffU](https://unsplash.com/photos/sv9Dc1UkffU) ·
[9E7s5oyDmxg](https://unsplash.com/photos/9E7s5oyDmxg) ·
[WfEoXGtlQ6E](https://unsplash.com/photos/WfEoXGtlQ6E) ·
[J35muhi0am4](https://unsplash.com/photos/J35muhi0am4) ·
[SKysv4AKno8](https://unsplash.com/photos/SKysv4AKno8) ·
[k49kD3YXOsc](https://unsplash.com/photos/k49kD3YXOsc) ·
[WOahbCEqLmw](https://unsplash.com/photos/WOahbCEqLmw) ·
[8ACmRoleM24](https://unsplash.com/photos/8ACmRoleM24)

Antes de usar com um cliente real, troque pelas fotos da própria marca.
