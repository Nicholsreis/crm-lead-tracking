# Guia de Integração n8n → CRM Lead Tracking

## 📋 Resumo

Este guia mostra como adicionar o webhook do CRM no seu workflow n8n "Mercantil Santa Paula - Atendimento Inicial".

## 🎯 Objetivo

Enviar automaticamente os dados de cada lead que conversa com o bot para o CRM, criando um registro no Supabase.

## 🔧 Passo a Passo

### 1. Abrir o Workflow

1. Acesse seu n8n: `https://n8n-n8n.hijn5u.easypanel.host/`
2. Abra o workflow: **"Mercantil Santa Paula - Atendimento Inicial"**

### 2. Adicionar Node HTTP Request

1. Localize o node **"AI Agent1"** (é o node que processa a resposta final do agente)
2. Clique no **+** após o "AI Agent1" para adicionar um novo node
3. Procure por **"HTTP Request"** e adicione

### 3. Configurar o HTTP Request

**Nome do Node:** `Enviar para CRM`

**Configurações:**

#### Method
- Selecione: **POST**

#### URL
- **Desenvolvimento (local):** `http://localhost:3000/api/webhook`
- **Produção (após deploy):** `https://seu-crm.vercel.app/api/webhook`

#### Authentication
- Selecione: **Header Auth**
- **Name:** `Authorization`
- **Value:** `Bearer U5tQR4j9wOGYAyCD7nviuZ1BLkTNb8dc`

#### Send Body
- Ative: **Yes**
- **Body Content Type:** JSON

#### JSON Body

Cole este código no campo JSON:

\`\`\`json
{
  "phone": "{{ $json.remoteJid ? $json.remoteJid.replace('@s.whatsapp.net', '') : '' }}",
  "name": "{{ $json.pushName || '' }}",
  "message": "{{ $json.message?.conversation || $json.message?.extendedTextMessage?.text || '' }}",
  "timestamp": "{{ new Date().toISOString() }}",
  "agent_response": "{{ $json.output || '' }}",
  "metadata": {
    "interest": "{{ $json.interest || '' }}",
    "source": "whatsapp"
  }
}
\`\`\`

### 4. Conectar os Nodes

1. **Desconecte** a conexão entre "AI Agent1" → "SplitMessages"
2. **Conecte** "AI Agent1" → "Enviar para CRM"
3. **Conecte** "Enviar para CRM" → "SplitMessages"

O fluxo deve ficar assim:
```
AI Agent1 → Enviar para CRM → SplitMessages → Loop Over Items2 → Send Message
```

### 5. Testar a Integração

1. **Salve** o workflow
2. **Ative** o workflow (se não estiver ativo)
3. Envie uma mensagem de teste no WhatsApp
4. Verifique:
   - ✅ O bot responde normalmente
   - ✅ No Supabase Dashboard, vá em **Table Editor** → **leads**
   - ✅ Você deve ver um novo lead criado com os dados da conversa

## 📊 Dados Enviados

O webhook envia os seguintes dados para o CRM:

| Campo | Descrição | Exemplo |
|-------|-----------|---------|
| `phone` | Telefone do lead (sem @s.whatsapp.net) | `+5511999999999` |
| `name` | Nome do contato no WhatsApp | `João Silva` |
| `message` | Última mensagem enviada pelo lead | `Olá, gostaria de informações` |
| `timestamp` | Data/hora da interação | `2026-02-07T19:00:00Z` |
| `agent_response` | Resposta do agente AI | `Olá! Como posso ajudar?` |
| `metadata.interest` | Interesse do lead (se disponível) | `Produtos de limpeza` |
| `metadata.source` | Origem do lead | `whatsapp` |

## 🔐 Segurança

- O token de autenticação (`U5tQR4j9wOGYAyCD7nviuZ1BLkTNb8dc`) está configurado no webhook
- Apenas requisições com este token serão aceitas
- **IMPORTANTE:** Após o deploy na Vercel, atualize a URL no node HTTP Request

## 🚀 Após Deploy na Vercel

Quando você fizer o deploy do CRM na Vercel:

1. Copie a URL de produção (ex: `https://crm-lead-tracking.vercel.app`)
2. No n8n, edite o node "Enviar para CRM"
3. Atualize a URL para: `https://crm-lead-tracking.vercel.app/api/webhook`
4. Salve o workflow

## 🐛 Troubleshooting

### Erro 401 (Unauthorized)
- Verifique se o token de autenticação está correto
- Deve ser exatamente: `Bearer U5tQR4j9wOGYAyCD7nviuZ1BLkTNb8dc`

### Erro 400 (Bad Request)
- Verifique se o JSON está formatado corretamente
- Certifique-se de que os campos obrigatórios estão presentes

### Erro 500 (Internal Server Error)
- Verifique se o servidor CRM está rodando
- Verifique os logs do servidor Next.js
- Verifique se o Supabase está configurado corretamente

### Lead não aparece no Supabase
- Verifique se o RLS (Row Level Security) está desabilitado nas tabelas
- Verifique os logs do servidor para ver se há erros
- Teste o webhook diretamente com o script `test-webhook.ps1`

## 📝 Notas

- O webhook cria automaticamente um lead se o telefone não existir
- Se o telefone já existir, atualiza o lead existente
- Todas as mensagens são armazenadas na tabela `messages`
- O histórico completo da conversa fica disponível no CRM

## ✅ Checklist de Integração

- [ ] Node HTTP Request adicionado
- [ ] URL configurada (localhost para testes)
- [ ] Token de autenticação configurado
- [ ] JSON Body configurado
- [ ] Conexões entre nodes ajustadas
- [ ] Workflow salvo e ativado
- [ ] Teste realizado com sucesso
- [ ] Lead aparece no Supabase
- [ ] Mensagens aparecem no Supabase

---

**Pronto!** Agora seu workflow n8n está integrado com o CRM e todos os leads serão automaticamente registrados no sistema. 🎉
