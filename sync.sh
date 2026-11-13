#!/bin/bash

# Script de sincronización automática con GitHub
# Ejecuta: ./sync.sh
# Esto sincronizará cambios del local a GitHub automáticamente

echo "🔄 Sincronizando con GitHub..."

# Agregar todos los cambios
git add .

# Commit con mensaje automático
git commit -m "Auto-sync: Update project files
Generated with [Devin](https://devin.ai)

Co-Authored-By: Devin <158243242+devin-ai-integration[bot]@users.noreply.github.com>"

# Push a GitHub
git push

echo "✅ Sincronización completada"
