#!/bin/bash

# Script de preparación para despliegue
# Calculadora de Análisis Numérico

echo "🚀 Preparando Calculadora de Análisis Numérico para despliegue..."
echo ""

# Verificar que Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js no está instalado"
    echo "   Instala Node.js desde https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js instalado: $(node --version)"
echo ""

# Verificar que npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm no está instalado"
    exit 1
fi

echo "✅ npm instalado: $(npm --version)"
echo ""

# Crear carpeta de assets si no existe
if [ ! -d "assets" ]; then
    echo "📁 Creando carpeta assets/..."
    mkdir -p assets
    echo "⚠️  ADVERTENCIA: Necesitas agregar iconos a assets/"
    echo "   - icon.png (512x512 para Linux)"
    echo "   - icon.ico (256x256 para Windows)"
    echo "   - icon.icns (para macOS)"
    echo ""
fi

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install
echo ""

# Ejecutar pruebas
echo "🧪 Ejecutando pruebas E2E..."
npm test
TEST_RESULT=$?

if [ $TEST_RESULT -eq 0 ]; then
    echo "✅ Todas las pruebas pasaron"
else
    echo "❌ Algunas pruebas fallaron"
    echo "   Revisa el reporte con: npx playwright show-report"
    read -p "¿Continuar con el despliegue? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi
echo ""

# Preguntar qué despliegue preparar
echo "🎯 ¿Qué deseas preparar?"
echo "1) Subir a internet (GitHub Pages/Netlify/Vercel)"
echo "2) Crear archivo .exe (Electron)"
echo "3) Ambos"
read -p "Selecciona una opción (1/2/3): " choice

case $choice in
    1)
        echo ""
        echo "📝 Preparando para subir a internet..."
        echo ""
        echo "Pasos a seguir:"
        echo "1. Crea un repositorio en GitHub"
        echo "2. Ejecuta: git init"
        echo "3. Ejecuta: git add ."
        echo "4. Ejecuta: git commit -m 'Initial commit'"
        echo "5. Ejecuta: git remote add origin <tu-repositorio>"
        echo "6. Ejecuta: git push -u origin main"
        echo "7. Configura GitHub Pages en Settings → Pages"
        echo ""
        echo "O usa Netlify/Vercel importando el repositorio de GitHub"
        echo ""
        echo "✅ Listo para subir a internet"
        ;;
    2)
        echo ""
        echo "💻 Preparando archivo .exe..."
        echo ""
        echo "Verificando iconos..."
        if [ ! -f "assets/icon.ico" ]; then
            echo "⚠️  ADVERTENCIA: No se encontró assets/icon.ico"
            echo "   El .exe se generará sin icono personalizado"
            read -p "¿Continuar? (y/n): " -n 1 -r
            echo
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                exit 1
            fi
        fi
        echo ""
        echo "Construyendo .exe..."
        npm run build-win
        echo ""
        echo "✅ .exe generado en la carpeta dist/"
        echo "   Archivo: dist/Calculadora de Análisis Numérico Setup 1.0.0.exe"
        ;;
    3)
        echo ""
        echo "📝 Preparando para subir a internet..."
        echo ""
        echo "Verificando iconos..."
        if [ ! -f "assets/icon.ico" ]; then
            echo "⚠️  ADVERTENCIA: No se encontró assets/icon.ico"
            echo "   El .exe se generará sin icono personalizado"
            read -p "¿Continuar? (y/n): " -n 1 -r
            echo
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                exit 1
            fi
        fi
        echo ""
        echo "Construyendo .exe..."
        npm run build-win
        echo ""
        echo "✅ .exe generado en la carpeta dist/"
        echo ""
        echo "Pasos para subir a internet:"
        echo "1. Crea un repositorio en GitHub"
        echo "2. Ejecuta: git init"
        echo "3. Ejecuta: git add ."
        echo "4. Ejecuta: git commit -m 'Initial commit'"
        echo "5. Ejecuta: git remote add origin <tu-repositorio>"
        echo "6. Ejecuta: git push -u origin main"
        echo "7. Configura GitHub Pages en Settings → Pages"
        echo ""
        echo "✅ Listo para subir a internet y distribuir .exe"
        ;;
    *)
        echo "❌ Opción no válida"
        exit 1
        ;;
esac

echo ""
echo "🎉 Preparación completada!"
echo ""
echo "📚 Para más información, revisa DEPLOYMENT.md"
