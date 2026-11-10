const { test, expect } = require('@playwright/test');

/**
 * Suite de Pruebas E2E para Calculadora de Análisis Numérico
 * Cobertura: Carga inicial, navegación, cálculos matemáticos, validación de librerías e historial
 */

test.describe('Calculadora de Análisis Numérico - E2E Tests', () => {

  test.beforeEach(async ({ page }) => {
    // Navegar a la aplicación antes de cada prueba
    await page.goto('/');
    // Esperar a que la página cargue completamente
    await page.waitForLoadState('networkidle');
  });

  // ═══════════════════════════════════════════════════════════════
  // 1. CARGA INICIAL Y NAVEGACIÓN DE PESTAÑAS
  // ═══════════════════════════════════════════════════════════════

  test('1.1 - Renderizado correcto del título principal y sección de bienvenida', async ({ page }) => {
    // Verificar título principal
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    await expect(h1).toHaveText('Calculadora de Análisis Numérico');

    // Verificar subtítulo
    const subtitle = page.locator('.subtitle');
    await expect(subtitle).toBeVisible();
    await expect(subtitle).toHaveText('Herramientas computacionales para métodos numéricos');

    // Verificar sección de bienvenida
    const introSection = page.locator('.intro-section');
    await expect(introSection).toBeVisible();

    const introHeading = page.locator('#intro-heading');
    await expect(introHeading).toBeVisible();
    await expect(introHeading).toHaveText('Bienvenido a la Calculadora de Análisis Numérico');

    // Verificar características introductorias
    const featureItems = page.locator('.feature-item');
    await expect(featureItems).toHaveCount(4);
  });

  test('1.2 - Verificar autores y metadatos en el footer', async ({ page }) => {
    // Verificar footer
    const footer = page.locator('footer[role="contentinfo"]');
    await expect(footer).toBeVisible();

    // Verificar título del proyecto en footer
    const footerTitle = footer.locator('.footer-title');
    await expect(footerTitle).toBeVisible();
    await expect(footerTitle).toHaveText('Calculadora de Análisis Numérico');

    // Verificar sección de desarrolladores
    const developersSection = footer.locator('.footer-section').filter({ hasText: 'Desarrolladores' });
    await expect(developersSection).toBeVisible();

    // Verificar nombres de los desarrolladores
    await expect(developersSection).toContainText('Jesús Manuel Manrique Rativa');
    await expect(developersSection).toContainText('Cristian Villanueva Medina');

    // Verificar metadatos del proyecto
    const projectInfo = footer.locator('.footer-section').filter({ hasText: 'Información del Proyecto' });
    await expect(projectInfo).toBeVisible();
    await expect(projectInfo).toContainText('14 de octubre de 2026');
    await expect(projectInfo).toContainText('Versión: 1.0.0');
    await expect(projectInfo).toContainText('Curso: Análisis Numérico');

    // Verificar tecnologías
    const techSection = footer.locator('.footer-section').filter({ hasText: 'Tecnologías' });
    await expect(techSection).toBeVisible();
    await expect(techSection).toContainText('HTML5, CSS3, JavaScript');
    await expect(techSection).toContainText('MathJax, Math.js, Chart.js');
    await expect(techSection).toContainText('Electron');
  });

  test('1.3 - Navegación entre pestañas principales', async ({ page }) => {
    // Verificar que la pestaña de Punto Fijo está activa por defecto
    const fixedPointTab = page.locator('#tab-fixed-point[role="tab"]');
    await expect(fixedPointTab).toHaveAttribute('aria-selected', 'true');
    await expect(fixedPointTab).toHaveClass(/active/);

    const fixedPointPanel = page.locator('#fixed-point[role="tabpanel"]');
    await expect(fixedPointPanel).toBeVisible();
    await expect(fixedPointPanel).toHaveClass(/active/);

    // Navegar a Interpolación e Integración
    const interpolationTab = page.locator('#tab-interpolation[role="tab"]');
    await interpolationTab.click();
    await expect(interpolationTab).toHaveAttribute('aria-selected', 'true');
    await expect(fixedPointTab).toHaveAttribute('aria-selected', 'false');

    const interpolationPanel = page.locator('#interpolation[role="tabpanel"]');
    await expect(interpolationPanel).toBeVisible();
    await expect(interpolationPanel).toHaveClass(/active/);

    // Navegar a Fórmulas
    const formulasTab = page.locator('#tab-formulas[role="tab"]');
    await formulasTab.click();
    await expect(formulasTab).toHaveAttribute('aria-selected', 'true');

    const formulasPanel = page.locator('#formulas[role="tabpanel"]');
    await expect(formulasPanel).toBeVisible();
    await expect(formulasPanel).toHaveClass(/active/);

    // Navegar a Historial
    const historyTab = page.locator('#tab-history[role="tab"]');
    await historyTab.click();
    await expect(historyTab).toHaveAttribute('aria-selected', 'true');

    const historyPanel = page.locator('#history[role="tabpanel"]');
    await expect(historyPanel).toBeVisible();
    await expect(historyPanel).toHaveClass(/active/);

    // Regresar a Punto Fijo
    await fixedPointTab.click();
    await expect(fixedPointTab).toHaveAttribute('aria-selected', 'true');
    await expect(fixedPointPanel).toBeVisible();
  });

  // ═══════════════════════════════════════════════════════════════
  // 2. PRUEBAS MATEMÁTICAS Y FUNCIONALES - ITERACIÓN DE PUNTO FIJO
  // ═══════════════════════════════════════════════════════════════

  test('2.1 - Caso Exitoso 1: Convergencia estándar con cos(x)', async ({ page }) => {
    // Navegar a Punto Fijo
    await page.locator('#tab-fixed-point').click();

    // Seleccionar función predefinida cos(x)
    const functionSelect = page.locator('#fixed-function-preset');
    await functionSelect.selectOption('cos(x)|0.5');

    // Verificar que los valores se llenaron correctamente
    const functionInput = page.locator('#fixed-function');
    await expect(functionInput).toHaveValue('cos(x)');

    const x0Input = page.locator('#fixed-x0');
    await expect(x0Input).toHaveValue('0.5');

    // Configurar criterio de parada por tolerancia
    await page.locator('input[name="stop-criterion"][value="tolerance"]').check();

    const toleranceInput = page.locator('#fixed-tolerance');
    await expect(toleranceInput).toBeVisible();
    await toleranceInput.fill('0.00001');

    // Calcular
    const calculateBtn = page.locator('#fixed-calculate');
    await calculateBtn.click();

    // Esperar resultados
    await page.waitForTimeout(1000);

    // Verificar que no hay errores
    const errorDiv = page.locator('#fixed-error');
    await expect(errorDiv).not.toHaveClass(/show/);

    // Verificar resultados
    const resultsDiv = page.locator('#fixed-results');
    await expect(resultsDiv).toBeVisible();

    // Verificar que aparece la tabla de iteraciones
    const table = resultsDiv.locator('table');
    await expect(table).toBeVisible();

    // Verificar convergencia hacia ~0.739
    await expect(resultsDiv).toContainText('Convergencia alcanzada');
    await expect(resultsDiv).toContainText(/0\.739/);
  });

  test('2.2 - Caso Exitoso 2: Raíz cuadrada con Newton-Raphson', async ({ page }) => {
    // Navegar a Punto Fijo
    await page.locator('#tab-fixed-point').click();

    // Ingresar función de Newton-Raphson manualmente
    const functionInput = page.locator('#fixed-function');
    await functionInput.fill('(x + 2/x) / 2');

    const x0Input = page.locator('#fixed-x0');
    await x0Input.fill('1.0');

    // Configurar criterio de parada por tolerancia
    await page.locator('input[name="stop-criterion"][value="tolerance"]').check();

    const toleranceInput = page.locator('#fixed-tolerance');
    await toleranceInput.fill('0.00001');

    // Calcular
    await page.locator('#fixed-calculate').click();
    await page.waitForTimeout(1000);

    // Verificar resultados
    const resultsDiv = page.locator('#fixed-results');
    await expect(resultsDiv).toBeVisible();

    // Verificar convergencia hacia √2 (~1.41421)
    await expect(resultsDiv).toContainText('Convergencia alcanzada');
    await expect(resultsDiv).toContainText(/1\.4142/);
  });

  test('2.3 - Caso de Error: Función inválida en math.js', async ({ page }) => {
    // Navegar a Punto Fijo
    await page.locator('#tab-fixed-point').click();

    // Ingresar función inválida
    const functionInput = page.locator('#fixed-function');
    await functionInput.fill('invalid_func(x)');

    const x0Input = page.locator('#fixed-x0');
    await x0Input.fill('0.5');

    // Calcular
    await page.locator('#fixed-calculate').click();
    await page.waitForTimeout(500);

    // Verificar que se muestra el error
    const errorDiv = page.locator('#fixed-error');
    await expect(errorDiv).toHaveClass(/show/);
    await expect(errorDiv).toContainText('Error');
    await expect(errorDiv).toContainText('no es válida');

    // Verificar que la aplicación no se rompe (inputs aún visibles)
    await expect(functionInput).toBeVisible();
    await expect(x0Input).toBeVisible();
  });

  test('2.4 - Caso de Error: Sintaxis matemática inválida', async ({ page }) => {
    // Navegar a Punto Fijo
    await page.locator('#tab-fixed-point').click();

    // Ingresar función con sintaxis inválida
    const functionInput = page.locator('#fixed-function');
    await functionInput.fill('cos(x +');

    const x0Input = page.locator('#fixed-x0');
    await x0Input.fill('0.5');

    // Calcular
    await page.locator('#fixed-calculate').click();
    await page.waitForTimeout(500);

    // Verificar que se muestra el error
    const errorDiv = page.locator('#fixed-error');
    await expect(errorDiv).toHaveClass(/show/);
    await expect(errorDiv).toContainText('Error');
  });

  test('2.5 - Botón Limpiar: Reinicio completo del estado', async ({ page }) => {
    // Navegar a Punto Fijo
    await page.locator('#tab-fixed-point').click();

    // Ingresar valores
    const functionInput = page.locator('#fixed-function');
    await functionInput.fill('sin(x)');

    const x0Input = page.locator('#fixed-x0');
    await x0Input.fill('1.0');

    const toleranceInput = page.locator('#fixed-tolerance');
    await toleranceInput.fill('0.001');

    // Calcular
    await page.locator('#fixed-calculate').click();
    await page.waitForTimeout(1000);

    // Verificar que hay resultados
    const resultsDiv = page.locator('#fixed-results');
    await expect(resultsDiv).not.toContainText('Ingresa los parámetros');

    // Limpiar
    const clearBtn = page.locator('#fixed-clear');
    await clearBtn.click();
    await page.waitForTimeout(500);

    // Verificar reinicio de campos
    await expect(functionInput).toHaveValue('cos(x)');
    await expect(x0Input).toHaveValue('0.5');
    await expect(toleranceInput).toHaveValue('0.00001');

    // Verificar reinicio de resultados
    await expect(resultsDiv).toContainText('Ingresa los parámetros y haz clic en "Calcular"');

    // Verificar que no hay errores
    const errorDiv = page.locator('#fixed-error');
    await expect(errorDiv).not.toHaveClass(/show/);
  });

  test('2.6 - Criterio de parada por iteraciones', async ({ page }) => {
    // Navegar a Punto Fijo
    await page.locator('#tab-fixed-point').click();

    // Configurar función
    const functionInput = page.locator('#fixed-function');
    await functionInput.fill('cos(x)');

    const x0Input = page.locator('#fixed-x0');
    await x0Input.fill('0.5');

    // Configurar criterio de parada por iteraciones
    await page.locator('input[name="stop-criterion"][value="iterations"]').check();

    const maxIterInput = page.locator('#fixed-max-iter');
    await expect(maxIterInput).toBeVisible();
    await maxIterInput.fill('10');

    // Calcular
    await page.locator('#fixed-calculate').click();
    await page.waitForTimeout(1000);

    // Verificar resultados
    const resultsDiv = page.locator('#fixed-results');
    await expect(resultsDiv).toBeVisible();
    await expect(resultsDiv).toContainText('Convergencia alcanzada');
  });

  test('2.7 - Criterio de parada ambos (tolerancia e iteraciones)', async ({ page }) => {
    // Navegar a Punto Fijo
    await page.locator('#tab-fixed-point').click();

    // Configurar función
    const functionInput = page.locator('#fixed-function');
    await functionInput.fill('cos(x)');

    const x0Input = page.locator('#fixed-x0');
    await x0Input.fill('0.5');

    // Configurar criterio de parada ambos
    await page.locator('input[name="stop-criterion"][value="both"]').check();

    const toleranceInput = page.locator('#fixed-tolerance');
    await expect(toleranceInput).toBeVisible();
    await toleranceInput.fill('0.00001');

    const maxIterInput = page.locator('#fixed-max-iter');
    await expect(maxIterInput).toBeVisible();
    await maxIterInput.fill('100');

    // Calcular
    await page.locator('#fixed-calculate').click();
    await page.waitForTimeout(1000);

    // Verificar resultados
    const resultsDiv = page.locator('#fixed-results');
    await expect(resultsDiv).toBeVisible();
    await expect(resultsDiv).toContainText('Convergencia alcanzada');
  });

  // ═══════════════════════════════════════════════════════════════
  // 3. VALIDACIÓN DE LIBRERÍAS EXTERNAS Y VISUALIZACIÓN
  // ═══════════════════════════════════════════════════════════════

  test('3.1 - MathJax renderiza fórmulas correctamente', async ({ page }) => {
    // Navegar a la pestaña de Fórmulas
    await page.locator('#tab-formulas').click();
    await page.waitForTimeout(2000); // Esperar a MathJax para renderizar

    // Verificar que existen elementos de MathJax en el DOM
    const mathJaxElements = page.locator('.MathJax, mjx-container, [class*="mjx"]');
    await expect(mathJaxElements.first()).toBeVisible();

    // Verificar fórmulas de Punto Fijo
    const formulasPanel = page.locator('#formulas[role="tabpanel"]');
    await expect(formulasPanel).toBeVisible();
    await expect(formulasPanel).toContainText('Iteración de Punto Fijo');
  });

  test('3.2 - Chart.js dibuja gráfico tipo telaraña en Punto Fijo', async ({ page }) => {
    // Navegar a Punto Fijo
    await page.locator('#tab-fixed-point').click();

    // Realizar un cálculo exitoso
    const functionInput = page.locator('#fixed-function');
    await functionInput.fill('cos(x)');

    const x0Input = page.locator('#fixed-x0');
    await x0Input.fill('0.5');

    await page.locator('#fixed-calculate').click();
    await page.waitForTimeout(2000); // Esperar a Chart.js para renderizar

    // Verificar que el canvas del gráfico existe
    const chartCanvas = page.locator('#fixed-chart');
    await expect(chartCanvas).toBeVisible();

    // Verificar que el canvas tiene contenido (no está vacío)
    const canvasSize = await chartCanvas.boundingBox();
    expect(canvasSize).toBeTruthy();
    expect(canvasSize.width).toBeGreaterThan(0);
    expect(canvasSize.height).toBeGreaterThan(0);
  });

  test('3.3 - Chart.js dibuja gráfico en Interpolación de Lagrange', async ({ page }) => {
    // Navegar a Interpolación e Integración
    await page.locator('#tab-interpolation').click();

    // Navegar a sub-pestaña Lagrange
    await page.locator('#subtab-lagrange').click();

    // Ingresar puntos
    await page.locator('#px-1').fill('0');
    await page.locator('#py-1').fill('1');
    await page.locator('#px-2').fill('1');
    await page.locator('#py-2').fill('2');
    await page.locator('#px-3').fill('2');
    await page.locator('#py-3').fill('5');

    // Calcular
    await page.locator('#lagrange-calculate').click();
    await page.waitForTimeout(2000);

    // Verificar que el canvas del gráfico existe
    const chartCanvas = page.locator('#lagrange-chart');
    await expect(chartCanvas).toBeVisible();

    const canvasSize = await chartCanvas.boundingBox();
    expect(canvasSize).toBeTruthy();
  });

  test('3.4 - Chart.js dibuja gráfico en Integración Numérica', async ({ page }) => {
    // Navegar a Interpolación e Integración
    await page.locator('#tab-interpolation').click();

    // Navegar a sub-pestaña Integración
    await page.locator('#subtab-integration').click();

    // Ingresar parámetros
    const functionInput = page.locator('#int-function');
    await functionInput.fill('x^2');

    await page.locator('#int-a').fill('0');
    await page.locator('#int-b').fill('2');
    await page.locator('#int-n').fill('10');

    // Calcular
    await page.locator('#int-calculate').click();
    await page.waitForTimeout(2000);

    // Verificar que el canvas del gráfico existe
    const chartCanvas = page.locator('#int-chart');
    await expect(chartCanvas).toBeVisible();

    const canvasSize = await chartCanvas.boundingBox();
    expect(canvasSize).toBeTruthy();
  });

  // ═══════════════════════════════════════════════════════════════
  // 4. PRUEBA DE HISTORIAL
  // ═══════════════════════════════════════════════════════════════

  test('4.1 - Ejecutar dos cálculos y verificar historial', async ({ page }) => {
    // Primer cálculo: Punto Fijo con cos(x)
    await page.locator('#tab-fixed-point').click();

    const functionInput = page.locator('#fixed-function');
    await functionInput.fill('cos(x)');

    const x0Input = page.locator('#fixed-x0');
    await x0Input.fill('0.5');

    await page.locator('#fixed-calculate').click();
    await page.waitForTimeout(1000);

    // Segundo cálculo: Lagrange
    await page.locator('#tab-interpolation').click();
    await page.locator('#subtab-lagrange').click();

    await page.locator('#px-1').fill('0');
    await page.locator('#py-1').fill('1');
    await page.locator('#px-2').fill('1');
    await page.locator('#py-2').fill('2');

    await page.locator('#lagrange-calculate').click();
    await page.waitForTimeout(1000);

    // Navegar a Historial
    await page.locator('#tab-history').click();
    await page.waitForTimeout(500);

    // Verificar que hay registros en el historial
    const historyItems = page.locator('.history-item');
    const count = await historyItems.count();
    expect(count).toBeGreaterThanOrEqual(2);

    // Verificar que el primer cálculo está en el historial
    await expect(page.locator('.history-item')).toContainText('Iteración de Punto Fijo');

    // Verificar que el segundo cálculo está en el historial
    await expect(page.locator('.history-item')).toContainText('Interpolación de Lagrange');
  });

  test('4.2 - Recuperar parámetros desde el historial', async ({ page }) => {
    // Realizar un cálculo de Punto Fijo
    await page.locator('#tab-fixed-point').click();

    const functionInput = page.locator('#fixed-function');
    await functionInput.fill('sin(x)');

    const x0Input = page.locator('#fixed-x0');
    await x0Input.fill('1.0');

    await page.locator('#fixed-calculate').click();
    await page.waitForTimeout(1000);

    // Navegar a Historial
    await page.locator('#tab-history').click();
    await page.waitForTimeout(500);

    // Hacer clic en el primer item del historial
    const firstHistoryItem = page.locator('.history-item').first();
    await firstHistoryItem.click();
    await page.waitForTimeout(500);

    // Verificar que nos redirigió a la pestaña correcta
    const fixedPointTab = page.locator('#tab-fixed-point');
    await expect(fixedPointTab).toHaveAttribute('aria-selected', 'true');

    // Verificar que los parámetros se recuperaron
    await expect(functionInput).toHaveValue('sin(x)');
    await expect(x0Input).toHaveValue('1');
  });

  test('4.3 - Exportar historial', async ({ page }) => {
    // Realizar un cálculo
    await page.locator('#tab-fixed-point').click();

    const functionInput = page.locator('#fixed-function');
    await functionInput.fill('cos(x)');

    await page.locator('#fixed-calculate').click();
    await page.waitForTimeout(1000);

    // Navegar a Historial
    await page.locator('#tab-history').click();
    await page.waitForTimeout(500);

    // Verificar botón de exportar
    const exportBtn = page.locator('#history-export');
    await expect(exportBtn).toBeVisible();

    // Nota: La descarga de archivos requiere configuración adicional en Playwright
    // Aquí solo verificamos que el botón existe y es interactuable
    await expect(exportBtn).toBeEnabled();
  });

  test('4.4 - Limpiar historial', async ({ page }) => {
    // Realizar un cálculo
    await page.locator('#tab-fixed-point').click();

    const functionInput = page.locator('#fixed-function');
    await functionInput.fill('cos(x)');

    await page.locator('#fixed-calculate').click();
    await page.waitForTimeout(1000);

    // Navegar a Historial
    await page.locator('#tab-history').click();
    await page.waitForTimeout(500);

    // Verificar que hay items
    const historyItemsBefore = page.locator('.history-item');
    const countBefore = await historyItemsBefore.count();
    expect(countBefore).toBeGreaterThan(0);

    // Limpiar historial
    const clearBtn = page.locator('#history-clear');
    await clearBtn.click();
    await page.waitForTimeout(500);

    // Verificar que el historial está vacío
    const historyItemsAfter = page.locator('.history-item');
    const countAfter = await historyItemsAfter.count();
    expect(countAfter).toBe(0);
  });

  // ═══════════════════════════════════════════════════════════════
  // 5. PRUEBAS DE ACCESIBILIDAD (WCAG)
  // ═══════════════════════════════════════════════════════════════

  test('5.1 - Skip link está presente y funcional', async ({ page }) => {
    // Verificar que el skip link existe
    const skipLink = page.locator('.skip-link');
    await expect(skipLink).toBeVisible();
    await expect(skipLink).toHaveAttribute('href', '#main-content');

    // Verificar que el main-content existe
    const mainContent = page.locator('#main-content');
    await expect(mainContent).toBeVisible();
  });

  test('5.2 - Atributos ARIA en pestañas', async ({ page }) => {
    // Verificar roles ARIA en tabs
    const tablist = page.locator('[role="tablist"]');
    await expect(tablist).toBeVisible();

    const tabs = page.locator('[role="tab"]');
    await expect(tabs).toHaveCount(4);

    // Verificar que cada tab tiene aria-selected y aria-controls
    for (const tab of await tabs.all()) {
      await expect(tab).toHaveAttribute('aria-selected');
      await expect(tab).toHaveAttribute('aria-controls');
    }
  });

  test('5.3 - Foco visible en elementos interactivos', async ({ page }) => {
    // Navegar por teclado y verificar foco
    await page.keyboard.press('Tab');

    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('5.4 - Labels asociados a inputs', async ({ page }) => {
    // Navegar a Punto Fijo
    await page.locator('#tab-fixed-point').click();

    // Verificar que los inputs tienen labels asociados
    const functionInput = page.locator('#fixed-function');
    const functionLabel = page.locator('label[for="fixed-function"]');
    await expect(functionLabel).toBeVisible();

    const x0Input = page.locator('#fixed-x0');
    const x0Label = page.locator('label[for="fixed-x0"]');
    await expect(x0Label).toBeVisible();
  });

  // ═══════════════════════════════════════════════════════════════
  // 6. PRUEBAS DE RESPONSIVIDAD
  // ═══════════════════════════════════════════════════════════════

  test('6.1 - Vista en móvil (iPhone)', async ({ page }) => {
    // Cambiar a viewport móvil
    await page.setViewportSize({ width: 375, height: 667 });

    // Verificar que el contenido es visible
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();

    // Verificar que las pestañas son navegables
    const tabs = page.locator('[role="tab"]');
    await expect(tabs).toHaveCount(4);
  });

  test('6.2 - Vista en tablet (iPad)', async ({ page }) => {
    // Cambiar a viewport tablet
    await page.setViewportSize({ width: 768, height: 1024 });

    // Verificar que el contenido es visible
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
  });

  test('6.3 - Vista en desktop grande', async ({ page }) => {
    // Cambiar a viewport desktop grande
    await page.setViewportSize({ width: 1920, height: 1080 });

    // Verificar que el contenido es visible
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
  });
});
