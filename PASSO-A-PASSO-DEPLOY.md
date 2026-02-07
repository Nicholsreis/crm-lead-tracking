# 🚀 Passo a Passo Completo - Deploy CRM na Vercel

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter:
- ✅ Git instalado (teste: `git --version`)
- ✅ Conta no GitHub (https://github.com)
- ✅ Conta na Vercel (https://vercel.com)

---

## PARTE 1: CRIAR REPOSITÓRIO NO GITHUB

### Passo 1.1: Criar Repositório no GitHub

1. Acesse: https://github.com/new
2. Preencha:
   - **Repository name:** `crm-lead-tracking`
   - **Description:** `CRM Lead Tracking - Sistema de gestão de leads integrado com n8n`
   - **Visibility:** Private (recomendado) ou Public
   - ❌ **NÃO** marque "Add a README file"
   - ❌ **NÃO** adicione .gitignore
   - ❌ **NÃO** escolha uma licença
3. Clique em **"Create repository"**
4. **IMPORTANTE:** Copie a URL que aparece (algo como: `https://github.com/SEU-USUARIO/crm-lead-tracking.git`)

---

## PARTE 2: CONFIGURAR GIT LOCAL

### Passo 2.1: Abrir Terminal na Pasta do Projeto

**Windows (PowerShell):**
```powershell
cd C:\Users\operador\Downloads\teste\crm-lead-tracking
```

### Passo 2.2: Verificar se Git está Instalado

```bash
git --version
```

Se aparecer algo como `git version 2.x.x`, está OK! ✅

Se não estiver instalado, baixe em: https://git-scm.com/download/win

### Passo 2.3: Configurar Git (se for primeira vez)

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu-email@exemplo.com"
```

**Exemplo:**
```bash
git config --global user.name "João Silva"
git config --global user.email "joao@exemplo.com"
```

---

## PARTE 3: INICIALIZAR REPOSITÓRIO LOCAL

### Passo 3.1: Inicializar Git

```bash
git init
```

Você verá: `Initialized empty Git repository in ...`

### Passo 3.2: Adicionar Todos os Arquivos

```bash
git add .
```

### Passo 3.3: Fazer o Primeiro Commit

```bash
git commit -m "Initial commit - CRM Lead Tracking Backend"
```

### Passo 3.4: Renomear Branch para 'main'

```bash
git branch -M main
```

### Passo 3.5: Conectar ao Repositório Remoto

**IMPORTANTE:** Substitua `SEU-USUARIO` pelo seu usuário do GitHub!

```bash
git remote add origin https://github.com/SEU-USUARIO/crm-lead-tracking.git
```

**Exemplo:**
```bash
git remote add origin https://github.com/joaosilva/crm-lead-tracking.git
```

### Passo 3.6: Enviar Código para o GitHub

```bash
git push -u origin main
```

**Se pedir autenticação:**
- **Username:** Seu usuário do GitHub
- **Password:** Use um Personal Access Token (não a senha)
  - Crie em: https://github.com/settings/tokens
  - Selecione: `repo` (Full control of private repositories)
  - Copie o token e use como senha

---

## PARTE 4: DEPLOY NA VERCEL

### Passo 4.1: Acessar Vercel

1. Acesse: https://vercel.com
2. Clique em **"Sign Up"** ou **"Log In"**
3. **Recomendado:** Faça login com sua conta do GitHub

### Passo 4.2: Importar Projeto

1. No dashboard da Vercel, clique em **"Add New..."** → **"Project"**
2. Você verá uma lista dos seus repositórios do GitHub
3. Encontre **`crm-lead-tracking`**
4. Clique em **"Import"**

### Passo 4.3: Configurar Projeto

Na tela de configuração:

1. **Project Name:** `crm-lead-tracking` (ou escolha outro)
2. **Framework Preset:** Next.js (deve detectar automaticamente)
3. **Root Directory:** `./` (deixe como está)
4. **Build Command:** `npm run build` (já está configurado)
5. **Output Directory:** `.next` (já está configurado)

### Passo 4.4: Adicionar Variáveis de Ambiente

**MUITO IMPORTANTE:** Clique em **"Environment Variables"** e adicione:

#### Variável 1:
- **Name:** `NEXT_PUBLIC_SUPABASE_URL`
- **Value:** `https://mnuhdqxktpducsngraay.supabase.co`
- Marque: ✅ Production, ✅ Preview, ✅ Development

#### Variável 2:
- **Name:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1udWhkcXhrdHBkdWNzbmdyYWF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMTY5MzEsImV4cCI6MjA4NTY5MjkzMX0.I79Zf8iiRdDdOWPYCrxLiTjIKLvRosUgD50Pf3-Gwzo`
- Marque: ✅ Production, ✅ Preview, ✅ Development

#### Variável 3:
- **Name:** `WEBHOOK_AUTH_TOKEN`
- **Value:** `U5tQR4j9wOGYAyCD7nviuZ1BLkTNb8dc`
- Marque: ✅ Production, ✅ Preview, ✅ Development

#### Variável 4:
- **Name:** `NODE_ENV`
- **Value:** `production`
- Marque: ✅ Production

### Passo 4.5: Fazer Deploy

1. Clique em **"Deploy"**
2. Aguarde o build (2-5 minutos)
3. Você verá uma animação de progresso
4. Quando terminar, aparecerá: **"Congratulations! 🎉"**

### Passo 4.6: Copiar URL do Deploy

Após o deploy, você verá uma URL como:
```
https://crm-lead-tracking-xxx.vercel.app
```

**COPIE ESSA URL!** Você vai precisar dela no próximo passo.

---

## PARTE 5: ATUALIZAR N8N COM A NOVA URL

### Passo 5.1: Acessar Workflow no n8n

1. Acesse: `https://n8n-n8n.hijn5u.easypanel.host/workflow/Hv0pI1kivHncHSUN`
2. Faça login se necessário

### Passo 5.2: Editar Node "Enviar Lead para CRM"

1. Localize o node **"Enviar Lead para CRM"** no canvas
2. Clique nele para abrir as configurações
3. No campo **"URL"**, altere de:
   ```
   http://localhost:3000/api/webhook
   ```
   Para:
   ```
   https://SUA-URL-DA-VERCEL.vercel.app/api/webhook
   ```
   
   **Exemplo:**
   ```
   https://crm-lead-tracking-abc123.vercel.app/api/webhook
   ```

4. Clique em **"Save"** (canto superior direito)

### Passo 5.3: Ativar Workflow

1. Certifique-se que o toggle **"Active"** está ligado (verde)
2. Se não estiver, clique nele para ativar

---

## PARTE 6: TESTAR A INTEGRAÇÃO

### Teste 1: Acessar Homepage do CRM

1. Abra no navegador: `https://SUA-URL-DA-VERCEL.vercel.app`
2. Você deve ver a homepage com status dos componentes
3. Deve aparecer: ✅ API Routes, ✅ Webhook, ✅ Supabase, ✅ Services

### Teste 2: Testar Webhook Diretamente

Abra o PowerShell e execute:

```powershell
$url = "https://SUA-URL-DA-VERCEL.vercel.app/api/webhook"
$headers = @{
    "Authorization" = "Bearer U5tQR4j9wOGYAyCD7nviuZ1BLkTNb8dc"
    "Content-Type" = "application/json"
}
$body = @{
    phone = "5511999999999"
    name = "Teste Deploy"
    message = "Testando integração após deploy"
    timestamp = (Get-Date).ToString("o")
    agent_response = "Resposta de teste"
    metadata = @{
        interest = "teste"
        source = "whatsapp"
    }
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri $url -Method Post -Headers $headers -Body $body
$response | ConvertTo-Json -Depth 10
```

**Resultado esperado:**
```json
{
  "success": true,
  "data": {
    "lead_id": "uuid-aqui",
    "status": "novo"
  }
}
```

### Teste 3: Testar via WhatsApp (Teste Real)

1. Envie uma mensagem de teste para o número conectado ao n8n
2. Aguarde o AI Agent processar
3. Verifique se o lead foi criado no Supabase:
   - Acesse: https://supabase.com/dashboard/project/mnuhdqxktpducsngraay
   - Vá em: **Table Editor** → **leads**
   - Procure pelo lead mais recente

---

## ✅ CHECKLIST FINAL

Marque cada item conforme completar:

- [ ] Repositório criado no GitHub
- [ ] Git configurado localmente
- [ ] Código enviado para o GitHub (`git push`)
- [ ] Projeto importado na Vercel
- [ ] Variáveis de ambiente configuradas na Vercel
- [ ] Deploy realizado com sucesso
- [ ] URL da Vercel copiada
- [ ] URL atualizada no n8n (node "Enviar Lead para CRM")
- [ ] Workflow ativado no n8n
- [ ] Homepage do CRM acessível
- [ ] Webhook testado e funcionando
- [ ] Lead criado com sucesso no Supabase

---

## 🎉 PARABÉNS!

Se todos os testes passaram, sua integração está funcionando! 🚀

**O que acontece agora:**
1. Mensagem chega no WhatsApp
2. n8n processa com AI Agent
3. **Lead é enviado automaticamente para o CRM na Vercel**
4. Lead é salvo no Supabase
5. Resposta é enviada ao WhatsApp

---

## 🔄 ATUALIZAÇÕES FUTURAS

Quando fizer alterações no código:

```bash
# 1. Adicionar alterações
git add .

# 2. Fazer commit
git commit -m "Descrição das alterações"

# 3. Enviar para GitHub
git push

# 4. Vercel faz deploy automaticamente!
```

---

## 🆘 PROBLEMAS COMUNS

### Erro: "git: command not found"
**Solução:** Instale o Git: https://git-scm.com/download/win

### Erro: "Permission denied (publickey)"
**Solução:** Use HTTPS em vez de SSH, ou configure SSH keys

### Erro: "Build failed" na Vercel
**Solução:** 
1. Verifique os logs na Vercel
2. Certifique-se que todas as variáveis de ambiente foram adicionadas
3. Execute `npm run build` localmente para testar

### Erro: "401 Unauthorized" no webhook
**Solução:** Verifique se o `WEBHOOK_AUTH_TOKEN` está correto na Vercel

### Erro: "Cannot connect to Supabase"
**Solução:** Verifique se as variáveis `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` estão corretas

---

## 📞 SUPORTE

Se tiver problemas:
1. Verifique os logs na Vercel: Settings → Logs
2. Verifique os logs do Supabase
3. Teste o webhook localmente primeiro
4. Verifique se todas as variáveis de ambiente estão corretas

---

**Tempo estimado total:** 15-20 minutos ⏱️

**Dificuldade:** Intermediária 🟡
