# Calculadora de Análisis Numérico

Aplicación web moderna de análisis numérico con interfaz intuitiva y gráficos interactivos en tiempo real. Preparada para funcionar como aplicación web y como ejecutable de escritorio mediante Electron.

## Desarrolladores
- Jesús Manuel Manrique Rativa
- Cristian Villanueva Medina

## Información del Proyecto
- Fecha de creación: Octubre 2026
- Versión: 1.0.0
- Curso: Análisis Numérico

## Características

### Módulo 1: Iteración Simple de Punto Fijo
- Cálculo de raíces mediante el método de iteración: x_{n+1} = g(x_n)
- Validaciones explicativas de errores matemáticos
- Tabla detallada de iteraciones con error aproximado
- Gráfica interactiva con método de telaraña (cobweb plot)
- Detección de divergencia y valores no válidos

### Módulo 2: Polinomios de Interpolación e Integración Numérica

#### A. Interpolación de Lagrange
- Ingreso dinámico de puntos (x_i, y_i)
- Validación estricta de nodos duplicados
- Generación del polinomio resultante
- Gráfica interactiva que pasa por todos los puntos

#### B. Integración Numérica
- **Regla del Trapecio** (Simple y Múltiple)
- **Regla de Simpson 1/3** (requiere n par)
- **Regla de Simpson 3/8** (requiere n múltiplo de 3)
- Validaciones explicativas de restricciones de cada método
- Tabla de particiones detallada
- Gráfica visual de aproximaciones geométricas

### Módulo 3: Referencia de Fórmulas
- Sección dedicada con todas las fórmulas matemáticas
- Renderizado profesional tipo LaTeX con MathJax
- Explicaciones detalladas de cada método

### Módulo 4: Historial de Ejercicios
- Guardado automático en localStorage
- Recarga de ejercicios anteriores con un clic
- Exportación a JSON
- Gestión completa del historial

## Instalación y Ejecución

### Opción 1: Ejecutar como aplicación web (sin instalación)

1. Clona o descarga el repositorio
2. Abre el archivo `index.html` directamente en tu navegador
3. ¡Listo! No requiere servidor ni instalación

```bash
# Simplemente abre el archivo
open index.html  # macOS
start index.html # Windows
xdg-open index.html # Linux
```

### Opción 2: Ejecutar como aplicación de escritorio con Electron

#### Requisitos previos
- Node.js (versión 16 o superior)
- npm o yarn

#### Pasos de instalación

1. Instalar dependencias:
```bash
npm install
```

2. Ejecutar la aplicación en modo desarrollo:
```bash
npm start
```

## Empaquetado para Distribución

### Nota sobre iconos
Antes de empaquetar, necesitas agregar iconos en la carpeta `assets/`:
- `icon.png` (512x512 px) para Linux
- `icon.ico` (256x256 px) para Windows
- `icon.icns` para macOS

Puedes crear estos iconos usando herramientas online como [icoconvert.com](https://icoconvert.com/) o usar un icono temporal. Si no tienes iconos, commenta las líneas correspondientes en `package.json`.

### Crear ejecutable para Windows
```bash
npm run build-win
```
Esto generará archivos `.exe` y `.exe` portable en la carpeta `dist/`

### Crear ejecutable para Linux
```bash
npm run build-linux
```
Esto generará archivos `.AppImage` y `.deb` en la carpeta `dist/`

### Crear ejecutable para macOS
```bash
npm run build-mac
```
Esto generará un archivo `.dmg` en la carpeta `dist/`

### Crear para todas las plataformas
```bash
npm run build
```

## Estructura del Proyecto

```
ispf_pil_rt_rs/
├── index.html              # Página principal
├── css/
│   └── styles.css         # Estilos CSS
├── js/
│   └── main.js            # Script principal
├── modules/
│   ├── fixedPoint.js      # Módulo de Iteración de Punto Fijo
│   ├── lagrange.js        # Módulo de Interpolación de Lagrange
│   ├── integration.js     # Módulo de Integración Numérica
│   └── history.js         # Módulo de Historial
├── electron/
│   ├── main.js            # Proceso principal de Electron
│   └── preload.js         # Script de preload para seguridad
├── package.json           # Configuración de Node.js y Electron
└── README.md              # Este archivo
```

## Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Diseño moderno y responsivo
- **JavaScript (ES6+)**: Lógica modular
- **MathJax**: Renderizado de fórmulas matemáticas tipo LaTeX (CDN)
- **Math.js**: Evaluación de expresiones matemáticas (CDN)
- **Chart.js**: Gráficos interactivos (CDN)
- **Electron**: Empaquetado para escritorio

## Uso de la Aplicación

### Iteración de Punto Fijo
1. Ingresa la función g(x) usando sintaxis de math.js (ej: `cos(x)`, `sqrt(x+2)`, `x^2+1`)
2. Especifica el valor inicial x₀
3. Define la tolerancia (ej: `0.00001` o `1e-5`)
4. Indica el máximo de iteraciones
5. Haz clic en "Calcular" para ver resultados y gráfica

### Interpolación de Lagrange
1. Agrega puntos (x, y) dinámicamente
2. Haz clic en "Calcular Polinomio"
3. Visualiza el polinomio resultante y su gráfica

### Integración Numérica
1. Ingresa la función f(x)
2. Define el intervalo [a, b]
3. Especifica el número de subintervalos n
4. Selecciona el método (Trapecio, Simpson 1/3, o Simpson 3/8)
5. Haz clic en "Calcular Integral"
6. Observa la tabla de particiones y la gráfica visual

### Historial
- Los ejercicios exitosos se guardan automáticamente
- Usa "Recargar" para restaurar parámetros anteriores
- Usa "Exportar" para descargar el historial en JSON
- Usa "Limpiar Todo" para borrar el historial

### Referencia de Fórmulas
- Accede a la pestaña "Formulas" para ver todas las fórmulas matemáticas
- Fórmulas renderizadas profesionalmente con MathJax
- Explicaciones detalladas de cada método numérico

## Notas Importantes

### Validaciones de Seguridad
- La aplicación no permite nodos duplicados en interpolación de Lagrange
- Simpson 1/3 requiere n par (se explicará el motivo si no se cumple)
- Simpson 3/8 requiere n múltiplo de 3 (se explicará el motivo si no se cumple)
- Se detectan divisiones por cero, raíces de negativos, y otros errores matemáticos

### Sintaxis de Funciones
Usa la sintaxis de math.js:
- Operadores: `+`, `-`, `*`, `/`, `^`
- Funciones: `sin(x)`, `cos(x)`, `tan(x)`, `sqrt(x)`, `log(x)`, `exp(x)`
- Constantes: `pi`, `e`
- Paréntesis para agrupar: `(x + 2) / 3`

Ejemplos válidos:
- `cos(x)`
- `sqrt(x + 2)`
- `(x^2 + 1) / 3`
- `sin(x) + cos(x)`
- `exp(-x^2)`

## Solución de Problemas

### La aplicación no carga los gráficos
- Verifica tu conexión a internet (las librerías se cargan desde CDN)
- Asegúrate de que tu navegador soporta Canvas HTML5

### Error al empaquetar con Electron
- Asegúrate de tener Node.js instalado (versión 16+)
- Ejecuta `npm install` antes de intentar empaquetar
- En Windows, puede que necesites permisos de administrador

### El historial no se guarda
- Verifica que tu navegador permita localStorage
- No uses modo de navegación privada

## Licencia

MIT License - Puedes usar, modificar y distribuir este proyecto libremente.

## Autor

Desarrollado para el curso de Análisis Numérico (2026)

**Desarrolladores:**
- Jesús Manuel Manrique Rativa
- Cristian Villanueva Medina

## Agradecimientos

- Math.js por la librería de evaluación matemática
- Chart.js por las gráficas interactivas
- Electron por el framework de aplicaciones de escritorio
