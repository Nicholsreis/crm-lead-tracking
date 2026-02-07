-- Temporariamente desabilitar RLS para permitir webhook funcionar
-- ATENÇÃO: Isso é apenas para testes. Em produção, use políticas RLS adequadas.

-- Desabilitar RLS nas tabelas necessárias para o webhook
ALTER TABLE leads DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE lead_activities DISABLE ROW LEVEL SECURITY;

-- Nota: Você pode reabilitar depois com:
-- ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE lead_activities ENABLE ROW LEVEL SECURITY;
