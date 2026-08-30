#!/bin/bash
set -e

echo "Ensuring NPM network exists..."
docker network inspect npm_network >/dev/null 2>&1 || \
docker network create npm_network || true

echo "Extracting Staff AI v2 codebase..."
mkdir -p /root/staffai-v2
tar -xzf /root/staffai-app.tar.gz -C /root/staffai-v2

cd /root/staffai-v2

echo "Copying docker-compose.prod.yml..."
cp docker-compose.prod.yml docker-compose.yml

echo "Building and launching container..."
docker compose build
docker compose up -d

echo "Staff AI successfully deployed on port 3000 inside npm_network!"
