#!/bin/bash

# Script para testar o webhook do CRM

echo "🧪 Testando webhook do CRM Lead Tracking..."
echo ""

curl -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer U5tQR4j9wOGYAyCD7nviuZ1BLkTNb8dc" \
  -d '{
    "phone": "+5511999999999",
    "name": "João Silva",
    "message": "Olá, gostaria de informações sobre produtos",
    "timestamp": "2026-02-07T19:00:00Z",
    "agent_response": "Olá João! Como posso ajudar?",
    "metadata": {
      "interest": "Produtos de limpeza"
    }
  }'

echo ""
echo ""
echo "✅ Teste concluído!"
echo "Verifique o Supabase Dashboard para ver o lead criado."
