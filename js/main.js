// Archivo principal: Coordinación de módulos y manejo de pestañas

document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initSubTabs();
});

// Inicializar pestañas principales
function initTabs() {
    // Selector específico: solo los tabs del nav principal (no los sub-tabs de interpolación)
    const tabListEl = document.querySelector('nav > [role="tablist"]');
    const tabButtons = tabListEl.querySelectorAll('[role="tab"]');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('aria-controls');

            // Remover clase active y actualizar aria-selected solo en tabs principales
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });
            tabContents.forEach(content => content.classList.remove('active'));

            // Activar pestaña seleccionada
            button.classList.add('active');
            button.setAttribute('aria-selected', 'true');
            document.getElementById(tabId).classList.add('active');

            // Si cambiamos a la pestaña de historial, actualizar la vista
            if (tabId === 'history') {
                HistoryModule.displayHistory();
            }

            // Si cambiamos a la pestaña de fórmulas, renderizar MathJax
            if (tabId === 'formulas' && window.MathJax) {
                MathJax.typesetPromise();
            }
        });

        // Navegación por teclado en tablist — WCAG 2.1.1 (A)
        button.addEventListener('keydown', (e) => {
            const tabs = Array.from(tabButtons);
            const index = tabs.indexOf(button);
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                tabs[(index + 1) % tabs.length].focus();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                tabs[(index - 1 + tabs.length) % tabs.length].focus();
            } else if (e.key === 'Home') {
                e.preventDefault();
                tabs[0].focus();
            } else if (e.key === 'End') {
                e.preventDefault();
                tabs[tabs.length - 1].focus();
            }
        });
    });
}

// Inicializar sub-pestañas (para interpolación e integración)
function initSubTabs() {
    // Selector específico: solo el tablist dentro de la sección #interpolation
    const subTabListEl = document.querySelector('#interpolation [role="tablist"]');
    const subTabButtons = subTabListEl.querySelectorAll('[role="tab"]');
    const subTabContents = document.querySelectorAll('.sub-tab-content');

    subTabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const subTabId = button.getAttribute('aria-controls');

            subTabButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });
            subTabContents.forEach(content => content.classList.remove('active'));

            button.classList.add('active');
            button.setAttribute('aria-selected', 'true');
            document.getElementById(subTabId).classList.add('active');
        });

        // Navegación por teclado en sub-tablist — WCAG 2.1.1 (A)
        button.addEventListener('keydown', (e) => {
            const tabs = Array.from(subTabButtons);
            const index = tabs.indexOf(button);
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                tabs[(index + 1) % tabs.length].focus();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                tabs[(index - 1 + tabs.length) % tabs.length].focus();
            }
        });
    });
}

// Utilidades globales para manejo de errores numéricos
const NumericUtils = {
    // Redondear a un número específico de decimales
    round: (value, decimals = 8) => {
        const factor = Math.pow(10, decimals);
        return Math.round(value * factor) / factor;
    },

    // Formatear número con notación científica si es muy pequeño o muy grande
    formatNumber: (value, precision = 8) => {
        if (Math.abs(value) < 0.0001 || Math.abs(value) > 10000) {
            return value.toExponential(precision);
        }
        return value.toPrecision(precision);
    },

    // Verificar si un número es finito y válido
    isValidNumber: (value) => {
        return typeof value === 'number' && isFinite(value) && !isNaN(value);
    },

    // Manejar errores de punto flotante
    safeAdd: (a, b) => {
        const result = a + b;
        return NumericUtils.isValidNumber(result) ? result : 0;
    },

    safeMultiply: (a, b) => {
        const result = a * b;
        return NumericUtils.isValidNumber(result) ? result : 0;
    }
};

// Exportar para uso en otros módulos
window.NumericUtils = NumericUtils;

// ── Altura fija del panel de resultados ────────────────────────────────────
// Guardamos la altura del input-panel en estado vacío (primera vez que es visible)
// y la aplicamos permanentemente al results-content.
// SOLO en escritorio (panels-row a 2 columnas, >1024px). En móvil/tablet los
// paneles se apilan en columna y el results-content usa la altura fija del CSS,
// para que calcular no deforme el layout.

const WIDE_LAYOUT_QUERY = '(min-width: 1025px)';

function _isWideLayout() {
    return window.matchMedia(WIDE_LAYOUT_QUERY).matches;
}

const _fixedHeights = {};   // { moduleId: px }

function _snapshotHeight(moduleId) {
    // No sobreescribir si ya la tenemos; y solo aplica en layout de 2 columnas
    if (_fixedHeights[moduleId] || !_isWideLayout()) return;
    const container = document.querySelector(`#${moduleId} .panels-row`);
    if (!container) return;
    const inputPanel = container.querySelector('.input-panel');
    if (!inputPanel) return;
    const h = inputPanel.getBoundingClientRect().height;
    if (h === 0) return;   // elemento oculto, no medir todavía
    _fixedHeights[moduleId] = h;
}

function _applyFixedHeight(moduleId) {
    const el = document.querySelector(`#${moduleId} .results-panel .results-content`);
    if (!el) return;

    // En móvil: quitar cualquier altura inline previa para que mande el CSS fijo
    if (!_isWideLayout()) {
        el.style.height    = '';
        el.style.maxHeight = '';
        el.style.overflowY = '';
        return;
    }

    const h = _fixedHeights[moduleId];
    if (!h) return;
    el.style.height    = h + 'px';
    el.style.maxHeight = h + 'px';
    el.style.overflowY = 'auto';
}

// Exponer para que los módulos la llamen después de MathJax
window.matchResultsHeight = _applyFixedHeight;

document.addEventListener('DOMContentLoaded', () => {
    // fixed-point es visible al cargar — medir ya
    _snapshotHeight('fixed-point');
    _applyFixedHeight('fixed-point');

    // lagrange e integration están ocultos; medir cuando su tab se activa
    // por primera vez (antes de que el usuario calcule nada)
    document.querySelectorAll('[role="tab"]').forEach(tab => {
        tab.addEventListener('click', () => {
            // Pequeño delay para que el display:block sea efectivo
            setTimeout(() => {
                ['fixed-point', 'lagrange', 'integration'].forEach(id => {
                    _snapshotHeight(id);
                    _applyFixedHeight(id);
                });
            }, 30);
        });
    });

    // Re-snapshot al redimensionar solo si aún no tenemos la altura
    // (o si la ventana cambió de tamaño significativamente)
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Limpiar para re-tomar en el nuevo tamaño
            Object.keys(_fixedHeights).forEach(id => delete _fixedHeights[id]);
            ['fixed-point', 'lagrange', 'integration'].forEach(id => {
                _snapshotHeight(id);
                _applyFixedHeight(id);
            });
        }, 150);
    });
});
