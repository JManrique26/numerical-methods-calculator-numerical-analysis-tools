// Módulo: Integración Numérica
class IntegrationModule {
    constructor() {
        this.chart = null;
        this.initEventListeners();
        // Iniciar animación de espera al cargar
        this.startWaitingAnimation();
    }

    initEventListeners() {
        document.getElementById('int-calculate').addEventListener('click', () => this.calculate());
        document.getElementById('int-clear').addEventListener('click', () => this.clear());
    }

    showError(message) {
        const errorDiv = document.getElementById('int-error');
        errorDiv.textContent = message;
        errorDiv.classList.add('show');

        // WCAG 3.3.1: Marcar inputs inválidos con aria-invalid
        const inputs = document.querySelectorAll('#int-function, #int-a, #int-b, #int-n');
        inputs.forEach(input => {
            input.setAttribute('aria-invalid', 'true');
        });
    }

    clearError() {
        const errorDiv = document.getElementById('int-error');
        errorDiv.classList.remove('show');

        // WCAG 3.3.1: Remover aria-invalid cuando no hay error
        const inputs = document.querySelectorAll('#int-function, #int-a, #int-b, #int-n');
        inputs.forEach(input => {
            input.removeAttribute('aria-invalid');
        });
    }

    clear() {
        document.getElementById('int-function').value = 'x^2';
        document.getElementById('int-a').value = '0';
        document.getElementById('int-b').value = '2';
        document.getElementById('int-n').value = '10';
        document.querySelector('input[name="int-method"][value="trapezoid"]').checked = true;
        this.clearError();
        document.getElementById('int-results').innerHTML =
            '<h3>Resultados</h3><p class="placeholder">Ingresa los parámetros y haz clic en "Calcular Integral"</p>';
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }

        // Iniciar animación de espera
        this.startWaitingAnimation();
    }

    validateFunction(fStr, x) {
        try {
            const scope = { x };
            const result = math.evaluate(fStr, scope);
            if (typeof result !== 'number' || isNaN(result) || !isFinite(result)) {
                return {
                    valid: false,
                    error: `Error: La función evaluada en x = ${x.toFixed(6)} no produjo un número válido.`
                };
            }
            return { valid: true, result };
        } catch (e) {
            let errorMsg = `Error: La función "${fStr}" no es válida. `;
            if (e.message.includes('Unexpected token'))
                errorMsg += 'Verifica la sintaxis: usa +, -, *, /, ^, ().';
            else if (e.message.includes('sqrt'))
                errorMsg += `Raíz cuadrada de número negativo en x = ${x.toFixed(6)}.`;
            else if (e.message.includes('log'))
                errorMsg += `Logaritmo de número no positivo en x = ${x.toFixed(6)}.`;
            else if (e.message.includes('divide'))
                errorMsg += `División por cero en x = ${x.toFixed(6)}.`;
            else
                errorMsg += `Detalle: ${e.message}`;
            return { valid: false, error: errorMsg };
        }
    }

    calculate() {
        this.clearError();

        const fStr   = document.getElementById('int-function').value.trim();
        const a      = parseFloat(document.getElementById('int-a').value);
        const b      = parseFloat(document.getElementById('int-b').value);
        const n      = parseInt(document.getElementById('int-n').value);
        const method = document.querySelector('input[name="int-method"]:checked').value;

        if (!fStr) { this.showError('Error: Debes ingresar una función f(x).'); return; }
        if (isNaN(a) || isNaN(b)) { this.showError('Error: Los límites deben ser números válidos.'); return; }
        if (a >= b) { this.showError('Error: El límite inferior a debe ser menor que b.'); return; }
        if (isNaN(n) || n < 1) { this.showError('Error: n debe ser al menos 1.'); return; }

        const f_a = this.validateFunction(fStr, a);
        if (!f_a.valid) { this.showError(f_a.error); return; }
        const f_b = this.validateFunction(fStr, b);
        if (!f_b.valid) { this.showError(f_b.error); return; }

        if (method === 'simpson13' && n % 2 !== 0) {
            this.showError(`Error: Simpson 1/3 requiere n par. n = ${n} es impar.`);
            return;
        }
        if (method === 'simpson38' && n % 3 !== 0) {
            this.showError(`Error: Simpson 3/8 requiere n múltiplo de 3. n = ${n} no lo es.`);
            return;
        }

        let result;
        switch (method) {
            case 'trapezoid':  result = this.trapezoidRule(fStr, a, b, n); break;
            case 'simpson13':  result = this.simpson13Rule(fStr, a, b, n); break;
            case 'simpson38':  result = this.simpson38Rule(fStr, a, b, n); break;
        }
        if (!result) return;

        this.displayResults(result, method, fStr, a, b, n);
        this.plotChart(fStr, a, b, result.partitions, method);

        // Detener animación de espera
        this.stopWaitingAnimation();

        HistoryModule.saveItem({
            type: 'Integración Numérica',
            date: new Date().toISOString(),
            parameters: {
                'Función f(x)': fStr,
                'Intervalo': `[${a}, ${b}]`,
                'Subintervalos': n,
                'Método': this.getMethodName(method)
            },
            result: `Integral aproximada: ${result.value.toPrecision(8)}`
        });
    }

    getMethodName(method) {
        return { trapezoid: 'Regla del Trapecio', simpson13: 'Simpson 1/3', simpson38: 'Simpson 3/8' }[method];
    }

    trapezoidRule(fStr, a, b, n) {
        const h = (b - a) / n;
        const partitions = [];
        let sum = 0;
        for (let i = 0; i <= n; i++) {
            const x   = a + i * h;
            const f_x = this.validateFunction(fStr, x);
            if (!f_x.valid) { this.showError(f_x.error); return null; }
            const weight = (i === 0 || i === n) ? 1 : 2;
            sum += weight * f_x.result;
            partitions.push({ i, x, f_x: f_x.result, weight, contribution: weight * f_x.result });
        }
        return { value: (h / 2) * sum, partitions };
    }

    simpson13Rule(fStr, a, b, n) {
        const h = (b - a) / n;
        const partitions = [];
        let sum = 0;
        for (let i = 0; i <= n; i++) {
            const x   = a + i * h;
            const f_x = this.validateFunction(fStr, x);
            if (!f_x.valid) { this.showError(f_x.error); return null; }
            const weight = (i === 0 || i === n) ? 1 : (i % 2 === 1 ? 4 : 2);
            sum += weight * f_x.result;
            partitions.push({ i, x, f_x: f_x.result, weight, contribution: weight * f_x.result });
        }
        return { value: (h / 3) * sum, partitions };
    }

    simpson38Rule(fStr, a, b, n) {
        const h = (b - a) / n;
        const partitions = [];
        let sum = 0;
        for (let i = 0; i <= n; i++) {
            const x   = a + i * h;
            const f_x = this.validateFunction(fStr, x);
            if (!f_x.valid) { this.showError(f_x.error); return null; }
            const weight = (i === 0 || i === n) ? 1 : (i % 3 === 0 ? 2 : 3);
            sum += weight * f_x.result;
            partitions.push({ i, x, f_x: f_x.result, weight, contribution: weight * f_x.result });
        }
        return { value: (3 * h / 8) * sum, partitions };
    }

    displayResults(result, method, fStr, a, b, n) {
        const resultsDiv = document.getElementById('int-results');
        const h = (b - a) / n;

        // Fórmula LaTeX según el método
        const formulaMap = {
            trapezoid: `\\int_{${a}}^{${b}} f(x)\\,dx \\approx \\frac{h}{2}\\left[f(x_0)+2\\sum_{i=1}^{n-1}f(x_i)+f(x_n)\\right]`,
            simpson13: `\\int_{${a}}^{${b}} f(x)\\,dx \\approx \\frac{h}{3}\\left[f(x_0)+4\\sum_{\\text{impar}}f(x_i)+2\\sum_{\\text{par}}f(x_i)+f(x_n)\\right]`,
            simpson38: `\\int_{${a}}^{${b}} f(x)\\,dx \\approx \\frac{3h}{8}\\left[f(x_0)+3\\sum_{i\\not\\equiv 0}f(x_i)+2\\sum_{i\\equiv 0}f(x_i)+f(x_n)\\right]`
        };

        let html = '<h3>Resultados</h3>';

        html += '<div class="summary">';
        html += `<p><strong>Método:</strong> ${this.getMethodName(method)}</p>`;
        html += `<p><strong>Función:</strong> $f(x) = ${fStr}$</p>`;
        html += `<p><strong>Intervalo:</strong> $[${a},\\, ${b}]$, $\\;h = ${h.toPrecision(6)}$</p>`;
        html += `<p><strong>Subintervalos:</strong> $n = ${n}$</p>`;
        html += `<p><strong>Integral aproximada:</strong> <span class="result-value">${result.value.toPrecision(10)}</span></p>`;
        html += '</div>';

        html += '<div class="formula-display" style="margin:1rem 0;">';
        html += `$$${formulaMap[method]}$$`;
        html += '</div>';

        html += '<h4>Tabla de particiones:</h4>';
        const VISIBLE = 10;
        html += `<div class="table-scroll" style="max-height:${VISIBLE * 45}px; overflow-y:auto; margin-bottom:1rem;">`;
        html += '<table>';
        html += '<thead><tr><th scope="col">i</th><th scope="col">xᵢ</th><th scope="col">f(xᵢ)</th><th scope="col">Peso wᵢ</th><th scope="col">wᵢ · f(xᵢ)</th></tr></thead>';
        html += '<tbody>';
        result.partitions.forEach(p => {
            html += `<tr>
                <td>${p.i}</td>
                <td>${p.x.toPrecision(8)}</td>
                <td>${p.f_x.toPrecision(8)}</td>
                <td>${p.weight}</td>
                <td>${p.contribution.toPrecision(8)}</td>
            </tr>`;
        });
        html += '</tbody></table>';
        html += '</div>';
        if (result.partitions.length > VISIBLE) {
            html += `<p class="table-scroll-hint">Desplaza para ver el resto de los nodos.</p>`;
        }

        html += '<div class="conclusion">';
        html += `<p class="success"><strong>Resultado:</strong> $\\displaystyle\\int_{${a}}^{${b}} ${fStr}\\,dx \\approx ${result.value.toPrecision(8)}$</p>`;
        html += '</div>';

        resultsDiv.innerHTML = html;

        // Renderizar fórmulas MathJax y luego igualar altura
        if (window.MathJax) {
            MathJax.typesetPromise([resultsDiv]).then(() => {
                if (window.matchResultsHeight) matchResultsHeight('integration');
            });
        } else {
            if (window.matchResultsHeight) matchResultsHeight('integration');
        }
    }

    plotChart(fStr, a, b, partitions, method) {
        const ctx = document.getElementById('int-chart').getContext('2d');
        if (this.chart) { this.chart.destroy(); this.chart = null; }

        const PALETTE = [
            '#000000','#333333','#666666','#1a1a1a','#4a4a4a',
            '#2a2a2a','#808080','#3a3a3a','#606060','#555555',
            '#404040','#757575','#333333','#666666','#1a1a1a'
        ];
        const getColor = i => PALETTE[i % PALETTE.length];

        const colorCurve  = '#000000';
        const colorFill   = 'rgba(0, 0, 0, 0.20)';
        const colorStroke = '#333333';
        const colorGrid   = 'rgba(0, 0, 0, 0.08)';
        const colorTicks  = '#333333';
        const colorTitle  = '#1a1a1a';

        // ── Curva continua — extendida al rango completo [a, b] ────────
        const curvePoints = [];
        const dx = (b - a) / 500;
        // Asegurar que la curva empiece y termine exactamente en a y b
        for (let i = 0; i <= 500; i++) {
            const x   = a + i * dx;
            const f_x = this.validateFunction(fStr, x);
            if (f_x.valid) curvePoints.push({ x, y: f_x.result });
        }

        // ── Paneles de área ─────────────────────────────────────────────
        const panelDatasets = this._buildPanelDatasets(partitions, method);

        // ── Plugin: etiquetas x_i sobre cada nodo ──────────────────────
        const labelPlugin = {
            id: 'nodeLabels',
            afterDatasetsDraw(chart) {
                const { ctx } = chart;
                chart.data.datasets.forEach((ds, dsIdx) => {
                    if (!ds._isNode) return;
                    const meta = chart.getDatasetMeta(dsIdx);
                    meta.data.forEach(pt => {
                        ctx.save();
                        ctx.font = 'bold 10px Inter, sans-serif';
                        ctx.fillStyle = '#1a1a1a';
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'bottom';
                        ctx.fillText(ds._nodeLabel, pt.x, pt.y - 7);
                        ctx.restore();
                    });
                });
            }
        };

        // ── Un dataset por nodo (color individual + etiqueta) ──────────
        const nodeDatasets = partitions.map((p, idx) => ({
            label: `x${p.i} = ${p.x.toPrecision(5)},  f(x${p.i}) = ${p.f_x.toPrecision(5)}`,
            data: [{ x: p.x, y: p.f_x }],
            type: 'scatter',
            backgroundColor: getColor(idx),
            borderColor:     getColor(idx),
            showLine: false,
            pointRadius: 3,
            pointHoverRadius: 5,
            pointStyle: 'circle',
            order: 0,
            _isNode: true,
            _nodeLabel: `x${p.i}`
        }));

        const allDatasets = [
            {
                label: 'f(x)',
                data: curvePoints,
                type: 'scatter',
                showLine: true,
                borderColor: colorCurve,
                backgroundColor: colorCurve,
                pointRadius: 0,
                borderWidth: 2.5,
                order: 3
            },
            ...panelDatasets.map((pts, idx) => ({
                label: idx === 0 ? 'Área aproximada' : '',
                data: pts,
                type: 'scatter',
                showLine: true,
                borderColor: colorStroke,
                backgroundColor: colorFill,
                pointRadius: 0,
                borderWidth: 1.5,
                fill: 'origin',
                order: 2
            })),
            ...nodeDatasets
        ];

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
                ctx.fillText('f(x)', yAxis.left - yAxis.width + 4, chart.chartArea.top - 18);
                ctx.restore();
            }
        };

        this.chart = new Chart(ctx, {
            type: 'scatter',
            plugins: [labelPlugin, yLabelPlugin],
            data: { datasets: allDatasets },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 300 },
                plugins: {
                    title: {
                        display: true,
                        text: `Integración Numérica — ${this.getMethodName(method)} — cada punto es un nodo x_i`,
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
                            padding: 8,
                            color: colorTitle,
                            filter: item => item.text !== ''
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: ctx => {
                                const p = ctx.parsed;
                                if (ctx.dataset._isNode) {
                                    const part = partitions.find(pp => Math.abs(pp.x - p.x) < 1e-10);
                                    if (part) {
                                        return [
                                            ` Nodo x${part.i} = ${part.x.toPrecision(7)}`,
                                            ` f(x${part.i}) = ${part.f_x.toPrecision(7)}`,
                                            ` Peso = ${part.weight}`
                                        ];
                                    }
                                }
                                return ` (${p.x.toPrecision(5)}, ${p.y.toPrecision(5)})`;
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

    /**
     * Construye un array de datasets de puntos, uno por cada subintervalo,
     * formando el polígono cerrado: (x1,0)→(x1,y1)→...→(x2,y2)→(x2,0).
     * Para Simpson dibujamos la parábola interpolada en 20 pasos internos.
     */
    _buildPanelDatasets(partitions, method) {
        const datasets = [];
        const step = method === 'simpson38' ? 3 : (method === 'simpson13' ? 2 : 1);

        for (let i = 0; i < partitions.length - 1; i += step) {
            const pts = [];
            const group = partitions.slice(i, i + step + 1);

            if (group.length < 2) continue;

            const x0 = group[0].x;
            const x1 = group[group.length - 1].x;

            // Punto base izquierdo
            pts.push({ x: x0, y: 0 });

            if (method === 'trapezoid') {
                // Línea recta entre los dos nodos
                pts.push({ x: x0, y: group[0].f_x });
                pts.push({ x: x1, y: group[group.length - 1].f_x });
            } else {
                // Interpolación de Lagrange local para dibujar curva suave
                const subSteps = 30;
                const dx = (x1 - x0) / subSteps;
                for (let k = 0; k <= subSteps; k++) {
                    const xk = x0 + k * dx;
                    let yk  = 0;
                    const n = group.length;
                    for (let ii = 0; ii < n; ii++) {
                        let term = group[ii].f_x;
                        for (let jj = 0; jj < n; jj++) {
                            if (ii !== jj)
                                term *= (xk - group[jj].x) / (group[ii].x - group[jj].x);
                        }
                        yk += term;
                    }
                    pts.push({ x: xk, y: yk });
                }
            }

            // Punto base derecho → cierra el polígono
            pts.push({ x: x1, y: 0 });

            datasets.push(pts);
        }

        return datasets;
    }

    startWaitingAnimation() {
        const chartContainer = document.querySelector('#integration .chart-container');
        const resultsContent = document.querySelector('#integration .results-content');

        if (chartContainer) {
            chartContainer.classList.add('waiting-animation');
        }

        if (resultsContent) {
            resultsContent.classList.add('waiting-animation');
        }
    }

    stopWaitingAnimation() {
        const chartContainer = document.querySelector('#integration .chart-container');
        const resultsContent = document.querySelector('#integration .results-content');

        if (chartContainer) {
            chartContainer.classList.remove('waiting-animation');
        }

        if (resultsContent) {
            resultsContent.classList.remove('waiting-animation');
        }
    }
}

// Inicializar módulo
const integrationModule = new IntegrationModule();
