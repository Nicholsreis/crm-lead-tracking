# CRM Lead Tracking SaaS

Sistema CRM/SaaS para rastreamento de leads em tempo real do "Mercantil Santa Paula - Atendimento Inicial".

## Stack Tecnológica

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes + Supabase
- **Database**: Supabase (PostgreSQL)
- **Real-time**: Supabase Realtime
- **State Management**: React Query + Zustand
- **Charts**: Recharts
- **Testing**: Jest + fast-check + React Testing Library

## Funcionalidades

- ✅ Dashboard em tempo real com métricas
- ✅ Captura automática de leads via webhook n8n
- ✅ Gestão completa de leads com filtros avançados
- ✅ Histórico de conversas e mensagens
- ✅ Sistema de notificações em tempo real
- ✅ Analytics e relatórios detalhados
- ✅ Exportação CSV/Excel
- ✅ Atribuição de leads para atendentes
- ✅ Autenticação e segurança
- ✅ Interface responsiva (mobile-first)

## Setup

### 1. Instalar dependências

\`\`\`bash
npm install
\`\`\`

### 2. Configurar variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha com suas credenciais:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Variáveis necessárias:
- `NEXT_PUBLIC_SUPABASE_URL`: URL do seu projeto Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Chave anônima do Supabase
- `WEBHOOK_AUTH_TOKEN`: Token para autenticar webhooks do n8n

### 3. Configurar banco de dados Supabase

Execute o SQL schema localizado em `supabase/schema.sql` no seu projeto Supabase.

### 4. Executar em desenvolvimento

\`\`\`bash
npm run dev
\`\`\`

Acesse [http://localhost:3000](http://localhost:3000)

## Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm start` - Inicia servidor de produção
- `npm run lint` - Executa linter
- `npm test` - Executa testes
- `npm run test:watch` - Executa testes em modo watch
- `npm run test:coverage` - Gera relatório de cobertura
- `npm run type-check` - Verifica tipos TypeScript
- `npm run format` - Formata código com Prettier

## Deploy na Vercel

1. Conecte seu repositório Git à Vercel
2. Configure as variáveis de ambiente no painel da Vercel
3. Deploy automático a cada push

## Estrutura do Projeto

\`\`\`
crm-lead-tracking/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Rotas de autenticação
│   ├── (dashboard)/       # Rotas do dashboard
│   └── api/               # API Routes
├── components/            # Componentes React
│   ├── dashboard/        # Componentes do dashboard
│   ├── leads/            # Componentes de leads
│   ├── analytics/        # Componentes de analytics
│   ├── ui/               # Componentes UI base
│   └── layout/           # Componentes de layout
├── lib/                   # Bibliotecas e utilitários
│   ├── supabase/         # Configuração Supabase
│   ├── hooks/            # Custom React hooks
│   ├── services/         # Services (API calls)
│   ├── stores/           # Zustand stores
│   └── utils/            # Funções utilitárias
└── types/                 # TypeScript types
\`\`\`

## Integração com n8n

O sistema recebe dados do workflow n8n via webhook:

**Endpoint**: `POST /api/webhook`

**Payload**:
\`\`\`json
{
  "phone": "+5511999999999",
  "name": "João Silva",
  "message": "Olá, gostaria de informações",
  "timestamp": "2026-02-07T19:00:00Z",
  "agent_response": "Resposta do AI Agent",
  "tool_used": "recado",
  "media": {
    "type": "image",
    "url": "https://..."
  },
  "metadata": {}
}
\`\`\`

## Licença

Proprietary - Mercantil Santa Paula
