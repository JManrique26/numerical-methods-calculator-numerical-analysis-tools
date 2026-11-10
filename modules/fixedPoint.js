// Módulo: Iteración de Punto Fijo
class FixedPointModule {
    constructor() {
        this.charts = [];
        this.allIterations = [];
        this.initEventListeners();
        // Iniciar animación de espera al cargar
        this.startWaitingAnimation();
    }

    initEventListeners() {
        document.getElementById('fixed-calculate').addEventListener('click', () => this.calculate());
        document.getElementById('fixed-clear').addEventListener('click', () => this.clear());
    }

    showError(message) {
        const errorDiv = document.getElementById('fixed-error');
        errorDiv.textContent = message;
        errorDiv.classList.add('show');

        // WCAG 3.3.1: Marcar inputs inválidos con aria-invalid
        const inputs = document.querySelectorAll('#fixed-function, #fixed-x0, #fixed-tolerance, #fixed-max-iter');
        inputs.forEach(input => {
            input.setAttribute('aria-invalid', 'true');
        });
    }

    clearError() {
        const errorDiv = document.getElementById('fixed-error');
        errorDiv.classList.remove('show');

        // WCAG 3.3.1: Remover aria-invalid cuando no hay error
        const inputs = document.querySelectorAll('#fixed-function, #fixed-x0, #fixed-tolerance, #fixed-max-iter');
        inputs.forEach(input => {
            input.removeAttribute('aria-invalid');
        });
    }

    clear() {
        document.getElementById('fixed-function').value = 'cos(x)';
        document.getElementById('fixed-x0').value = '0.5';
        document.getElementById('fixed-tolerance').value = '0.00001';
        document.getElementById('fixed-max-iter').value = '100';
        this.clearError();
        document.getElementById('fixed-results').innerHTML = '<h3>Resultados</h3><p class="placeholder">Ingresa los parámetros y haz clic en "Calcular"</p>';
        this.charts.forEach(chart => chart.destroy());
        this.charts = [];
        this.chart = null;

        // Eliminar lista de puntos si existe
        const pointsList = document.querySelector('.module-container .points-list');
        if (pointsList) {
            pointsList.remove();
        }

        // Iniciar animación de espera
        this.startWaitingAnimation();
    }

    validateFunction(gStr, x) {
        try {
            const scope = { x: x };
            const result = math.evaluate(gStr, scope);

            if (typeof result !== 'number' || isNaN(result) || !isFinite(result)) {
                return {
                    valid: false,
                    error: `Error: La función evaluada en x = ${x.toFixed(6)} no produjo un número válido. Verifica que la expresión sea matemáticamente correcta.`
                };
            }

            return { valid: true, result };
        } catch (e) {
            let errorMsg = `Error: La función "${gStr}" no es válida. `;
            
            if (e.message.includes('Unexpected token')) {
                errorMsg += 'Verifica la sintaxis. Usa operadores matemáticos correctos: +, -, *, /, ^, ()';
            } else if (e.message.includes('sqrt') && e.message.includes('negative')) {
                errorMsg += `El argumento de la raíz cuadrada no puede ser negativo en el punto x = ${x.toFixed(6)}.`;
            } else if (e.message.includes('log') && e.message.includes('negative')) {
                errorMsg += `El argumento del logaritmo no puede ser negativo o cero en el punto x = ${x.toFixed(6)}.`;
            } else if (e.message.includes('divide')) {
                errorMsg += `Se detectó una división por cero en el punto x = ${x.toFixed(6)}.`;
            } else {
                errorMsg += `Detalle del error: ${e.message}`;
            }

            return { valid: false, error: errorMsg };
        }
    }

    calculate() {
        this.clearError();

        const gStr = document.getElementById('fixed-function').value.trim();
        const x0 = parseFloat(document.getElementById('fixed-x0').value);
        const tolerance = parseFloat(document.getElementById('fixed-tolerance').value);
        const maxIter = parseInt(document.getElementById('fixed-max-iter').value);
        const stopCriterion = document.querySelector('input[name="stop-criterion"]:checked').value;

        // Validaciones de entrada
        if (!gStr) {
            this.showError('Error: Debes ingresar una función g(x).');
            return;
        }

        if (isNaN(x0)) {
            this.showError('Error: El valor inicial x₀ debe ser un número válido.');
            return;
        }

        if (isNaN(tolerance) || tolerance <= 0) {
            this.showError('Error: La tolerancia debe ser un número positivo mayor que cero.');
            return;
        }

        if (isNaN(maxIter) || maxIter < 1) {
            this.showError('Error: El número máximo de iteraciones debe ser al menos 1.');
            return;
        }

        // Validar función inicial
        const initialValidation = this.validateFunction(gStr, x0);
        if (!initialValidation.valid) {
            this.showError(initialValidation.error);
            return;
        }

        // Ejecutar iteración de punto fijo según criterio de parada
        const iterations = [];
        let x = x0;
        let converged = false;
        let finalIteration = 0;
        let stopReason = '';

        for (let i = 0; i < maxIter; i++) {
            const validation = this.validateFunction(gStr, x);
            if (!validation.valid) {
                this.showError(validation.error);
                return;
            }

            const gx = validation.result;
            const error = i === 0 ? 'N/A' : Math.abs(x - iterations[i - 1].x);

            iterations.push({
                i: i,
                x: x,
                gx: gx,
                error: error
            });

            // Verificar convergencia según criterio seleccionado
            if (stopCriterion === 'tolerance' || stopCriterion === 'both') {
                if (i > 0 && error < tolerance) {
                    converged = true;
                    finalIteration = i;
                    stopReason = 'tolerancia';
                    break;
                }
            }

            if (stopCriterion === 'iterations' || stopCriterion === 'both') {
                if (i === maxIter - 1) {
                    converged = true;
                    finalIteration = i;
                    stopReason = 'iteraciones';
                    break;
                }
            }

            // Verificar divergencia (valores muy grandes)
            if (Math.abs(gx) > 1e10) {
                this.showError(`Error: El método está divergiendo. En la iteración ${i}, el valor g(x) = ${gx.toExponential(2)} es demasiado grande. Esto puede indicar que el método no converge para esta función con el valor inicial dado.`);
                return;
            }

            x = gx;
            finalIteration = i;
        }

        // Guardar todas las iteraciones
        this.allIterations = iterations;

        // Mostrar resultados
        this.displayResults(iterations, converged, finalIteration, gStr, x0, tolerance, stopCriterion, stopReason);
        this.plotChart(gStr, iterations);

        // Guardar en historial
        if (converged) {
            const historyItem = {
                type: 'Iteración de Punto Fijo',
                date: new Date().toISOString(),
                parameters: {
                    'Función g(x)': gStr,
                    'x₀': x0,
                    'Tolerancia': tolerance,
                    'Iteraciones': finalIteration + 1
                },
                result: `Raíz aproximada: ${iterations[finalIteration].gx.toPrecision(8)}`
            };
            HistoryModule.saveItem(historyItem);
        }
    }

    displayResults(iterations, converged, finalIteration, gStr, x0, tolerance, stopCriterion, stopReason) {
        const resultsDiv = document.getElementById('fixed-results');
        const VISIBLE = 10;

        let html = '<h3>Resultados</h3>';

        // Tabla con scroll: 10 filas visibles, resto desplazable
        html += `<div class="table-scroll" style="max-height:${VISIBLE * 45}px; overflow-y:auto; margin-bottom:1rem;">`;
        html += '<table>';
        html += '<thead><tr><th>i</th><th>xᵢ</th><th>g(xᵢ)</th><th>Error aprox.</th></tr></thead>';
        html += '<tbody>';
        iterations.forEach(iter => {
            const errorStr = iter.error === 'N/A' ? 'N/A' : iter.error.toExponential(4);
            html += `<tr>
                <td>${iter.i}</td>
                <td>${iter.x.toPrecision(8)}</td>
                <td>${iter.gx.toPrecision(8)}</td>
                <td>${errorStr}</td>
            </tr>`;
        });
        html += '</tbody></table>';
        html += '</div>';

        if (iterations.length > VISIBLE) {
            html += `<p class="table-scroll-hint">Desplaza para ver el resto de las iteraciones.</p>`;
        }

        html += '<div class="conclusion">';
        if (converged) {
            const stopReasonText = stopReason === 'tolerancia' ? 'tolerancia alcanzada' : 'máximo de iteraciones';
            html += `<p class="success"><strong>Convergencia alcanzada</strong> en ${finalIteration} iteraciones (${stopReasonText}).</p>`;
            html += `<p>Raíz aproximada: <strong>${iterations[finalIteration].gx.toPrecision(8)}</strong></p>`;
            html += `<p>Error final: <strong>${iterations[finalIteration].error.toExponential(6)}</strong></p>`;
        } else {
            html += `<p class="warning"><strong>No se alcanzó convergencia</strong> después de ${iterations.length} iteraciones.</p>`;
            html += `<p>Último valor calculado: <strong>${iterations[iterations.length - 1].gx.toPrecision(8)}</strong></p>`;
            html += `<p>Sugerencia: Intenta con un valor inicial diferente o verifica si la función cumple las condiciones de convergencia.</p>`;
        }
        html += '</div>';

        resultsDiv.innerHTML = html;

        // Detener animación de espera
        this.stopWaitingAnimation();

        if (window.MathJax) {
            MathJax.typesetPromise([resultsDiv]).then(() => {
                if (window.matchResultsHeight) matchResultsHeight('fixed-point');
            });
        } else {
            if (window.matchResultsHeight) matchResultsHeight('fixed-point');
        }
    }

    plotChart(gStr, iterations) {
        // Destruir gráficas existentes
        this.charts.forEach(chart => chart.destroy());
        this.charts = [];

        // Seleccionar máximo 12 iteraciones distribuidas uniformemente
        const maxPoints = 12;
        let selectedIterations = [];

        if (iterations.length <= maxPoints) {
            selectedIterations = iterations;
        } else {
            // Distribuir uniformemente: seleccionar iteraciones equidistantes
            const step = (iterations.length - 1) / (maxPoints - 1);
            for (let i = 0; i < maxPoints; i++) {
                const index = Math.round(i * step);
                selectedIterations.push(iterations[index]);
            }
        }

        // Limpiar contenedor de gráficas
        const chartContainer = document.querySelector('.chart-container');
        const existingChartsWrapper = chartContainer.querySelector('.charts-wrapper');
        if (existingChartsWrapper) {
            existingChartsWrapper.remove();
        }

        // Restaurar el canvas original al contenedor
        const existingCanvas = document.getElementById('fixed-chart');
        existingCanvas.style.display = 'block';
        chartContainer.appendChild(existingCanvas);

        // Crear la gráfica única
        this.createSingleChart(existingCanvas, gStr, selectedIterations, iterations);

        // Mostrar lista de puntos abajo
        this.displayPointsList(selectedIterations, iterations.length);
    }

    createSingleChart(canvas, gStr, selectedIterations, allIterations) {
        const ctx = canvas.getContext('2d');

        const colorCurve  = '#000000';
        const colorSecond = '#666666';
        const colorGrid   = 'rgba(0, 0, 0, 0.15)';
        const colorTicks  = '#000000';
        const colorTitle  = '#000000';

        // ── Calcular rango de iteraciones ─────────────────────────────────
        const xVals = selectedIterations.map(i => i.x);
        const yVals = selectedIterations.map(i => i.gx);
        const xMinIter = Math.min(...xVals);
        const xMaxIter = Math.max(...xVals);
        const yMinIter = Math.min(...yVals);
        const yMaxIter = Math.max(...yVals);

        // Calcular rango inicial con margen (usar las iteraciones seleccionadas)
        let xMin = xMinIter - 0.5;
        let xMax = xMaxIter + 0.5;
        let yMin = yMinIter - 0.5;
        let yMax = yMaxIter + 0.5;

        // ── Ampliar si los puntos ocupan menos del 70% del rango ───────────
        const xRange = xMax - xMin;
        const yRange = yMax - yMin;
        const xPointRange = xMaxIter - xMinIter;
        const yPointRange = yMaxIter - yMinIter;

        // Si los puntos ocupan menos del 70% en x, ampliar
        if (xPointRange / xRange < 0.7 && xPointRange > 0) {
            const xCenter = (xMinIter + xMaxIter) / 2;
            const newXRange = xPointRange / 0.7; // Hacer que ocupen 70%
            xMin = xCenter - newXRange / 2;
            xMax = xCenter + newXRange / 2;
        }

        // Si los puntos ocupan menos del 70% en y, ampliar
        if (yPointRange / yRange < 0.7 && yPointRange > 0) {
            const yCenter = (yMinIter + yMaxIter) / 2;
            const newYRange = yPointRange / 0.7; // Hacer que ocupen 70%
            yMin = yCenter - newYRange / 2;
            yMax = yCenter + newYRange / 2;
        }

        // Asegurar que los rangos no sean cero
        if (xRange === 0) {
            xMin = xMinIter - 1;
            xMax = xMaxIter + 1;
        }
        if (yRange === 0) {
            yMin = yMinIter - 1;
            yMax = yMaxIter + 1;
        }

        // ── Curvas g(x) e y = x ────────────────────────────────────────
        const gPoints = [], identityPoints = [];
        const step  = (xMax - xMin) / 400;

        for (let x = xMin; x <= xMax; x += step) {
            try {
                const gx = math.evaluate(gStr, { x });
                if (isFinite(gx) && !isNaN(gx)) {
                    gPoints.push({ x, y: gx });
                    identityPoints.push({ x, y: x });
                }
            } catch (e) { /* ignorar */ }
        }

        // ── Trayectoria de telaraña (solo iteraciones seleccionadas) ─────────
        const trajectoryPoints = [];
        selectedIterations.forEach(iter => {
            trajectoryPoints.push({ x: iter.x, y: iter.x  });
            trajectoryPoints.push({ x: iter.x, y: iter.gx });
        });

        // ── Un dataset por iteración ───
        const iterDatasets = selectedIterations.map((iter, idx) => ({
            label: `i=${iter.i}  x=${iter.x.toPrecision(5)}  g(x)=${iter.gx.toPrecision(5)}`,
            data: [{ x: iter.x, y: iter.gx }],
            backgroundColor: '#000000',
            borderColor:     '#000000',
            showLine: false,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointStyle: 'circle',
            borderWidth: 2
        }));

        // Plugin para etiquetas
        const labelPlugin = {
            id: 'iterLabels',
            afterDatasetsDraw(chart) {
                const { ctx } = chart;
                chart.data.datasets.forEach((ds, dsIdx) => {
                    if (!ds._isIterPoint) return;
                    const meta = chart.getDatasetMeta(dsIdx);
                    meta.data.forEach((point, i) => {
                        const label = ds._iterLabel;
                        ctx.save();
                        ctx.font = 'bold 13px Inter, sans-serif';
                        ctx.fillStyle = '#000000';
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'bottom';
                        ctx.fillText(label, point.x, point.y - 10);
                        ctx.restore();
                    });
                });
            }
        };

        iterDatasets.forEach((ds, idx) => {
            ds._isIterPoint = true;
            ds._iterLabel   = `i${selectedIterations[idx].i}`;
        });

        // Plugin para título del eje Y vertical
        const yTitlePlugin = {
            id: 'yTitleVertical',
            afterDraw(chart) {
                const { ctx, scales } = chart;
                const yAxis = scales.y;
                if (!yAxis) return;
                ctx.save();
                ctx.font = 'bold 16px Inter, sans-serif';
                ctx.fillStyle = colorTitle;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.translate(yAxis.left - 20, yAxis.top + (yAxis.bottom - yAxis.top) / 2);
                ctx.rotate(-Math.PI / 2);
                ctx.fillText('y', 0, 0);
                ctx.restore();
            }
        };

        const chart = new Chart(ctx, {
            type: 'scatter',
            plugins: [labelPlugin, yTitlePlugin],
            data: {
                datasets: [
                    {
                        label: 'y = g(x)',
                        data: gPoints,
                        borderColor: colorCurve,
                        backgroundColor: colorCurve,
                        showLine: true,
                        pointRadius: 0,
                        borderWidth: 2.5
                    },
                    {
                        label: 'y = x',
                        data: identityPoints,
                        borderColor: colorSecond,
                        backgroundColor: colorSecond,
                        showLine: true,
                        pointRadius: 0,
                        borderWidth: 1.5,
                        borderDash: [7, 4]
                    },
                    {
                        label: 'Trayectoria telaraña',
                        data: trajectoryPoints,
                        borderColor: 'rgba(0,0,0,0.4)',
                        backgroundColor: 'rgba(0,0,0,0.4)',
                        showLine: true,
                        pointRadius: 0,
                        borderWidth: 1.2,
                        borderDash: [3, 3]
                    },
                    ...iterDatasets
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 300 },
                plugins: {
                    title: {
                        display: true,
                        text: selectedIterations.length === allIterations.length
                            ? `Todas las iteraciones (${allIterations.length})`
                            : `${selectedIterations.length} iteraciones seleccionadas de ${allIterations.length} totales`,
                        font: { size: 14, weight: '600', family: 'Inter, sans-serif' },
                        color: colorTitle,
                        padding: { bottom: 10 }
                    },
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        type: 'linear',
                        min: xMin,
                        max: xMax,
                        position: 'bottom',
                        title: {
                            display: true,
                            text: 'x',
                            font: { size: 16, weight: '700' },
                            color: colorTitle
                        },
                        grid: { color: colorGrid },
                        ticks: {
                            color: colorTicks,
                            font: { size: 14, weight: '600' }
                        }
                    },
                    y: {
                        type: 'linear',
                        min: yMin,
                        max: yMax,
                        position: 'left',
                        title: {
                            display: false
                        },
                        grid: { color: colorGrid },
                        ticks: {
                            color: colorTicks,
                            font: { size: 14, weight: '600' }
                        }
                    }
                }
            }
        });

        this.charts.push(chart);
    }

    displayPointsList(selectedIterations, totalIterations) {
        const chartContainer = document.querySelector('.chart-container');
        const moduleContainer = document.querySelector('.module-container');

        // Eliminar lista existente del module-container
        const existingList = moduleContainer.querySelector('.points-list');
        if (existingList) {
            existingList.remove();
        }

        // Detener animación de espera
        this.stopWaitingAnimation();

        // Crear lista de puntos FUERA del chart-container
        const pointsList = document.createElement('div');
        pointsList.className = 'points-list';

        let html = '<h4>Puntos mostrados en la gráfica:</h4>';
        html += '<div class="points-grid">';

        selectedIterations.forEach(iter => {
            html += `
                <div class="point-item">
                    <span class="point-iteration">i${iter.i}</span>
                    <span class="point-coordinates">x = ${iter.x.toPrecision(6)}, g(x) = ${iter.gx.toPrecision(6)}</span>
                </div>
            `;
        });

        html += '</div>';

        if (selectedIterations.length < totalIterations) {
            html += `<p class="points-note">Se muestran ${selectedIterations.length} puntos seleccionados de ${totalIterations} iteraciones totales para mejor visualización.</p>`;
        }

        pointsList.innerHTML = html;
        // Agregar al module-container DESPUÉS del chart-container
        moduleContainer.appendChild(pointsList);
    }

    startWaitingAnimation() {
        const chartContainer = document.querySelector('#fixed-point .chart-container');
        const resultsContent = document.querySelector('#fixed-point .results-content');

        if (chartContainer) {
            chartContainer.classList.add('waiting-animation');
        }

        if (resultsContent) {
            resultsContent.classList.add('waiting-animation');
        }
    }

    stopWaitingAnimation() {
        const chartContainer = document.querySelector('#fixed-point .chart-container');
        const resultsContent = document.querySelector('#fixed-point .results-content');

        if (chartContainer) {
            chartContainer.classList.remove('waiting-animation');
        }

        if (resultsContent) {
            resultsContent.classList.remove('waiting-animation');
        }
    }
}

// Inicializar módulo
const fixedPointModule = new FixedPointModule();
