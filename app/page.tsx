export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🎯 CRM Lead Tracking
          </h1>
          <p className="text-gray-600">
            Sistema de rastreamento de leads em tempo real
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
            <div className="flex items-center mb-3">
              <span className="text-3xl mr-3">✅</span>
              <h2 className="text-xl font-semibold text-green-900">Backend Pronto</h2>
            </div>
            <ul className="space-y-2 text-sm text-green-800">
              <li>• API Routes configuradas</li>
              <li>• Webhook n8n funcionando</li>
              <li>• Supabase conectado</li>
              <li>• Services implementados</li>
            </ul>
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
            <div className="flex items-center mb-3">
              <span className="text-3xl mr-3">🚀</span>
              <h2 className="text-xl font-semibold text-blue-900">Endpoints</h2>
            </div>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• POST /api/webhook</li>
              <li>• GET /api/leads</li>
              <li>• GET /api/export</li>
              <li>• GET /api/notifications</li>
            </ul>
          </div>
        </div>

        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-yellow-900 mb-3">
            🧪 Testar Webhook
          </h3>
          <p className="text-sm text-yellow-800 mb-4">
            Use este comando para testar o webhook localmente:
          </p>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs overflow-x-auto">
            <code>
              curl -X POST http://localhost:3000/api/webhook \<br />
              &nbsp;&nbsp;-H "Content-Type: application/json" \<br />
              &nbsp;&nbsp;-H "Authorization: Bearer U5tQR4j9wOGYAyCD7nviuZ1BLkTNb8dc" \<br />
              &nbsp;&nbsp;-d '{`{`}<br />
              &nbsp;&nbsp;&nbsp;&nbsp;"phone": "+5511999999999",<br />
              &nbsp;&nbsp;&nbsp;&nbsp;"name": "João Silva",<br />
              &nbsp;&nbsp;&nbsp;&nbsp;"message": "Olá, gostaria de informações",<br />
              &nbsp;&nbsp;&nbsp;&nbsp;"timestamp": "2026-02-07T19:00:00Z"<br />
              &nbsp;&nbsp;{`}`}'
            </code>
          </div>
        </div>

        <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-purple-900 mb-3">
            📋 Próximos Passos
          </h3>
          <ol className="space-y-2 text-sm text-purple-800">
            <li>1. Teste o webhook com o comando acima</li>
            <li>2. Verifique os dados no Supabase Dashboard</li>
            <li>3. Configure o n8n para enviar dados para o webhook</li>
            <li>4. Aguarde a implementação do frontend (dashboard, lista de leads, etc.)</li>
          </ol>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Desenvolvido para Mercantil Santa Paula • v0.1.0
          </p>
        </div>
      </div>
    </div>
  )
}
