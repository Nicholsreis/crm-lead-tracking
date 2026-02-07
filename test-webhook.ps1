# Script PowerShell para testar o webhook do CRM

Write-Host "🧪 Testando webhook do CRM Lead Tracking..." -ForegroundColor Cyan
Write-Host ""

$body = @{
    phone = "+5511999999999"
    name = "João Silva"
    message = "Olá, gostaria de informações sobre produtos"
    timestamp = "2026-02-07T19:00:00Z"
    agent_response = "Olá João! Como posso ajudar?"
    metadata = @{
        interest = "Produtos de limpeza"
    }
} | ConvertTo-Json

$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer U5tQR4j9wOGYAyCD7nviuZ1BLkTNb8dc"
}

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/webhook" -Method Post -Headers $headers -Body $body
    Write-Host ""
    Write-Host "✅ Sucesso!" -ForegroundColor Green
    Write-Host "Resposta:" -ForegroundColor Yellow
    $response | ConvertTo-Json -Depth 10
    Write-Host ""
    Write-Host "Verifique o Supabase Dashboard para ver o lead criado." -ForegroundColor Cyan
} catch {
    Write-Host ""
    Write-Host "❌ Erro ao testar webhook:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}
