# 🚀 Guia Rápido: Adicionar Node CRM no n8n

## ⚡ Método Mais Simples (Recomendado)

### 1️⃣ Adicionar Node HTTP Request
No workflow n8n:
- Clique no **"+"** entre **AI Agent1** e **SplitMessages**
- Busque: **"HTTP Request"**
- Adicione o node

### 2️⃣ Configurar (copie e cole cada campo)

**Nome do Node**:
```
Enviar Lead para CRM
```

**Method**:
```
POST
```

**URL**:
```
http://localhost:3000/api/webhook
```

**Authentication**:
```
None
```

**Send Headers**: ✅ Ativar

**Header 1**:
- Name: `Authorization`
- Value: `Bearer U5tQR4j9wOGYAyCD7nviuZ1BLkTNb8dc`

**Header 2**:
- Name: `Content-Type`
- Value: `application/json`

**Send Body**: ✅ Ativar

**Body Content Type**: `JSON`

**JSON Body** (copie tudo):
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

### 3️⃣ Conectar
```
AI Agent1 → Enviar Lead para CRM → SplitMessages
```

### 4️⃣ Salvar
Clique em **"Save"** no canto superior direito

---

## ✅ Testar

### Teste Rápido no n8n:
1. Clique em **"Execute Workflow"**
2. Veja se o node executa sem erros

### Teste Real:
1. Envie mensagem no WhatsApp
2. Verifique se lead aparece no Supabase

---

## 🆘 Problemas?

### Node dá erro ao executar?
- ✅ Servidor CRM está rodando? (`npm run dev` na pasta `crm-lead-tracking`)
- ✅ URL está correta? (`http://localhost:3000/api/webhook`)
- ✅ Token está correto? (`Bearer U5tQR4j9wOGYAyCD7nviuZ1BLkTNb8dc`)

### Lead não aparece no Supabase?
- ✅ Verifique os logs do servidor CRM
- ✅ Teste o webhook diretamente: `.\test-webhook.ps1`
- ✅ Verifique se o Supabase está configurado corretamente

---

## 📁 Arquivos de Ajuda

- `IMPORTAR-NODE-N8N.md` - Guia completo detalhado
- `n8n-node-config-copiar-colar.txt` - Todas as configurações em texto
- `test-webhook.ps1` - Script para testar o webhook

---

**Tempo estimado**: 5 minutos ⏱️

**Dificuldade**: Fácil 🟢
