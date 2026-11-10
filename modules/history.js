// Módulo: Historial de Ejercicios
class HistoryModule {
    static STORAGE_KEY = 'numerical_analysis_history';
    static PAGE_SIZE   = 5;
    static currentPage = 1;

    static saveItem(item) {
        const history = this.getHistory();
        history.unshift(item);
        if (history.length > 50) history.pop();
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
        this.currentPage = 1;   // volver a la primera página al guardar
        this.displayHistory();
    }

    static getHistory() {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    }

    static clearHistory() {
        localStorage.removeItem(this.STORAGE_KEY);
        this.currentPage = 1;
        this.displayHistory();
    }

    static exportHistory() {
        const history = this.getHistory();
        const dataStr = JSON.stringify(history, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'historial_analisis_numerico.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    static deleteItem(index) {
        const history = this.getHistory();
        history.splice(index, 1);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
        // Ajustar página si quedó vacía
        const totalPages = Math.max(1, Math.ceil(history.length / this.PAGE_SIZE));
        if (this.currentPage > totalPages) this.currentPage = totalPages;
        this.displayHistory();
    }

    static loadItem(index) {
        const history = this.getHistory();
        const item = history[index];
        if (!item) return;
        switch (item.type) {
            case 'Iteración de Punto Fijo':   this.loadFixedPoint(item);  break;
            case 'Interpolación de Lagrange': this.loadLagrange(item);    break;
            case 'Integración Numérica':      this.loadIntegration(item); break;
        }
        this.switchToTab(item.type);
    }

    static loadFixedPoint(item) {
        document.getElementById('fixed-function').value = item.parameters['Función g(x)'];
        document.getElementById('fixed-x0').value       = item.parameters['x₀'];
        document.getElementById('fixed-tolerance').value = item.parameters['Tolerancia'];
        document.getElementById('fixed-max-iter').value  = item.parameters['Iteraciones'];
    }

    static loadLagrange(item) {
        const pointsStr = item.parameters['Puntos'];
        const points = pointsStr.match(/\(([^,]+),\s*([^)]+)\)/g);
        if (points) {
            const container = document.getElementById('points-container');
            container.innerHTML = '';
            points.forEach((pointStr, index) => {
                const match = pointStr.match(/\(([^,]+),\s*([^)]+)\)/);
                if (match) {
                    const x = match[1].trim();
                    const y = match[2].trim();
                    const div = document.createElement('div');
                    div.className = 'point-row';
                    div.innerHTML = `
                        <input type="number" class="point-x" placeholder="x${index + 1}" value="${x}">
                        <input type="number" class="point-y" placeholder="y${index + 1}" value="${y}">
                        <button class="btn btn-danger btn-sm remove-point" ${index < 2 ? 'disabled' : ''}>Eliminar</button>
                    `;
                    container.appendChild(div);
                }
            });
        }
    }

    static loadIntegration(item) {
        document.getElementById('int-function').value = item.parameters['Función f(x)'];
        const interval = item.parameters['Intervalo'];
        const match = interval.match(/\[([^,]+),\s*([^\]]+)\]/);
        if (match) {
            document.getElementById('int-a').value = match[1].trim();
            document.getElementById('int-b').value = match[2].trim();
        }
        document.getElementById('int-n').value = item.parameters['Subintervalos'];
        const method = item.parameters['Método'];
        if (method === 'Regla del Trapecio')
            document.querySelector('input[name="int-method"][value="trapezoid"]').checked = true;
        else if (method === 'Simpson 1/3')
            document.querySelector('input[name="int-method"][value="simpson13"]').checked = true;
        else if (method === 'Simpson 3/8')
            document.querySelector('input[name="int-method"][value="simpson38"]').checked = true;
    }

    static switchToTab(type) {
        let tabId, subTabId;
        switch (type) {
            case 'Iteración de Punto Fijo':   tabId = 'fixed-point'; break;
            case 'Interpolación de Lagrange': tabId = 'interpolation'; subTabId = 'lagrange';    break;
            case 'Integración Numérica':      tabId = 'interpolation'; subTabId = 'integration'; break;
        }
        if (tabId) {
            const tabBtn = document.querySelector(`[role="tab"][aria-controls="${tabId}"]`);
            if (tabBtn) tabBtn.click();
        }
        if (subTabId) {
            setTimeout(() => {
                const subBtn = document.querySelector(`[role="tab"][aria-controls="${subTabId}"]`);
                if (subBtn) subBtn.click();
            }, 80);
        }
    }

    static displayHistory(page) {
        if (page !== undefined) this.currentPage = page;

        const history    = this.getHistory();
        const historyList = document.getElementById('history-list');

        if (history.length === 0) {
            historyList.innerHTML = '<p class="placeholder">No hay ejercicios en el historial</p>';
            return;
        }

        const totalPages = Math.max(1, Math.ceil(history.length / this.PAGE_SIZE));
        if (this.currentPage > totalPages) this.currentPage = totalPages;
        if (this.currentPage < 1)          this.currentPage = 1;

        const start = (this.currentPage - 1) * this.PAGE_SIZE;
        const end   = Math.min(start + this.PAGE_SIZE, history.length);
        const pageItems = history.slice(start, end);

        let html = '';

        // ── Ítems de la página actual ──────────────────────────────────
        pageItems.forEach((item, pageIdx) => {
            const globalIdx = start + pageIdx;   // índice real en el array completo
            const date = new Date(item.date).toLocaleString('es-ES');

            html += '<div class="history-item">';
            html += '<div class="history-item-header">';
            html += `<span class="history-item-type">${item.type}</span>`;
            html += `<span class="history-item-date">${date}</span>`;
            html += '</div>';
            html += '<div class="history-item-details">';
            for (const [key, value] of Object.entries(item.parameters)) {
                html += `<strong>${key}:</strong> ${value}<br>`;
            }
            html += `<strong>Resultado:</strong> ${item.result}`;
            html += '</div>';
            html += '<div class="history-item-actions">';
            html += `<button class="btn btn-primary btn-sm" onclick="HistoryModule.loadItem(${globalIdx})">Recargar</button>`;
            html += `<button class="btn btn-danger btn-sm" onclick="HistoryModule.deleteItem(${globalIdx})">Eliminar</button>`;
            html += '</div>';
            html += '</div>';
        });

        // ── Paginación ─────────────────────────────────────────────────
        if (totalPages > 1) {
            html += '<div class="history-pagination">';
            html += `<button class="btn btn-secondary btn-sm" onclick="HistoryModule.displayHistory(${this.currentPage - 1})" ${this.currentPage === 1 ? 'disabled' : ''}>← Anterior</button>`;

            for (let p = 1; p <= totalPages; p++) {
                const active = p === this.currentPage ? 'btn-primary' : 'btn-secondary';
                html += `<button class="btn ${active} btn-sm history-page-btn" onclick="HistoryModule.displayHistory(${p})">${p}</button>`;
            }

            html += `<button class="btn btn-secondary btn-sm" onclick="HistoryModule.displayHistory(${this.currentPage + 1})" ${this.currentPage === totalPages ? 'disabled' : ''}>Siguiente →</button>`;
            html += `<span class="history-page-info">Página ${this.currentPage} de ${totalPages} &nbsp;·&nbsp; ${history.length} ejercicios</span>`;
            html += '</div>';
        }

        historyList.innerHTML = html;
    }
}

// Inicializar historial al cargar
document.addEventListener('DOMContentLoaded', () => {
    HistoryModule.displayHistory();

    document.getElementById('clear-history').addEventListener('click', () => {
        if (confirm('¿Estás seguro de que deseas eliminar todo el historial?')) {
            HistoryModule.clearHistory();
        }
    });

    document.getElementById('export-history').addEventListener('click', () => {
        HistoryModule.exportHistory();
    });
});
