# BRIEF — Âmbar (revisão com Sites Incríveis)

Demo de portfólio para mostrar a clientes. Marca fictícia. Data: 2026-11-24.

## As 7 respostas

1. **O que é e pra quem** — Âmbar, loja de roupas **unissex** em linho, seda e tricô. Visitante: gente de **20 a 30 anos, de estilo**, que descobre a marca pelo Instagram e compra pelo visual.
2. **Vibe** — *Solar, tátil, sem pressa.* Referências fora da internet: o filme *Me Chame pelo Seu Nome*, a revista *Kinfolk*, uma casa de pedra em Puglia.
3. **Caminho** — Marca primeiro, loja depois: hero → o tecido (do fio ao look) → categorias → destaques → promo → benefícios → newsletter.
   > Desvio consciente do prompt original: o sub-banner de promoção sai de baixo do hero e vai para depois dos destaques.
4. **O que precisa acreditar no final** — *"É a peça que vou usar por anos."*
5. **Energia e pico** — Pico: **Do fio ao look** (close da trama → tecido → costura → peça vestida). O resto da página fica mais calmo em volta.
6. **Movimento-assinatura** — **Prova de cor**: a visitante toca numa amostra de tecido e a página muda de tom junto.
7. **Materiais** — Nada real (marca fictícia). Fotos do Unsplash, com licença livre e créditos no README. As avaliações ficam, mas marcadas como **"Avaliações de exemplo"**, e a homepage não mostra nenhum número inventado.

## Mudança de catálogo (unissex)

- Produtos ganham `genero: feminino | masculino | unissex`. Entram peças masculinas e unissex (camisa de linho, calça e bermuda de linho, overshirt, tricô), e parte das femininas sai.
- Categorias por tipo: **Camisas · Calças & Bermudas · Vestidos · Tricô**. A navegação ganha **Feminino** e **Masculino**.
- Texto neutro: cupom `BEMVINDA10` vira `PRIMEIRA10`, e frases como "bem vestida" são reescritas.

## Jornada em cenas

| # | Cena | Vê | Sente | Passa a acreditar | Energia | Família de efeito |
|---|---|---|---|---|---|---|
| 1 | **Abertura: luz de janela** | Foto solar em tela cheia, título serifado ancorado embaixo à esquerda. Uma faixa de luz quente atravessa a foto devagar, como sol entrando pela janela. | Calor, calma | "Essa marca tem clima" | média | Profundidade (paralaxe) + luz própria |
| 2 | **PICO: Do fio ao look** | Cena presa por 5 telas. Começa num close extremo da trama do linho; a câmera se afasta: fio → tecido → costura no ateliê → a peça vestida. Uma frase curta por etapa. No fim, o look completo com "Ver a peça". | Descoberta, toque | "Isso é bem feito" | **alta** | Cena fixa (escala + opacidade por faixa) |
| 3 | **Categorias** | 4 categorias em grade assimétrica (uma grande, três menores), ancorada à esquerda, entrando dos lados alternados. | Orientação | "Tem o que eu procuro" | calma | Revelações laterais |
| 4 | **Prova de cor (assinatura)** | Quatro amostras de tecido grandes e táteis: Terracota, Oliva, Egeu, Ocre. Ao tocar numa, a cor se espalha a partir da amostra como tinta em tecido e o tom da página muda. | Brincadeira, controle | "É a minha cor" | média-alta | Código próprio (clip-path circular + variáveis CSS) |
| 5 | **Destaques** | Grade 4×2. As peças que existem na cor escolhida ganham um selo "Tem em Oliva"; ao abrir o produto, a cor já vem selecionada. | Desejo | "Quero essa" | calma | Revelação em cascata (React) |
| 6 | **Promo + editorial "anos"** | O fundo viaja para café escuro. Sub-banner da promo com contagem, depois o banner editorial de 60vh com paralaxe: *"A peça que você vai usar por anos."* | Urgência leve, depois certeza | A frase da pergunta 4 | média | Fundo que viaja + paralaxe |
| 7 | **Fechamento** | Fundo volta ao linho. Faixa de benefícios e newsletter com **uma** chamada só. Título montado palavra por palavra. | Resolução | "Vou entrar nessa" | calma | Texto que se monta |

**Curva de energia:** média → **ALTA** → calma → média-alta → calma → média → calma. Cenas vizinhas nunca têm a mesma energia nem a mesma família de efeito.

**Página de produto:** fica rápida e objetiva, com toques sutis. A cor escolhida na prova de cor vem pré-selecionada e a aba de avaliações recebe o selo "Avaliações de exemplo".

## Paleta e tipografia

- Base: linho `#F4EFE7`, café `#2B1D14`, pedra `#6B5A4C`.
- Acento: **um só por vez**, trocado pela prova de cor. Terracota `#B5532F` (padrão) · Oliva `#5E6B3A` · Egeu `#2F5D7C` · Ocre `#A8742A`.
- Fraunces (títulos) + Manrope (texto). Escala 13 / 15 / 18 / 24 / 36 / 56 / 88.

## Trava anti-repetição (vs. `construcoes.md`)

| Item | MV Flow Tech | Prado Ribeiro | **Âmbar** | Diferente? |
|---|---|---|---|---|
| Abertura | título palavra por palavra no grafite | título palavra por palavra no papel | foto solar em tela cheia + faixa de luz, sem palavra por palavra | ✅ |
| Pico | símbolo se desenha | fio de tinta se estica | câmera se afasta: macro → look (escala) | ✅ |
| Assinatura | chips correm pelo símbolo | caneta risca juridiquês | prova de cor que muda o tom da página | ✅ |
| Paleta | grafite + vermelho | papel + musgo | linho + café, acento trocável | ✅ |
| Estrutura | caos → pico → serviços… | acolhimento → folhas → pico… | clima → pico logo cedo → loja → certeza → fechamento | ✅ |

5 de 5 diferentes.

## Técnico

- O motor (`sites-incriveis.js/.css`) é copiado **sem alterações** para `public/fx/` e recarregado a cada vez que a home monta (ele faz a varredura da página uma vez só).
- `data-fx-*` vai só em elementos fixos da home. Vitrine filtrada, sacola e assinatura usam código React próprio.
- Movimento reduzido: o motor já respeita, e o código próprio também respeita.

## Revisão 1 (pedido do cliente, 2026-11-24)

- **Pico "do fio ao look" removido**: a cena presa por 5 telas demorava demais.
- **Sale virou uma arara de roupas** (inspirada num modelo de referência enviado pelo cliente, adaptado à Âmbar: fontes, cores e produtos próprios; sem logo nem imagens da referência). Peças em 3D no trilho, hover vira de frente, clique abre vista grande com contador e setas. Passa a ser o **novo pico**, agora mais perto do fim, onde o desejo de compra já está construído.
- **Fundo que viaja removido**: sem o pico escuro, ele deixava textos da vitrine e dos benefícios sem contraste durante a transição. A seção do sale tem fundo café fixo.

Nova curva de energia: média (abertura) → calma (categorias) → média-alta (prova de cor) → calma (destaques) → **ALTA (arara)** → média (editorial) → calma (fechamento).

## Revisão 2 (pedido do cliente, 2026-11-24)

- **Arara com peças reais no cabide** em vez de fotos de modelo: 6 fotos do Unsplash de roupas penduradas (camisetas branca, mescla e preta, manga longa, vestido longo, jaqueta bomber), com o fundo removido localmente, gancho centralizado e retoques (logos "705" de terceiros, etiqueta, mão segurando a jaqueta).
- Viraram **produtos novos em promoção** (5) + a camiseta pima entrou no sale; nova categoria "Casacos & Jaquetas" (fora da grade de 4 da home).
- Cada peça pende no tamanho relativo real (camiseta mais curta que vestido) e a vista grande nasce exatamente do tamanho da peça no trilho.
