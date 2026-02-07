# Guia de Testes - CRM Lead Tracking

## 🚀 Servidor Rodando

O servidor está rodando em: **http://localhost:3000**

## 🧪 Testar o Webhook

### Opção 1: PowerShell (Windows)

```powershell
.\test-webhook.ps1
```

### Opção 2: cURL (Manual)

```bash
curl -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer U5tQR4j9wOGYAyCD7nviuZ1BLkTNb8dc" \
  -d '{
    "phone": "+5511999999999",
    "name": "João Silva",
    "message": "Olá, gostaria de informações",
    "timestamp": "2026-02-07T19:00:00Z"
  }'
```

### Opção 3: Postman/Insomnia

**URL:** `POST http://localhost:3000/api/webhook`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer U5tQR4j9wOGYAyCD7nviuZ1BLkTNb8dc
```

**Body (JSON):**
```json
{
  "phone": "+5511999999999",
  "name": "João Silva",
  "message": "Olá, gostaria de informações sobre produtos",
  "timestamp": "2026-02-07T19:00:00Z",
  "agent_response": "Olá João! Como posso ajudar?",
  "metadata": {
    "interest": "Produtos de limpeza"
  }
}
```

## ✅ Resposta Esperada

```json
{
  "success": true,
  "data": {
    "lead_id": "uuid-aqui",
    "status": "novo"
  }
}
```

## 🔍 Verificar no Supabase

1. Acesse seu Supabase Dashboard
2. Vá em **Table Editor**
3. Selecione a tabela **leads**
4. Você deve ver o lead criado com:
   - phone: +5511999999999
   - name: João Silva
   - status: novo
   - source: whatsapp

5. Verifique também a tabela **messages** para ver as mensagens

## 🧪 Testar Outros Endpoints

### Listar Leads

```bash
# Você precisa estar autenticado no Supabase
curl http://localhost:3000/api/leads
```

### Exportar Leads (CSV)

```bash
curl http://localhost:3000/api/export?format=csv
```

### Exportar Leads (Excel)

```bash
curl http://localhost:3000/api/export?format=excel
```

## 🐛 Troubleshooting

### Erro 401 (Unauthorized)

- Verifique se o header `Authorization` está correto
- Token deve ser: `Bearer U5tQR4j9wOGYAyCD7nviuZ1BLkTNb8dc`

### Erro 400 (Bad Request)

- Verifique se o JSON está válido
- Campos obrigatórios: `phone`, `message`, `timestamp`
- Formato do timestamp: ISO 8601 (ex: `2026-02-07T19:00:00Z`)

### Erro 500 (Internal Server Error)

- Verifique se o Supabase está configurado corretamente no `.env.local`
- Verifique se o schema SQL foi executado
- Verifique os logs do servidor no terminal

## 📊 Monitorar Logs

Os logs do servidor aparecem no terminal onde você executou `npm run dev`.

Procure por:
- ✅ Sucesso: `POST /api/webhook 200`
- ❌ Erro: `Webhook error:` seguido da mensagem de erro

## 🔗 Integrar com n8n

Quando estiver pronto para integrar com o n8n:

1. No workflow "Mercantil Santa Paula - Atendimento Inicial"
2. Adicione um node **HTTP Request** no final
3. Configure:
   - **Method**: POST
   - **URL**: `https://seu-crm.vercel.app/api/webhook` (após deploy)
   - **Authentication**: Header Auth
   - **Header Name**: `Authorization`
   - **Header Value**: `Bearer U5tQR4j9wOGYAyCD7nviuZ1BLkTNb8dc`
   - **Body**: JSON com os dados do lead

## 🚀 Próximos Passos

1. ✅ Teste o webhook localmente
2. ✅ Verifique os dados no Supabase
3. ⏳ Aguarde implementação do frontend
4. ⏳ Deploy na Vercel
5. ⏳ Configure o n8n para usar a URL de produção
