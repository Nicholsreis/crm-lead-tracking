# 🚀 Como Adicionar o Node CRM ao Workflow n8n

## 📋 Pré-requisitos

- ✅ Servidor dev do CRM rodando em `http://localhost:3000`
- ✅ Workflow n8n aberto: `Mercantil Santa Paula - Atendimento Inicial`
- ✅ Acesso ao n8n: `https://n8n-n8n.hijn5u.easypanel.host/`

---

## 🎯 Método 1: Adicionar Node Manualmente (Recomendado)

### Passo 1: Abrir o Workflow
1. Acesse: `https://n8n-n8n.hijn5u.easypanel.host/workflow/Hv0pI1kivHncHSUN`
2. Localize o node **"AI Agent1"**
3. Localize o node **"SplitMessages"**

### Passo 2: Adicionar o Node HTTP Request
1. Clique no **+** entre "AI Agent1" e "SplitMessages"
2. Busque por **"HTTP Request"**
3. Selecione o node

### Passo 3: Configurar o Node

#### Configurações Básicas
- **Nome do Node**: `Enviar Lead para CRM`
- **Method**: `POST`
- **URL**: `http://localhost:3000/api/webhook`

#### Autenticação
- **Authentication**: `None` (usaremos header manual)

#### Headers
Clique em **"Add Header"** e adicione:

**Header 1:**
- Name: `Authorization`
- Value: `Bearer U5tQR4j9wOGYAyCD7nviuZ1BLkTNb8dc`

**Header 2:**
- Name: `Content-Type`
- Value: `application/json`

#### Body
- **Send Body**: ✅ Ativado
- **Body Content Type**: `JSON`
- **Specify Body**: `Using JSON`

Cole este JSON no campo **"JSON"**:

```javascript
={{ {
  "phone": $json.remoteJid ? $json.remoteJid.replace('@s.whatsapp.net', '') : '',
  "name": $json.pushName || '',
  "message": $json.message?.conversation || $json.message?.extendedTextMessage?.text || '',
  "timestamp": new Date().toISOString(),
  "agent_response": $json.output || '',
  "metadata": {
    "interest": $json.interest || '',
    "source": "whatsapp"
  }
} }}
```

### Passo 4: Conectar os Nodes
1. **Desconecte**: AI Agent1 → SplitMessages
2. **Conecte**: AI Agent1 → Enviar Lead para CRM
3. **Conecte**: Enviar Lead para CRM → SplitMessages

### Passo 5: Salvar e Ativar
1. Clique em **"Save"** (canto superior direito)
2. Certifique-se que o workflow está **"Active"**

---

## 🎯 Método 2: Importar Node via JSON

### Passo 1: Copiar o JSON
Abra o arquivo: `crm-lead-tracking/n8n-crm-webhook-node-completo.json`

### Passo 2: Importar no n8n
1. No workflow, clique no menu **"..."** (três pontos)
2. Selecione **"Import from JSON"**
3. Cole o conteúdo do arquivo
4. Clique em **"Import"**

### Passo 3: Posicionar e Conectar
1. Arraste o node para a posição correta (entre AI Agent1 e SplitMessages)
2. Conecte os nodes conforme descrito no Método 1, Passo 4
3. Salve o workflow

---

## 🧪 Testar a Integração

### Teste 1: Enviar Mensagem de WhatsApp
1. Envie uma mensagem para o número do WhatsApp conectado ao n8n
2. Aguarde o AI Agent processar

### Teste 2: Verificar no Supabase
1. Abra seu projeto Supabase
2. Vá em **"Table Editor"** → **"leads"**
3. Verifique se um novo lead foi criado com:
   - ✅ Telefone correto
   - ✅ Nome capturado
   - ✅ Mensagem salva
   - ✅ Resposta do agente

### Teste 3: Verificar Logs do Servidor
No terminal onde o dev server está rodando, você deve ver:
```
POST /api/webhook 200 in 45ms
```

---

## 🔧 Troubleshooting

### ❌ Erro: "Connection refused"
**Problema**: Servidor dev não está rodando

**Solução**:
```bash
cd crm-lead-tracking
npm run dev
```

### ❌ Erro: "401 Unauthorized"
**Problema**: Token de autenticação incorreto

**Solução**: Verifique se o header Authorization está correto:
```
Bearer U5tQR4j9wOGYAyCD7nviuZ1BLkTNb8dc
```

### ❌ Erro: "400 Bad Request"
**Problema**: Dados do JSON estão incorretos

**Solução**: Verifique o mapeamento dos campos no JSON body. Os campos disponíveis do AI Agent são:
- `$json.remoteJid` - Número do WhatsApp
- `$json.pushName` - Nome do contato
- `$json.message.conversation` - Mensagem de texto
- `$json.output` - Resposta do AI Agent

### ❌ Lead não aparece no Supabase
**Problema**: RLS (Row Level Security) pode estar bloqueando

**Solução**: Execute o script de desabilitar RLS:
```sql
-- Arquivo: crm-lead-tracking/supabase/disable-rls-webhook.sql
ALTER TABLE leads DISABLE ROW LEVEL SECURITY;
```

---

## 📊 Mapeamento de Dados

### Dados do WhatsApp → CRM

| Campo WhatsApp | Campo CRM | Transformação |
|----------------|-----------|---------------|
| `remoteJid` | `phone` | Remove `@s.whatsapp.net` |
| `pushName` | `name` | Direto |
| `message.conversation` | `message` | Direto ou `extendedTextMessage.text` |
| `output` (AI Agent) | `agent_response` | Direto |
| - | `timestamp` | `new Date().toISOString()` |
| - | `metadata.source` | Fixo: `"whatsapp"` |

---

## 🎉 Próximos Passos

Após confirmar que a integração está funcionando:

1. **Deploy para Produção** (Tarefa 29)
   - Deploy do CRM no Vercel
   - Atualizar URL do webhook no n8n para produção

2. **Implementar Frontend** (Tarefas 8-28)
   - Dashboard para visualizar leads
   - Filtros e busca
   - Detalhes do lead
   - Analytics

3. **Monitoramento**
   - Configurar logs
   - Alertas de erro
   - Métricas de conversão

---

## 📁 Arquivos de Referência

- `n8n-crm-webhook-node-completo.json` - Configuração completa do node
- `N8N-INTEGRATION-GUIDE.md` - Guia detalhado de integração
- `N8N-INTEGRATION-NEXT-STEPS.md` - Próximos passos e opções
- `test-webhook.ps1` - Script para testar webhook manualmente

---

## 💬 Precisa de Ajuda?

Se encontrar problemas:
1. Verifique os logs do servidor dev
2. Verifique os logs de execução do workflow n8n
3. Teste o webhook manualmente com `test-webhook.ps1`
4. Me avise qual erro está aparecendo!

**Status Atual**: ⏳ Aguardando implementação manual do node
