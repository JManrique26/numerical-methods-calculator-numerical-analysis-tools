# Pruebas E2E - Calculadora de Análisis Numérico

Suite de pruebas end-to-end completa utilizando Playwright para validar la funcionalidad de la Calculadora de Análisis Numérico.

## Requisitos Previos

- Node.js (v18 o superior)
- Python 3 (para el servidor HTTP de prueba)

## Instalación

```bash
npm install
```

Esto instalará:
- `@playwright/test` - Framework de pruebas E2E
- Navegadores de Playwright (Chromium, Firefox, WebKit)

## Ejecutar Pruebas

### Ejecutar todas las pruebas
```bash
npx playwright test
```

### Ejecutar pruebas en modo UI (interactivo)
```bash
npx playwright test --ui
```

### Ejecutar pruebas en modo headed (con ventana visible)
```bash
npx playwright test --headed
```

### Ejecutar pruebas en un navegador específico
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Ejecutar pruebas con depuración
```bash
npx playwright test --debug
```

## Cobertura de Pruebas

### 1. Carga Inicial y Navegación de Pestañas
- ✅ Renderizado correcto del título principal y sección de bienvenida
- ✅ Verificación de autores y metadatos en el footer
- ✅ Navegación entre pestañas principales (Punto Fijo, Interpolación, Fórmulas, Historial)

### 2. Pruebas Matemáticas y Funcionales - Iteración de Punto Fijo
- ✅ Caso Exitoso 1: Convergencia estándar con cos(x) → ~0.739
- ✅ Caso Exitoso 2: Raíz cuadrada con Newton-Raphson → √2 (~1.41421)
- ✅ Caso de Error: Función inválida en math.js
- ✅ Caso de Error: Sintaxis matemática inválida
- ✅ Botón Limpiar: Reinicio completo del estado
- ✅ Criterio de parada por iteraciones
- ✅ Criterio de parada ambos (tolerancia e iteraciones)

### 3. Validación de Librerías Externas y Visualización
- ✅ MathJax renderiza fórmulas correctamente
- ✅ Chart.js dibuja gráfico tipo telaraña en Punto Fijo
- ✅ Chart.js dibuja gráfico en Interpolación de Lagrange
- ✅ Chart.js dibuja gráfico en Integración Numérica

### 4. Prueba de Historial
- ✅ Ejecutar dos cálculos y verificar historial
- ✅ Recuperar parámetros desde el historial
- ✅ Exportar historial
- ✅ Limpiar historial

### 5. Pruebas de Accesibilidad (WCAG)
- ✅ Skip link está presente y funcional
- ✅ Atributos ARIA en pestañas
- ✅ Foco visible en elementos interactivos
- ✅ Labels asociados a inputs

### 6. Pruebas de Responsividad
- ✅ Vista en móvil (iPhone 375x667)
- ✅ Vista en tablet (iPad 768x1024)
- ✅ Vista en desktop grande (1920x1080)

## Reportes

### Ver reporte HTML
```bash
npx playwright show-report
```

### Ver reporte en modo console
```bash
npx playwright test --reporter=list
```

## Estructura del Archivo de Pruebas

```
tests/
├── numerical-calculator.spec.js  # Suite de pruebas completa
└── README.md                     # Este archivo
```

## Selectores Utilizados

Los pruebas utilizan selectores robustos:
- **IDs**: `#fixed-function`, `#fixed-calculate`, etc.
- **Roles ARIA**: `[role="tab"]`, `[role="tabpanel"]`, etc.
- **Clases CSS**: `.feature-item`, `.history-item`, etc.
- **Atributos**: `[aria-selected="true"]`, etc.

## Configuración

El archivo `playwright.config.js` incluye:
- **Servidor web automático**: Python HTTP server en puerto 38141
- **Navegadores**: Chromium, Firefox, WebKit
- **Reportes**: HTML con screenshots en fallos
- **Retries**: 2 reintentos en CI
- **Screenshots**: Solo en fallos
- **Traces**: En primer reintento

## Buenas Prácticas Implementadas

1. **Selectores robustos**: Uso de IDs y roles ARIA en lugar de selectores frágiles
2. **Aserciones claras**: Verificaciones explícitas del estado esperado
3. **Esperas apropiadas**: `waitForTimeout` para librerías asíncronas (MathJax, Chart.js)
4. **Modularidad**: Pruebas organizadas por categorías con `test.describe()`
5. **Reutilización**: `beforeEach` para navegar a la aplicación antes de cada prueba
6. **Accesibilidad**: Verificación de atributos ARIA y comportamiento de teclado

## Troubleshooting

### Las pruebas fallan con "Connection refused"
Asegúrate de que el puerto 38141 esté disponible. El servidor se inicia automáticamente con Playwright.

### Las pruebas fallan por timeout
Aumenta el timeout en `playwright.config.js`:
```javascript
use: {
  actionTimeout: 30000, // 30 segundos
}
```

### MathJax no renderiza correctamente
Aumenta el tiempo de espera después de navegar a la pestaña de fórmulas:
```javascript
await page.waitForTimeout(3000); // En lugar de 2000
```

## Contribución

Para agregar nuevas pruebas:
1. Agrega un nuevo test en `numerical-calculator.spec.js`
2. Usa selectores robustos (IDs, roles ARIA)
3. Agrega aserciones claras
4. Documenta el propósito del test en el nombre
5. Agrega el caso al README si cubre nueva funcionalidad

## Referencias

- [Playwright Documentation](https://playwright.dev)
- [Best Practices for Test Automation](https://playwright.dev/docs/best-practices)
- [Accessibility Testing with Playwright](https://playwright.dev/docs/accessibility-testing)
