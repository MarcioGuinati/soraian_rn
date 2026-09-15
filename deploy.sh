#!/bin/bash

echo "🚀 Iniciando deploy em produção..."

echo "📥 1. Atualizando código (git pull)..."
git pull

echo "🏗️ 2. Construindo containers..."
docker compose -f docker-compose.prod.yml build backend frontend

echo "🔄 3. Subindo containers..."
docker compose -f docker-compose.prod.yml up -d

echo "⏳ Aguardando o backend iniciar..."
sleep 10

echo "👑 4. Atualizando/Criando usuário admin seguro..."
docker compose -f docker-compose.prod.yml exec -T backend npm run prisma:create-admin

echo "✅ Deploy concluído com sucesso!"
