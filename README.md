# Card Marketplace

Aplicação SPA para marketplace de trocas de cartas colecionáveis, desenvolvida com Vue 3, TypeScript e Pinia.

## Funcionalidades

- **Autenticação**: Registro e login de usuários
- **Coleção pessoal**: Adicionar cartas do catálogo à sua coleção
- **Solicitações de troca**: Criar, visualizar e excluir propostas de troca
- **Marketplace público**: Visualizar todas as trocas disponíveis

## Decisões Técnicas

### Arquitetura

O projeto segue uma arquitetura em camadas com separação clara de responsabilidades:

```
src/
├── components/     # Componentes de UI reutilizáveis
├── views/          # Páginas/rotas da aplicação
├── stores/         # Estado global com Pinia (auth, cards, trades, toast)
├── services/       # Camada de comunicação com API
├── types/          # Interfaces e tipos TypeScript
├── router/         # Configuração de rotas e guards
└── styles/         # Estilos globais e classes utilitárias
```

### Stack Escolhida

| Tecnologia | Justificativa |
|------------|---------------|
| **Vue 3** | Composition API oferece melhor organização e reuso de lógica |
| **TypeScript** | Tipagem estática para maior segurança e manutenibilidade |
| **Pinia** | State management oficial do Vue, mais simples que Vuex |
| **Vue Router** | Roteamento com guards para autenticação |
| **Tailwind CSS** | Estilização utilitária para desenvolvimento ágil |
| **Axios** | Cliente HTTP com interceptors para token e tratamento de erros |

### Padrões Utilizados

- **Composition API**: Todas as views e componentes usam `<script setup>`
- **Barrel exports**: Arquivos `index.ts` para imports simplificados
- **Service Layer**: Abstração da API em services tipados
- **Store Pattern**: Estado centralizado com ações assíncronas
- **Guard Routes**: Proteção de rotas autenticadas

## Como Executar

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação

```bash
# Clonar repositório
git clone <url>
cd marketplace-cartas

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

Acesse http://localhost:5173

### Build para Produção

```bash
npm run build
npm run preview
```

### Testes

```bash
npm run test        # watch mode
npm run test:run    # executa uma vez
```

## Uso da Aplicação

1. **Criar conta**: Registre-se com nome, email e senha
2. **Login**: Entre com suas credenciais
3. **Adicionar cartas**: Em "Minhas Cartas", adicione cartas à sua coleção
4. **Criar troca**: Selecione cartas que oferece e cartas que deseja receber
5. **Explorar**: Veja trocas de outros usuários no marketplace

## API

A aplicação consome a API REST disponível em:
- **Base URL**: `https://cards-marketplace-api.onrender.com`

### Endpoints Utilizados

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/register` | Registro de usuário |
| POST | `/login` | Autenticação |
| GET | `/me` | Dados do usuário logado |
| GET | `/cards` | Lista de cartas (paginada) |
| POST | `/me/cards` | Adicionar cartas à coleção |
| GET | `/trades` | Lista de trocas (paginada) |
| POST | `/trades` | Criar solicitação de troca |
| DELETE | `/trades/:id` | Remover troca |

## Limitações Conhecidas

- A API não possui endpoint para "aceitar" uma troca. O sistema funciona como um quadro de anúncios onde usuários publicam suas intenções de troca e negociam externamente.
- Não há sistema de mensagens entre usuários.

## Melhorias Futuras

- [x] Testes unitários
- [ ] PWA para uso offline
- [ ] Filtros avançados no marketplace
- [ ] Notificações em tempo real
- [ ] Sistema de avaliação de usuários
