# Guía de Despliegue - Calculadora de Análisis Numérico

## 📋 Requisitos Previos

- Node.js (v18 o superior)
- npm o yarn
- Git (para subir a GitHub)

## 🌐 Parte 1: Subir a Internet (GitHub Pages / Netlify / Vercel)

### Opción A: GitHub Pages (Recomendado)

#### 1. Crear repositorio en GitHub
```bash
# Inicializar git si no está inicializado
git init

# Agregar archivos
git add .

# Commit inicial
git commit -m "Initial commit: Calculadora de Análisis Numérico"

# Crear repositorio en GitHub y conectar
git remote add origin https://github.com/tu-usuario/calculadora-analisis-numerico.git
git branch -M main
git push -u origin main
```

#### 2. Configurar GitHub Pages
1. Ve a tu repositorio en GitHub
2. Clic en **Settings** → **Pages**
3. En **Source**, selecciona:
   - Branch: `main`
   - Folder: `/ (root)`
4. Clic en **Save**

Tu sitio estará disponible en: `https://tu-usuario.github.io/calculadora-analisis-numerico/`

### Opción B: Netlify

#### 1. Subir a GitHub (sigue pasos de Opción A)

#### 2. Conectar con Netlify
1. Ve a [netlify.com](https://netlify.com)
2. Clic en **Add new site** → **Import from an existing project**
3. Conecta tu cuenta de GitHub
4. Selecciona el repositorio
5. Configura:
   - Build command: (dejar vacío)
   - Publish directory: `.` (root)
6. Clic en **Deploy site**

### Opción C: Vercel

#### 1. Subir a GitHub (sigue pasos de Opción A)

#### 2. Conectar con Vercel
1. Ve a [vercel.com](https://vercel.com)
2. Clic en **Add New Project**
3. Importa tu repositorio de GitHub
4. Configura:
   - Framework Preset: Other
   - Root Directory: `.` (dejar vacío)
5. Clic en **Deploy**

## 💻 Parte 2: Crear archivo .exe (Electron)

### Preparación de Iconos

La aplicación necesita iconos específicos para cada plataforma. Crea los siguientes archivos en la carpeta `assets/`:

```
assets/
├── icon.png   (512x512 para Linux)
├── icon.ico   (256x256 para Windows)
└── icon.icns  (para macOS)
```

#### Generar iconos automáticamente (opcional)

Si tienes una imagen base (ej. `favicon.svg`), puedes generar los iconos:

```bash
# Instalar herramienta de conversión
npm install -g electron-icon-builder

# Generar iconos desde SVG
electron-icon-builder -i favicon.svg -o assets
```

O usa herramientas online:
- [CloudConvert](https://cloudconvert.com/svg-to-ico) para convertir SVG a ICO
- [iConvert](https://iconverticons.com/) para convertir a PNG/ICNS

### Instalar Dependencias

```bash
# Instalar dependencias de desarrollo
npm install
```

### Construir para Windows (.exe)

```bash
# Construir instalador NSIS y portable
npm run build-win
```

Esto generará archivos en la carpeta `dist/`:
- `Calculadora de Análisis Numérico Setup 1.0.0.exe` (Instalador)
- `Calculadora de Análisis Numérico 1.0.0.exe` (Portable)

### Construir para Linux

```bash
# Construir AppImage y deb
npm run build-linux
```

Esto generará archivos en la carpeta `dist/`:
- `Calculadora de Análisis Numérico-1.0.0.AppImage`
- `calculadora-analisis-numerico_1.0.0_amd64.deb`

### Construir para macOS

```bash
# Construir DMG
npm run build-mac
```

Esto generará archivo en la carpeta `dist/`:
- `Calculadora de Análisis Numérico-1.0.0.dmg`

## 🧪 Parte 3: Ejecutar Pruebas Antes de Desplegar

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas en modo UI
npm run test:ui

# Ver reporte HTML
npx playwright show-report
```

## 📦 Estructura Final del Proyecto

```
calculadora-analisis-numerico/
├── assets/                    # Iconos de la aplicación
│   ├── icon.png
│   ├── icon.ico
│   └── icon.icns
├── css/                       # Hojas de estilo
│   └── styles.css
├── electron/                  # Archivos de Electron
│   ├── main.js
│   └── preload.js
├── js/                        # JavaScript principal
│   └── main.js
├── modules/                   # Módulos de funcionalidad
│   ├── fixedPoint.js
│   ├── lagrange.js
│   ├── integration.js
│   └── history.js
├── tests/                     # Pruebas E2E
│   ├── numerical-calculator.spec.js
│   └── README.md
├── dist/                      # Archivos compilados (generado)
├── index.html                 # Página principal
├── favicon.svg                # Favicon
├── package.json               # Configuración de Node
├── playwright.config.js       # Configuración de Playwright
├── DEPLOYMENT.md              # Este archivo
└── README.md                  # Documentación general
```

## 🚀 Checklist Antes de Desplegar

### Para Sitio Web
- [ ] Todas las pruebas pasan (`npm test`)
- [ ] Los enlaces externos (CDN) funcionan correctamente
- [ ] El favicon se muestra correctamente
- [ ] Las animaciones no bloquean la interacción
- [ ] La accesibilidad WCAG está implementada
- [ ] El footer tiene la fecha correcta (14 de octubre de 2026)
- [ ] Los autores están listados correctamente

### Para Electron (.exe)
- [ ] Los iconos están en la carpeta `assets/`
- [ ] Las dependencias están instaladas (`npm install`)
- [ ] La aplicación funciona en modo desarrollo (`npm start`)
- [ ] La ventana tiene dimensiones apropiadas
- [ ] No hay errores en la consola al iniciar
- [ ] La aplicación se puede empaquetar (`npm run build-win`)

## 📝 Personalización

### Cambiar nombre de la aplicación

Edita `package.json`:
```json
{
  "name": "calculadora-analisis-numerico",
  "productName": "Calculadora de Análisis Numérico",
  "appId": "com.calculadoraanalisisnumerico.app"
}
```

### Cambiar autor y licencia

Edita `package.json`:
```json
{
  "author": "Tu Nombre",
  "license": "MIT"
}
```

### Cambiar versión

Edita `package.json`:
```json
{
  "version": "1.0.0"
}
```

## 🔧 Solución de Problemas

### Error: "icon.ico not found"
Crea los iconos en la carpeta `assets/` o elimina la referencia en `package.json`:
```json
"win": {
  "icon": "assets/icon.ico"  // Eliminar esta línea si no tienes icono
}
```

### Error: "Cannot find module 'electron'"
Reinstala las dependencias:
```bash
rm -rf node_modules package-lock.json
npm install
```

### GitHub Pages no carga MathJax/Chart.js
Verifica que los enlaces CDN en `index.html` sean HTTPS:
```html
<script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
<script src="https://cdn.jsdelivr.net/npm/mathjs@12.4.0/lib/browser/math.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
```

### Electron no carga el archivo HTML
Verifica que `electron/main.js` tenga la ruta correcta:
```javascript
mainWindow.loadFile('index.html');  // Debe ser 'index.html', no './index.html'
```

## 📚 Recursos Adicionales

- [Electron Documentation](https://www.electronjs.org/docs)
- [Electron Builder Documentation](https://www.electron.build/)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Netlify Documentation](https://docs.netlify.com/)
- [Vercel Documentation](https://vercel.com/docs)

## 🎯 Próximos Pasos

1. **Crear iconos** para la aplicación (si aún no los tienes)
2. **Ejecutar pruebas** para verificar funcionalidad
3. **Subir a GitHub** para versión web
4. **Configurar GitHub Pages/Netlify/Vercel** para despliegue web
5. **Construir .exe** con `npm run build-win`
6. **Probar el .exe** en Windows antes de distribuirlo
7. **Subir el .exe** a GitHub Releases para distribución

## 📄 Licencia y Distribución

Este proyecto está bajo licencia MIT. Puedes:
- Distribuirlo gratuitamente
- Modificarlo según tus necesidades
- Usarlo en proyectos comerciales

Solo asegúrate de mantener el aviso de licencia y atribuir a los autores originales.
