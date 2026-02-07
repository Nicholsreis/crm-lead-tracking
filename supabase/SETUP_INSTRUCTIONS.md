# Instruções de Setup do Supabase

## 1. Criar Projeto no Supabase

1. Acesse [https://supabase.com](https://supabase.com)
2. Crie uma nova conta ou faça login
3. Clique em "New Project"
4. Preencha:
   - **Name**: CRM Lead Tracking
   - **Database Password**: (escolha uma senha forte)
   - **Region**: escolha a região mais próxima
5. Aguarde a criação do projeto (pode levar alguns minutos)

## 2. Executar o Schema SQL

1. No painel do Supabase, vá em **SQL Editor** (menu lateral)
2. Clique em **New Query**
3. Copie todo o conteúdo do arquivo `schema.sql`
4. Cole no editor SQL
5. Clique em **Run** (ou pressione Ctrl+Enter)
6. Aguarde a execução completa
7. Verifique se não há erros no console

## 3. Obter Credenciais

1. No painel do Supabase, vá em **Settings** > **API**
2. Copie as seguintes informações:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...`

## 4. Configurar Variáveis de Ambiente

1. Abra o arquivo `.env.local` no projeto
2. Preencha com as credenciais:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
WEBHOOK_AUTH_TOKEN=seu_token_secreto_aqui
\`\`\`

3. Para o `WEBHOOK_AUTH_TOKEN`, gere um token seguro:
   - Você pode usar: `openssl rand -base64 32`
   - Ou gerar online: [https://generate-secret.vercel.app/32](https://generate-secret.vercel.app/32)

## 5. Habilitar Realtime (Opcional mas Recomendado)

1. No painel do Supabase, vá em **Database** > **Replication**
2. Habilite replicação para as tabelas:
   - `leads`
   - `messages`
   - `notifications`

## 6. Criar Primeiro Usuário (Para Testes)

1. No painel do Supabase, vá em **Authentication** > **Users**
2. Clique em **Add User**
3. Preencha:
   - **Email**: seu@email.com
   - **Password**: (escolha uma senha)
   - **Auto Confirm User**: ✅ (marque esta opção)
4. Clique em **Create User**

## 7. Verificar Instalação

Execute no SQL Editor para verificar se tudo foi criado:

\`\`\`sql
-- Verificar tabelas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('leads', 'messages', 'notes', 'lead_activities', 'notifications', 'tags');

-- Verificar RLS
SELECT tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';

-- Verificar tags predefinidas
SELECT * FROM tags;
\`\`\`

Você deve ver:
- ✅ 6 tabelas criadas
- ✅ Múltiplas policies RLS
- ✅ 6 tags predefinidas

## 8. Configurar Webhook no n8n

No seu workflow n8n "Mercantil Santa Paula - Atendimento Inicial":

1. Adicione um node **HTTP Request** no final do workflow
2. Configure:
   - **Method**: POST
   - **URL**: `https://seu-dominio.vercel.app/api/webhook`
   - **Authentication**: Header Auth
   - **Header Name**: `Authorization`
   - **Header Value**: `Bearer ${WEBHOOK_AUTH_TOKEN}`
   - **Body**: JSON com os dados do lead

Exemplo de payload:
\`\`\`json
{
  "phone": "{{ $json.phone }}",
  "name": "{{ $json.name }}",
  "message": "{{ $json.message }}",
  "timestamp": "{{ $now }}",
  "agent_response": "{{ $json.agent_response }}",
  "metadata": {}
}
\`\`\`

## Troubleshooting

### Erro: "relation does not exist"
- Certifique-se de que executou o schema.sql completo
- Verifique se está no schema correto (public)

### Erro: "permission denied"
- Verifique as RLS policies
- Certifique-se de que o usuário está autenticado

### Realtime não funciona
- Verifique se habilitou replicação nas tabelas
- Verifique se as tabelas estão na publicação `supabase_realtime`

### Webhook retorna 401
- Verifique se o token no n8n corresponde ao `.env.local`
- Certifique-se de usar `Bearer` antes do token

## Próximos Passos

Após configurar o Supabase:

1. Execute `npm run dev` para iniciar o projeto
2. Acesse `http://localhost:3000`
3. Faça login com o usuário criado
4. Teste enviando uma mensagem no WhatsApp
5. Verifique se o lead aparece no dashboard

## Suporte

Se encontrar problemas:
1. Verifique os logs do Supabase em **Logs** > **Postgres Logs**
2. Verifique os logs do Next.js no terminal
3. Consulte a documentação do Supabase: [https://supabase.com/docs](https://supabase.com/docs)
