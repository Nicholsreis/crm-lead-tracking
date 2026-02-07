# 📥 Como Importar o Node CRM no n8n

## 🎯 Método Rápido: Importar JSON

### Passo 1: Copiar o JSON
Abra o arquivo: **`node-simples-importar.json`** e copie todo o conteúdo.

### Passo 2: Abrir o Workflow no n8n
1. Acesse: `https://n8n-n8n.hijn5u.easypanel.host/workflow/Hv0pI1kivHncHSUN`
2. Certifique-se que o workflow está aberto no editor

### Passo 3: Importar o Node
**IMPORTANTE**: Use o método "Import from URL or File" para importar apenas o node:

1. Clique no menu **"..."** (três pontos) no canto superior direito
2. Selecione **"Import from URL or File"**
3. Cole o JSON copiado na área de texto
4. Clique em **"Import"**

**OU** use o método de arrastar:

1. No canvas do workflow, clique com botão direito
2. Selecione **"Add node"** → **"HTTP Request"**
3. Configure manualmente usando os valores do JSON (veja seção "Verificar Configuração" abaixo)

### Passo 4: Posicionar o Node
1. O node **"Enviar Lead para CRM"** aparecerá no canvas
2. Arraste-o para a posição entre **"AI Agent1"** e **"SplitMessages"**

### Passo 5: Conectar os Nodes
1. **Remova** a conexão existente: `AI Agent1` → `SplitMessages`
2. **Conecte**: `AI Agent1` → `Enviar Lead para CRM`
3. **Conecte**: `Enviar Lead para CRM` → `SplitMessages`

### Passo 6: Salvar e Ativar
1. Clique em **"Save"** (canto superior direito)
2. Certifique-se que o workflow está **"Active"**

---

## 🔧 Método Alternativo: Criar Node Manualmente

Se a importação não funcionar, crie o node manualmente:

### 1. Adicionar HTTP Request Node
1. No canvas do workflow, clique no botão **"+"** ou clique com botão direito
2. Busque por **"HTTP Request"**
3. Clique para adicionar o node
4. Renomeie para **"Enviar Lead para CRM"**

### 2. Configurar o Node
Copie e cole cada configuração do arquivo **`n8n-node-config-copiar-colar.txt`**:

**Method**: `POST`

**URL**: `http://localhost:3000/api/webhook`

**Authentication**: `None`

**Send Headers**: `ON` (ativado)

**Headers**:
- Header 1: `Authorization` = `Bearer U5tQR4j9wOGYAyCD7nviuZ1BLkTNb8dc`
- Header 2: `Content-Type` = `application/json`

**Send Body**: `ON` (ativado)

**Body Content Type**: `JSON`

**JSON Body**: Cole o código do arquivo `n8n-node-config-copiar-colar.txt`

### 3. Conectar e Salvar
1. Conecte: `AI Agent1` → `Enviar Lead para CRM` → `SplitMessages`
2. Salve o workflow

---

## ✅ Verificar Configuração

Após importar, clique no node **"Enviar Lead para CRM"** e verifique:

### URL
```
http://localhost:3000/api/webhook
```

### Method
```
POST
```

### Headers
```
Authorization: Bearer U5tQR4j9wOGYAyCD7nviuZ1BLkTNb8dc
Content-Type: application/json
```

### Body (JSON)
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

---

## 🧪 Testar a Integração

### Teste 1: Executar o Workflow Manualmente
1. No n8n, clique em **"Execute Workflow"**
2. Verifique se o node **"Enviar Lead para CRM"** executa sem erros
3. Veja o output do node

### Teste 2: Enviar Mensagem Real no WhatsApp
1. Envie uma mensagem para o número conectado ao n8n
2. Aguarde o AI Agent processar
3. Verifique se o lead foi criado no Supabase

### Teste 3: Verificar no Supabase
1. Abra seu projeto Supabase
2. Vá em **"Table Editor"** → **"leads"**
3. Procure pelo lead mais recente
4. Verifique os dados:
   - ✅ Telefone
   - ✅ Nome
   - ✅ Mensagem
   - ✅ Resposta do agente
   - ✅ Timestamp

---

## 🔧 Troubleshooting

### ❌ Importação não funciona
**Causa**: n8n pode não aceitar importação de nodes individuais em workflows existentes

**Solução**: Use o **Método Alternativo** (criar node manualmente):
1. Adicione um node **HTTP Request** manualmente
2. Configure usando os valores do arquivo `n8n-node-config-copiar-colar.txt`
3. Conecte entre AI Agent1 e SplitMessages

### ❌ Erro: "ECONNREFUSED"
**Causa**: Servidor CRM não está rodando

**Solução**:
```bash
cd crm-lead-tracking
npm run dev
```

Verifique se aparece: `✓ Ready on http://localhost:3000`

### ❌ Erro: "401 Unauthorized"
**Causa**: Token de autenticação incorreto

**Solução**: Verifique se o header Authorization está correto:
```
Bearer U5tQR4j9wOGYAyCD7nviuZ1BLkTNb8dc
```

### ❌ Erro: "400 Bad Request"
**Causa**: Dados do JSON estão incorretos ou campos faltando

**Solução**: Verifique o mapeamento dos campos no JSON body. Os campos obrigatórios são:
- `phone` (string)
- `name` (string)
- `message` (string)

### ❌ Erro: "Cannot read property 'replace' of undefined"
**Causa**: Dados do WhatsApp não estão no formato esperado

**Solução**: Verifique se o node anterior (AI Agent1) está enviando os dados corretos:
- `$json.remoteJid` deve existir
- `$json.pushName` deve existir
- `$json.message` deve existir

---

## 📊 Fluxo Esperado

```
WhatsApp Message
    ↓
Trigger (n8n)
    ↓
AI Agent1 (Processa)
    ↓
🆕 Enviar Lead para CRM (NOVO!)
    ↓
SplitMessages
    ↓
Resposta WhatsApp
```

---

## 🎉 Sucesso!

Quando tudo estiver funcionando, você verá:

1. ✅ Mensagem chega no WhatsApp
2. ✅ AI Agent processa
3. ✅ **Lead é criado automaticamente no CRM**
4. ✅ Resposta é enviada ao WhatsApp
5. ✅ Lead aparece no Supabase

---

## 📁 Arquivos de Referência

- `node-crm-webhook-importar.json` - JSON para importar
- `n8n-crm-webhook-node-completo.json` - Configuração completa
- `n8n-node-config-copiar-colar.txt` - Configurações em texto
- `COMO-ADICIONAR-NODE-N8N.md` - Guia completo passo a passo
- `FLUXO-INTEGRACAO-N8N.md` - Diagrama visual do fluxo

---

## 🚀 Próximos Passos

Após confirmar que a integração está funcionando:

1. **Implementar Frontend** (Tarefas 8-28)
   - Dashboard para visualizar leads
   - Filtros e busca
   - Detalhes do lead
   - Analytics

2. **Deploy para Produção** (Tarefa 29)
   - Deploy no Vercel
   - Atualizar URL do webhook no n8n

3. **Monitoramento**
   - Configurar logs
   - Alertas de erro
   - Métricas de conversão

---

**Status Atual**: ⏳ Pronto para importar o node no n8n

**Arquivo para usar**: `node-crm-webhook-importar.json`
