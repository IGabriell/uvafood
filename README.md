# 🍇 UVAfood

Aplicativo de delivery de comida (estilo iFood) desenvolvido como projeto acadêmico no primeiro bimestre do curso de Engenharia de Software. Interface completa de pedidos, carrinho, rastreamento e um assistente virtual interativo, com foco em experiência do usuário e organização de código front-end.

**🔗 Deploy:** [text-tidal-76522806.figma.site](https://text-tidal-76522806.figma.site)

---

## 📋 Sobre o projeto

O UVAfood simula a experiência de um app de delivery completo, cobrindo o fluxo inteiro do usuário: descobrir produtos, montar o carrinho, fazer login, finalizar o pedido e acompanhar a entrega. O projeto foi prototipado no Figma e implementado como uma aplicação React real.

### Funcionalidades

- 🏠 **Catálogo de produtos** por categoria (combos, lanches, pratos, bebidas etc.)
- 🛒 **Carrinho de compras** com controle de quantidade e cálculo de total
- 🔐 **Autenticação de usuário** (login/cadastro) com rotas protegidas
- 📦 **Histórico de pedidos** com status (Em preparo, A caminho, Entregue)
- 🗺️ **Mapa de entrega** interativo
- 🤖 **Assistente virtual** com respostas automáticas para dúvidas sobre pedido, prazo, pagamento e promoções
- 📱 Interface responsiva, com componentes reutilizáveis (shadcn/ui) e efeitos visuais (Framer Motion)

## 🛠️ Tecnologias

- **React 18** + **TypeScript**
- **Vite** (build e dev server)
- **React Router** (navegação e rotas protegidas)
- **Tailwind CSS** + **shadcn/ui** (interface e componentes)
- **Context API** para estado global (carrinho e autenticação)
- **Motion** (animações)

> Este é um projeto **front-end**: os dados de produtos são estáticos (mock), e o login/carrinho são simulados em memória e `localStorage`, sem back-end ou banco de dados reais. O assistente virtual responde com base em regras (palavras-chave), não é integrado a um modelo de IA generativa.

## 🚀 Rodando localmente

```bash
# instalar dependências
npm i

# iniciar o servidor de desenvolvimento
npm run dev
```

A aplicação abre em `http://localhost:5173` (padrão do Vite).

Para gerar a versão de produção:

```bash
npm run build
```

## 📁 Estrutura do projeto

```
src/
├── app/
│   ├── components/     # Componentes reutilizáveis (UI, mapa, chat, modais)
│   ├── contexts/        # Estado global (AuthContext, CartContext)
│   ├── pages/            # Páginas (Home, Login, Cart, Map, Tracking, Restaurant...)
│   └── routes.tsx        # Definição de rotas
└── styles/                 # Tema e estilos globais (Tailwind)
```

## 👤 Autor

**Gabriel de Souza Duarte**
Estudante de Engenharia de Software — Universidade Veiga de Almeida (UVA)
[LinkedIn](https://www.linkedin.com/in/gabriel-de-souza-duarte-61b52b412/) · [GitHub](https://github.com/IGabriell)
