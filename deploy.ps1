Write-Host "🚀 Iniciando deploy em produção..." -ForegroundColor Cyan

Write-Host "📥 1. Atualizando código (git pull)..." -ForegroundColor Yellow
git pull

Write-Host "🏗️ 2. Construindo containers..." -ForegroundColor Yellow
docker compose -f docker-compose.prod.yml build backend frontend

Write-Host "🔄 3. Subindo containers..." -ForegroundColor Yellow
docker compose -f docker-compose.prod.yml up -d

Write-Host "⏳ Aguardando o backend iniciar..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host "👑 4. Atualizando/Criando usuário admin seguro..." -ForegroundColor Yellow
docker compose -f docker-compose.prod.yml exec -T backend npm run prisma:create-admin

Write-Host "✅ Deploy concluído com sucesso!" -ForegroundColor Green
