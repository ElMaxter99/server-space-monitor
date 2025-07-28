#!/bin/bash

echo "🚀 Parando y eliminando contenedores..."
docker-compose down

echo "🏗️ Reconstruyendo imágenes..."
docker-compose build

echo "▶️ Arrancando contenedores..."
docker-compose up -d

echo "✅ ¡Todo listo!"
