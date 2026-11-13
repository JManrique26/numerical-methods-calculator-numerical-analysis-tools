#!/bin/bash

# Auto-sync con GitHub
# Detecta cambios en archivos y sincroniza automáticamente
# Ejecuta en background: ./auto-sync.sh &

echo "🔄 Auto-sync iniciado - Monitoreando cambios..."

while true; do
    # Verificar si hay cambios
    if git diff --quiet && git diff --cached --quiet; then
        # No hay cambios, esperar
        sleep 5
    else
        # Hay cambios, sincronizar
        echo "📝 Cambios detectados, sincronizando..."
        
        git add .
        
        # Verificar si hay algo que commitear
        if ! git diff --cached --quiet; then
            git commit -m "Auto-sync: Automatic update
Generated with [Devin](https://devin.ai)

Co-Authored-By: Devin <158243242+devin-ai-integration[bot]@users.noreply.github.com>"
            
            git push
            echo "✅ Sincronización completada"
        fi
        
        sleep 5
    fi
done
