# 🚀 Guia de Deploy - CRM Lead Tracking

## 📋 Pré-requisitos

- Conta na Vercel (https://vercel.com)
- Projeto Supabase configurado
- Token de autenticação do webhook n8n

---

## 🔧 Passo a Passo para Deploy na Vercel

### 1. Preparar o Repositório Git

Se ainda não tiver um repositório Git:

```bash
cd crm-lead-tracking
git init
git add .
git commit -m "Initial commit - CRM Lead Tracking"
```

Crie um repositório no GitHub/GitLab/Bitbucket e faça push:

```bash
git remote add origin <URL_DO_SEU_REPOSITORIO>
git branch -M main
git push -u origin main
```

---

### 2. Importar Projeto na Vercel

1. Acesse: https://vercel.com/new
2. Clique em "Import Git Repository"
3. Selecione seu repositório `crm-lead-tracking`
4. Clique em "Import"

---

### 3. Configurar Variáveis de Ambiente

Na página de configuração do projeto na Vercel, adicione as seguintes variáveis de ambiente:

#### Variáveis Obrigatórias:

| Nome | Valor |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://mnuhdqxktpducsngraay.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1udWhkcXhrdHBkdWNzbmdyYWF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMTY5MzEsImV4cCI6MjA4NTY5MjkzMX0.I79Zf8iiRdDdOWPYCrxLiTjIKLvRosUgD50Pf3-Gwzo` |
| `WEBHOOK_AUTH_TOKEN` | `U5tQR4j9wOGYAyCD7nviuZ1BLkTNb8dc` |
| `NODE_ENV` | `production` |

**Como adicionar:**
1. Na página do projeto na Vercel, vá em "Settings" → "Environment Variables"
2. Adicione cada variável acima
3. Selecione "Production", "Preview" e "Development" para cada uma

---

### 4. Deploy

1. Clique em "Deploy"
2. Aguarde o build completar (2-5 minutos)
3. Após o deploy, você receberá uma URL como: `https://crm-lead-tracking-xxx.vercel.app`

---

### 5. Atualizar URL no n8n

Após o deploy, você precisa atualizar a URL no node "Enviar Lead para CRM" no n8n:

1. Acesse: `https://n8n-n8n.hijn5u.easypanel.host/workflow/Hv0pI1kivHncHSUN`
2. Clique no node "Enviar Lead para CRM"
3. Altere a URL de:
   ```
   http://localhost:3000/api/webhook
   ```
   Para:
   ```
   https://SEU-PROJETO.vercel.app/api/webhook
   ```
4. Salve o workflow

---

## ✅ Verificar Deploy

### Teste 1: Acessar Homepage
Acesse: `https://SEU-PROJETO.vercel.app`

Você deve ver a homepage do CRM com status dos componentes.

### Teste 2: Testar Webhook
Execute o script de teste (atualize a URL primeiro):

```powershell
# Edite test-webhook.ps1 e altere a URL para:
# $url = "https://SEU-PROJETO.vercel.app/api/webhook"

.\test-webhook.ps1
```

### Teste 3: Testar Integração n8n
1. Envie uma mensagem de teste no WhatsApp
2. Verifique se o lead foi criado no Supabase
3. Verifique os logs na Vercel: Settings → Logs

---

## 🔄 Atualizações Futuras

Para fazer deploy de novas alterações:

```bash
git add .
git commit -m "Descrição das alterações"
git push
```

A Vercel fará o deploy automaticamente!

---

## 🐛 Troubleshooting

### Erro: "Build failed"
- Verifique os logs de build na Vercel
- Certifique-se que todas as dependências estão no `package.json`
- Execute `npm run build` localmente para testar

### Erro: "Environment variables not found"
- Verifique se todas as variáveis foram adicionadas na Vercel
- Certifique-se que selecionou "Production" ao adicionar

### Erro: "Cannot connect to Supabase"
- Verifique se as URLs e keys do Supabase estão corretas
- Teste a conexão localmente primeiro

### Webhook retorna 401
- Verifique se o `WEBHOOK_AUTH_TOKEN` está correto na Vercel
- Verifique se o header `Authorization` está sendo enviado no n8n

---

## 📊 Monitoramento

### Logs da Vercel:
- Acesse: Settings → Logs
- Veja requisições em tempo real

### Logs do Supabase:
- Acesse: https://supabase.com/dashboard/project/mnuhdqxktpducsngraay
- Vá em "Logs" → "API Logs"

---

## 🎉 Pronto!

Seu CRM está no ar e pronto para receber leads do n8n! 🚀

**Próximos passos:**
1. Implementar frontend (Dashboard, Analytics, etc.)
2. Configurar domínio customizado na Vercel
3. Adicionar monitoramento e alertas
