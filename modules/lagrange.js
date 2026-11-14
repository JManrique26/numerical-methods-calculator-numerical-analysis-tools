// Módulo: Interpolación de Lagrange
class LagrangeModule {
    constructor() {
        this.chart = null;
        this.initEventListeners();
        // Iniciar animación de espera al cargar
        this.startWaitingAnimation();
    }

    initEventListeners() {
        document.getElementById('lagrange-calculate').addEventListener('click', () => this.calculate());
        document.getElementById('lagrange-clear').addEventListener('click', () => this.clear());
        document.getElementById('add-point').addEventListener('click', () => this.addPoint());

        // Event listeners para eliminar puntos
        document.getElementById('points-container').addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-point')) {
                this.removePoint(e.target);
            }
        });
    }

    showError(message) {
        const errorDiv = document.getElementById('lagrange-error');
        errorDiv.textContent = message;
        errorDiv.classList.add('show');

        // WCAG 3.3.1: Marcar inputs inválidos con aria-invalid
        const inputs = document.querySelectorAll('.point-x, .point-y');
        inputs.forEach(input => {
            input.setAttribute('aria-invalid', 'true');
        });
    }

    clearError() {
        const errorDiv = document.getElementById('lagrange-error');
        errorDiv.classList.remove('show');

        // WCAG 3.3.1: Remover aria-invalid cuando no hay error
        const inputs = document.querySelectorAll('.point-x, .point-y');
        inputs.forEach(input => {
            input.removeAttribute('aria-invalid');
        });
    }

    addPoint() {
        const container = document.getElementById('points-container');
        const pointCount = container.children.length;
        
        const div = document.createElement('div');
        div.className = 'point-row';
        div.innerHTML = `
            <input type="number" class="point-x" placeholder="x${pointCount + 1}">
            <input type="number" class="point-y" placeholder="y${pointCount + 1}">
            <button class="btn btn-danger btn-sm remove-point">Eliminar</button>
        `;
        
        container.appendChild(div);
        this.updateRemoveButtons();
    }

    removePoint(button) {
        const row = button.closest('.point-row');
        row.remove();
        this.updateRemoveButtons();
        this.updatePointPlaceholders();
    }

    updateRemoveButtons() {
        const container = document.getElementById('points-container');
        const buttons = container.querySelectorAll('.remove-point');
        buttons.forEach((btn, index) => {
            btn.disabled = container.children.length <= 2;
        });
    }

    updatePointPlaceholders() {
        const container = document.getElementById('points-container');
        const rows = container.querySelectorAll('.point-row');
        rows.forEach((row, index) => {
            const inputs = row.querySelectorAll('input');
            inputs[0].placeholder = `x${index + 1}`;
            inputs[1].placeholder = `y${index + 1}`;
        });
    }

    clear() {
        const container = document.getElementById('points-container');
        container.innerHTML = `
            <div class="point-row">
                <input type="number" class="point-x" placeholder="x₁" value="0">
                <input type="number" class="point-y" placeholder="y₁" value="1">
                <button class="btn btn-danger btn-sm remove-point" disabled>Eliminar</button>
            </div>
            <div class="point-row">
                <input type="number" class="point-x" placeholder="x₂" value="1">
                <input type="number" class="point-y" placeholder="y₂" value="2">
                <button class="btn btn-danger btn-sm remove-point">Eliminar</button>
            </div>
            <div class="point-row">
                <input type="number" class="point-x" placeholder="x₃" value="2">
                <input type="number" class="point-y" placeholder="y₃" value="5">
                <button class="btn btn-danger btn-sm remove-point">Eliminar</button>
            </div>
        `;
        this.clearError();
        document.getElementById('lagrange-results').innerHTML = '<h3>Resultados</h3><p class="placeholder">Ingresa los puntos y haz clic en "Calcular Polinomio"</p>';
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }

        // Iniciar animación de espera
        this.startWaitingAnimation();
    }

    getPoints() {
        const container = document.getElementById('points-container');
        const rows = container.querySelectorAll('.point-row');
        const points = [];

        for (let row of rows) {
            const xInput = row.querySelector('.point-x');
            const yInput = row.querySelector('.point-y');
            
            const x = parseFloat(xInput.value);
            const y = parseFloat(yInput.value);

            if (isNaN(x) || isNaN(y)) {
                return { valid: false, error: 'Error: Todos los valores de x e y deben ser números válidos.' };
            }

            points.push({ x, y });
        }

        return { valid: true, points };
    }

    validatePoints(points) {
        // Verificar nodos duplicados
        const xValues = points.map(p => p.x);
        const uniqueX = new Set(xValues);
        
        if (uniqueX.size !== xValues.length) {
            const duplicates = xValues.filter((x, i) => xValues.indexOf(x) !== i);
            return {
                valid: false,
                error: `Error: No se permiten nodos duplicados en la interpolación de Lagrange. Los valores de x deben ser únicos. Valores duplicados encontrados: ${duplicates.join(', ')}. La interpolación de Lagrange requiere que cada nodo xᵢ sea distinto para que el polinomio esté bien definido.`
            };
        }

        // Verificar que haya al menos 2 puntos
        if (points.length < 2) {
            return {
                valid: false,
                error: 'Error: Se requieren al menos 2 puntos para realizar la interpolación de Lagrange.'
            };
        }

        return { valid: true };
    }

    calculateLagrange(x, points) {
        let result = 0;
        const n = points.length;

        for (let i = 0; i < n; i++) {
            let term = points[i].y;
            for (let j = 0; j < n; j++) {
                if (i !== j) {
                    term *= (x - points[j].x) / (points[i].x - points[j].x);
                }
            }
            result += term;
        }

        return result;
    }

    generatePolynomialExpression(points) {
        // Generar una representación simbólica con MathJax
        const n = points.length;
        let expression = '<div class="formula-display">';
        expression += '$$P(x) = ';
        
        for (let i = 0; i < n; i++) {
            if (i > 0) expression += ' + ';
            expression += `${points[i].y} \\cdot L_${i}(x)`;
        }

        expression += '$$</div>';

        expression += '<p class="formula-subtitle">Donde cada polinomio base $L_i(x)$ es:</p>';

        for (let i = 0; i < n; i++) {
            expression += '<div class="formula-display">';
            expression += '$$L_' + i + '(x) = ';
            let numerator = '';
            let denominator = 1;

            for (let j = 0; j < n; j++) {
                if (i !== j) {
                    if (numerator) numerator += ' \\cdot ';
                    numerator += `(x - ${points[j].x})`;
                    denominator *= (points[i].x - points[j].x);
                }
            }

            expression += '\\frac{' + numerator + '}{' + denominator.toFixed(4) + '}$$';
            expression += '</div>';
        }

        return expression;
    }

    calculate() {
        this.clearError();

        const pointsResult = this.getPoints();
        if (!pointsResult.valid) {
            this.showError(pointsResult.error);
            return;
        }

        const points = pointsResult.points;
        const validation = this.validatePoints(points);
        if (!validation.valid) {
            this.showError(validation.error);
            return;
        }

        // Generar puntos para graficar el polinomio — extender para que cruce toda la gráfica
        const xMin = Math.min(...points.map(p => p.x)) - 2;
        const xMax = Math.max(...points.map(p => p.x)) + 2;
        const step = (xMax - xMin) / 400;

        const polynomialPoints = [];
        for (let x = xMin; x <= xMax; x += step) {
            const y = this.calculateLagrange(x, points);
            polynomialPoints.push({ x, y });
        }

        // Mostrar resultados
        this.displayResults(points, polynomialPoints);
        this.plotChart(points, polynomialPoints);

        // Detener animación de espera
        this.stopWaitingAnimation();

        // Guardar en historial
        const pointsStr = points.map(p => `(${p.x}, ${p.y})`).join(', ');
        const historyItem = {
            type: 'Interpolación de Lagrange',
            date: new Date().toISOString(),
            parameters: {
                'Puntos': pointsStr,
                'Grado del polinomio': points.length - 1
            },
            result: `Polinomio de grado ${points.length - 1} calculado exitosamente`
        };
        HistoryModule.saveItem(historyItem);
    }

    displayResults(points, polynomialPoints) {
        const resultsDiv = document.getElementById('lagrange-results');

        let html = '<h3>Resultados</h3>';
        html += `<div class="print-actions">
            <button type="button" class="btn btn-secondary btn-sm" onclick="printCalculation('lagrange')">Guardar PDF</button>
        </div>`;

        html += '<h4>Puntos de Interpolación:</h4>';
        const VISIBLE = 10;
        html += `<div class="table-scroll" style="max-height:${VISIBLE * 45}px; overflow-y:auto; margin-bottom:1rem;">`;
        html += '<table>';
        html += '<thead><tr><th>i</th><th>xᵢ</th><th>yᵢ</th></tr></thead>';
        html += '<tbody>';
        points.forEach((point, index) => {
            html += `<tr>
                <td>${index}</td>
                <td>${point.x}</td>
                <td>${point.y}</td>
            </tr>`;
        });
        html += '</tbody></table>';
        html += '</div>';
        if (points.length > VISIBLE) {
            html += `<p class="table-scroll-hint">Desplaza para ver el resto de los puntos.</p>`;
        }

        html += '<h4>Expresión del Polinomio:</h4>';
        html += '<div class="polynomial-expression">';
        html += this.generatePolynomialExpression(points);
        html += '</div>';

        html += '<p class="info">El polinomio de Lagrange de grado ' + (points.length - 1) + ' pasa exactamente por todos los puntos dados.</p>';

        resultsDiv.innerHTML = html;

        // Renderizar fórmulas MathJax y luego igualar altura
        if (window.MathJax) {
            MathJax.typesetPromise([resultsDiv]).then(() => {
                if (window.matchResultsHeight) matchResultsHeight('lagrange');
            });
        } else {
            if (window.matchResultsHeight) matchResultsHeight('lagrange');
        }
    }

    plotChart(points, polynomialPoints) {
        const ctx = document.getElementById('lagrange-chart').getContext('2d');
        if (this.chart) { this.chart.destroy(); }

        const PALETTE = [
            '#000000','#333333','#666666','#1a1a1a','#4a4a4a',
            '#2a2a2a','#808080','#3a3a3a','#606060','#555555'
        ];
        const getColor = i => PALETTE[i % PALETTE.length];

        const colorCurve = '#000000';
        const colorGrid  = 'rgba(0, 0, 0, 0.08)';
        const colorTicks = '#333333';
        const colorTitle = '#000000';

        // Plugin para dibujar etiquetas encima de los puntos de control
        const labelPlugin = {
            id: 'nodeLabels',
            afterDatasetsDraw(chart) {
                const { ctx } = chart;
                chart.data.datasets.forEach((ds, dsIdx) => {
                    if (!ds._isNode) return;
                    const meta = chart.getDatasetMeta(dsIdx);
                    meta.data.forEach(pt => {
                        ctx.save();
                        ctx.font = 'bold 11px Inter, sans-serif';
                        ctx.fillStyle = '#1a1a1a';
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'bottom';
                        ctx.fillText(ds._nodeLabel, pt.x, pt.y - 8);
                        ctx.restore();
                    });
                });
            }
        };

        // Un dataset por punto de control
        const nodeDatasets = points.map((p, idx) => {
            const ds = {
                label: `P${idx} = (${p.x}, ${p.y})`,
                data: [{ x: p.x, y: p.y }],
                backgroundColor: getColor(idx),
                borderColor:     getColor(idx),
                showLine: false,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointStyle: 'circle',
                _isNode: true,
                _nodeLabel: `P${idx}`
            };
            return ds;
        });

        // Plugin para título del eje Y horizontal
        const yLabelPlugin = {
            id: 'yLabelHorizontal',
            afterDraw(chart) {
                const { ctx, scales } = chart;
                const yAxis = scales.y;
                if (!yAxis) return;
                ctx.save();
                ctx.font = '600 12px Inter, sans-serif';
                ctx.fillStyle = colorTitle;
                ctx.textAlign = 'left';
                ctx.textBaseline = 'top';
                ctx.fillText('P(x)', yAxis.left - yAxis.width + 4, chart.chartArea.top - 18);
                ctx.restore();
            }
        };

        this.chart = new Chart(ctx, {
            type: 'scatter',
            plugins: [labelPlugin, yLabelPlugin],
            data: {
                datasets: [
                    {
                        label: 'Polinomio P(x)',
                        data: polynomialPoints,
                        borderColor: colorCurve,
                        backgroundColor: colorCurve,
                        showLine: true,
                        pointRadius: 0,
                        borderWidth: 2.5
                    },
                    ...nodeDatasets
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 300 },
                plugins: {
                    title: {
                        display: true,
                        text: `Interpolación de Lagrange — grado ${points.length - 1} — cada punto es un nodo P_i`,
                        font: { size: 14, weight: '600', family: 'Inter, sans-serif' },
                        color: colorTitle,
                        padding: { bottom: 10 }
                    },
                    legend: {
                        position: 'bottom',
                        align: 'start',
                        labels: {
                            font: { size: 11 },
                            usePointStyle: true,
                            padding: 10,
                            color: colorTitle
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: ctx => {
                                const p = ctx.parsed;
                                if (ctx.dataset._isNode) {
                                    return [
                                        ` Nodo ${ctx.dataset._nodeLabel}`,
                                        ` x = ${p.x}`,
                                        ` y = ${p.y}`
                                    ];
                                }
                                return ` P(${p.x.toPrecision(5)}) = ${p.y.toPrecision(5)}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        type: 'linear',
                        title: {
                            display: true,
                            text: 'x',
                            font: { size: 13, weight: '600' },
                            color: colorTitle,
                            rotation: 0
                        },
                        grid:  { color: colorGrid },
                        ticks: { color: colorTicks }
                    },
                    y: {
                        type: 'linear',
                        title: { display: false },
                        grid:  { color: colorGrid },
                        ticks: { color: colorTicks }
                    }
                }
            }
        });
    }

    startWaitingAnimation() {
        const chartContainer = document.querySelector('#lagrange .chart-container');
        const resultsContent = document.querySelector('#lagrange .results-content');

        if (chartContainer) {
            chartContainer.classList.add('waiting-animation');
        }

        if (resultsContent) {
            resultsContent.classList.add('waiting-animation');
        }
    }

    stopWaitingAnimation() {
        const chartContainer = document.querySelector('#lagrange .chart-container');
        const resultsContent = document.querySelector('#lagrange .results-content');

        if (chartContainer) {
            chartContainer.classList.remove('waiting-animation');
        }

        if (resultsContent) {
            resultsContent.classList.remove('waiting-animation');
        }
    }
}

// Inicializar módulo
const lagrangeModule = new LagrangeModule();
