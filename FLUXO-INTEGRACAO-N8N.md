# 🔄 Fluxo de Integração n8n → CRM

## 📊 Diagrama do Fluxo Completo

```
┌─────────────────────────────────────────────────────────────────┐
│                    WORKFLOW N8N ATUAL                            │
└─────────────────────────────────────────────────────────────────┘

    📱 WhatsApp Message
         │
         ▼
    ┌─────────────┐
    │   Trigger   │ (Recebe mensagem)
    └──────┬──────┘
           │
           ▼
    ┌─────────────┐
    │ AI Agent1   │ (Processa com IA)
    └──────┬──────┘
           │
           │ ❌ ANTES: Ia direto para SplitMessages
           │
           ▼
    ┌─────────────────────────────────────┐
    │  🆕 Enviar Lead para CRM (NOVO!)   │
    │                                      │
    │  POST http://localhost:3000/api/    │
    │       webhook                        │
    │                                      │
    │  Headers:                            │
    │  - Authorization: Bearer TOKEN      │
    │  - Content-Type: application/json   │
    │                                      │
    │  Body:                               │
    │  {                                   │
    │    phone: "5511999999999",          │
    │    name: "João Silva",              │
    │    message: "Olá...",               │
    │    agent_response: "Resposta IA",   │
    │    metadata: {...}                  │
    │  }                                   │
    └──────┬──────────────────────────────┘
           │
           ▼
    ┌─────────────┐
    │Split        │ (Continua fluxo normal)
    │Messages     │
    └──────┬──────┘
           │
           ▼
    📤 Resposta WhatsApp


┌─────────────────────────────────────────────────────────────────┐
│                    SERVIDOR CRM (Next.js)                        │
└─────────────────────────────────────────────────────────────────┘

    🌐 http://localhost:3000/api/webhook
         │
         ▼
    ┌─────────────────────┐
    │  1. Validar Token   │ ✅ Bearer U5tQR4j9wOGYAyCD7nviuZ1BLkTNb8dc
    └──────┬──────────────┘
           │
           ▼
    ┌─────────────────────┐
    │  2. Validar Dados   │ ✅ phone, name, message obrigatórios
    └──────┬──────────────┘
           │
           ▼
    ┌─────────────────────┐
    │  3. Criar Lead      │ 💾 INSERT INTO leads
    │     no Supabase     │
    └──────┬──────────────┘
           │
           ▼
    ┌─────────────────────┐
    │  4. Retornar 200    │ ✅ { success: true, lead_id: "..." }
    └─────────────────────┘


┌─────────────────────────────────────────────────────────────────┐
│                         SUPABASE                                 │
└─────────────────────────────────────────────────────────────────┘

    📊 Tabela: leads
    
    ┌──────────────────────────────────────────────────────────┐
    │ id (uuid)                                                 │
    │ phone (text)          → "5511999999999"                  │
    │ name (text)           → "João Silva"                     │
    │ message (text)        → "Olá, gostaria de informações"  │
    │ agent_response (text) → "Olá João! Como posso ajudar?"  │
    │ status (text)         → "new"                            │
    │ metadata (jsonb)      → {"interest": "...", ...}         │
    │ created_at (timestamp)→ "2024-02-07T10:30:00Z"          │
    └──────────────────────────────────────────────────────────┘
```

---

## 🎯 Pontos de Integração

### 1️⃣ Entrada de Dados (n8n → CRM)

**Origem**: Output do node "AI Agent1"
```javascript
{
  remoteJid: "5511999999999@s.whatsapp.net",
  pushName: "João Silva",
  message: {
    conversation: "Olá, gostaria de informações"
  },
  output: "Olá João! Como posso ajudar?"
}
```

**Transformação**: Node HTTP Request
```javascript
{
  phone: "5511999999999",           // Remove @s.whatsapp.net
  name: "João Silva",                // Direto
  message: "Olá, gostaria...",      // Extrai do objeto
  timestamp: "2024-02-07T10:30:00Z", // Gera novo
  agent_response: "Olá João!...",    // Direto
  metadata: {
    interest: "",
    source: "whatsapp"
  }
}
```

### 2️⃣ Processamento (CRM)

**Validações**:
- ✅ Token Bearer válido
- ✅ Campos obrigatórios presentes
- ✅ Formato de telefone válido
- ✅ Conexão com Supabase OK

**Ações**:
1. Criar registro na tabela `leads`
2. Gerar UUID único
3. Definir status inicial como "new"
4. Salvar timestamp de criação

### 3️⃣ Resposta (CRM → n8n)

**Sucesso (200)**:
```json
{
  "success": true,
  "lead": {
    "id": "0feab428-ff29-4110-a270-81fa6ac11841",
    "phone": "5511999999999",
    "name": "João Silva",
    "status": "new",
    "created_at": "2024-02-07T10:30:00Z"
  }
}
```

**Erro (400/401/500)**:
```json
{
  "error": "Invalid authentication token",
  "details": "Bearer token is missing or invalid"
}
```

---

## 🔐 Segurança

### Autenticação
- **Método**: Bearer Token
- **Token**: `U5tQR4j9wOGYAyCD7nviuZ1BLkTNb8dc`
- **Header**: `Authorization: Bearer TOKEN`

### Validações
1. ✅ Token presente e válido
2. ✅ Campos obrigatórios (phone, name, message)
3. ✅ Formato de dados correto
4. ✅ Rate limiting (futuro)

---

## 📈 Monitoramento

### Logs do n8n
```
✅ Node "Enviar Lead para CRM" executado
📤 POST http://localhost:3000/api/webhook
✅ Status: 200 OK
⏱️ Tempo: 45ms
```

### Logs do CRM (Terminal)
```
POST /api/webhook 200 in 45ms
✅ Lead criado: 0feab428-ff29-4110-a270-81fa6ac11841
```

### Supabase (Table Editor)
```
📊 Nova linha na tabela "leads"
🆔 ID: 0feab428-ff29-4110-a270-81fa6ac11841
📱 Phone: 5511999999999
👤 Name: João Silva
```

---

## 🚨 Tratamento de Erros

### Erro 401: Unauthorized
```
Causa: Token inválido ou ausente
Solução: Verificar header Authorization
```

### Erro 400: Bad Request
```
Causa: Dados inválidos ou campos faltando
Solução: Verificar mapeamento do JSON body
```

### Erro 500: Internal Server Error
```
Causa: Erro no servidor (Supabase, etc)
Solução: Verificar logs do servidor e conexão Supabase
```

### Erro ECONNREFUSED
```
Causa: Servidor dev não está rodando
Solução: Executar "npm run dev" no terminal
```

---

## ✅ Checklist de Implementação

- [ ] 1. Servidor dev rodando (`npm run dev`)
- [ ] 2. Supabase configurado e acessível
- [ ] 3. RLS desabilitado para webhook
- [ ] 4. Node HTTP Request adicionado no n8n
- [ ] 5. Headers configurados (Authorization + Content-Type)
- [ ] 6. Body JSON configurado com mapeamento correto
- [ ] 7. Conexões: AI Agent1 → CRM → SplitMessages
- [ ] 8. Workflow salvo e ativo
- [ ] 9. Teste enviado via WhatsApp
- [ ] 10. Lead verificado no Supabase

---

## 🎉 Resultado Final

Quando tudo estiver funcionando:

1. ✅ Mensagem chega no WhatsApp
2. ✅ AI Agent processa e responde
3. ✅ **Lead é automaticamente criado no CRM**
4. ✅ Resposta é enviada de volta ao WhatsApp
5. ✅ Lead fica disponível no Supabase para consulta

**Próximo passo**: Implementar o frontend para visualizar e gerenciar os leads! 🚀
