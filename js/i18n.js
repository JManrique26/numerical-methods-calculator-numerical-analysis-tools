/**
 * Internationalization (i18n) Module
 * Centralized translation system for bilingual support (English/Spanish)
 */

const translations = {
    en: {
        // Header
        title: "Numerical Methods Calculator",
        subtitle: "Computational tools for numerical methods",

        // Skip link
        skipToContent: "Skip to main content",

        // Introduction
        introHeading: "Welcome to the Numerical Methods Calculator",
        introText1: "This interactive tool has been designed to facilitate the learning and application of fundamental numerical methods.",
        introText2: "The calculator allows you to perform fixed-point iterations, Lagrange interpolation, and numerical integration using trapezoidal and Simpson rules, all with real-time graphical visualization and detailed explanatory validations.",
        introText3: "Each module includes professional mathematical representations rendered with MathJax, interactive charts generated with Chart.js, and a history system that allows you to save and retrieve previous exercises. The interface is responsive and adapts to different devices and orientations.",

        // Features
        featureFixedPoint: "Fixed Point Iteration",
        featureFixedPointDesc: "Find roots using the iterative method with cobweb convergence visualization.",
        featureLagrange: "Lagrange Interpolation",
        featureLagrangeDesc: "Generate polynomials that pass exactly through given points with interactive charts.",
        featureIntegration: "Numerical Integration",
        featureIntegrationDesc: "Calculate approximate integrals using trapezoidal and Simpson rules with geometric visualization.",
        featureFormulas: "Formula Reference",
        featureFormulasDesc: "Dedicated section with all mathematical formulas and detailed explanations.",

        // Tabs
        tabFixedPoint: "Fixed Point Iteration",
        tabInterpolation: "Interpolation & Integration",
        tabFormulas: "Formulas",
        tabHistory: "History",

        // Fixed Point Module
        fpHeading: "Simple Fixed Point Iteration",
        fpDescription: "Iteration method: $x_{n+1} = g(x_n)$",
        fpFunctionPreset: "Function g(x) - predefined example:",
        fpFunctionPresetPlaceholder: "- Select a function example -",
        fpFunctionLabel: "Or type your own function g(x):",
        fpFunctionPlaceholder: "Ex: cos(x), sqrt(x+2), (x^2+1)/3",
        fpFunctionHint: "Use math.js syntax: cos(x), sin(x), sqrt(x), x^2, etc. Select an example or type directly.",
        fpX0: "Initial value x₀:",
        fpStopCriterion: "Stopping criterion:",
        fpStopTolerance: "By tolerance",
        fpStopIterations: "By iterations",
        fpStopBoth: "Both (tolerance or iterations)",
        fpTolerance: "Tolerance (ε):",
        fpToleranceHint: "Use scientific notation: 1e-5 for 10⁻⁵",
        fpMaxIter: "Maximum iterations:",
        fpCalculate: "Calculate",
        fpClear: "Clear",
        fpResults: "Results",
        fpResultsPlaceholder: "Enter parameters and click 'Calculate'",
        fpTableScrollHint: "Scroll to see the rest of the iterations.",
        fpConverged: "Convergence reached",
        fpNotConverged: "Convergence not reached",
        fpConvergedIn: "in",
        fpIterations: "iterations",
        fpToleranceReached: "(tolerance reached)",
        fpMaxIterReached: "(maximum iterations reached)",
        fpApproxRoot: "Approximate root:",
        fpFinalError: "Final error:",
        fpLastValue: "Last calculated value:",
        fpSuggestion: "Suggestion: Try a different initial value or verify if the function meets convergence conditions.",
        fp12Selected: "12 iterations selected out of",
        fpTotal: "total",
        fpIterationPoints: "Iteration points shown in the graph:",

        // Lagrange Module
        lagHeading: "Lagrange Interpolation",
        lagDescription: "Find the polynomial that passes through the given points",
        lagPoints: "Interpolation points (x, y)",
        lagAddPoint: "Add Point",
        lagCalculate: "Calculate Polynomial",
        lagClear: "Clear",
        lagResults: "Results",
        lagResultsPlaceholder: "Enter points and click 'Calculate Polynomial'",
        lagErrorDuplicateX: "Error: Duplicate x-values detected. Interpolation requires unique x-coordinates.",
        lagErrorMinPoints: "Error: At least 2 points are required for interpolation.",
        lagDuplicateX: "Duplicate x-values are invalid because the polynomial would not be a function.",
        lagPolynomial: "Polynomial:",
        lagDegree: "Polynomial degree:",
        lagChartLabel: "Lagrange interpolation polynomial graph with given points",

        // Integration Module
        intHeading: "Numerical Integration",
        intDescription: "Approximation of the area under the curve",
        intFunctionPreset: "Function f(x) - predefined example:",
        intFunctionPresetPlaceholder: "- Select a function example -",
        intFunctionLabel: "Or type your own function f(x):",
        intFunctionPlaceholder: "Ex: x^2, sin(x), exp(x)",
        intFunctionHint: "Use math.js syntax: cos(x), sin(x), sqrt(x), x^2, etc. Select an example or type directly.",
        intA: "Lower limit a:",
        intB: "Upper limit b:",
        intN: "Number of subintervals (n):",
        intNHint: "For Simpson 1/3: n must be even. For Simpson 3/8: n must be divisible by 3.",
        intMethod: "Integration method:",
        intMethodTrapezoid: "Trapezoidal Rule",
        intMethodSimpson13: "Simpson 1/3 Rule",
        intMethodSimpson38: "Simpson 3/8 Rule",
        intCalculate: "Calculate Integral",
        intClear: "Clear",
        intResults: "Results",
        intResultsPlaceholder: "Enter parameters and click 'Calculate Integral'",
        intExactValue: "Exact value:",
        intApproximate: "Approximate value:",
        intError: "Error:",
        intPartition: "Partition",
        intChartLabel: "Numerical integration graph with geometric visualization",

        // Formulas Section
        formulasHeading: "Formulas Reference",
        formulasIntro: "Mathematical formulas and explanations for each numerical method.",
        formulasFixedPoint: "Fixed Point Iteration",
        formulasLagrange: "Lagrange Interpolation",
        formulasTrapezoid: "Trapezoidal Rule",
        formulasSimpson13: "Simpson 1/3 Rule",
        formulasSimpson38: "Simpson 3/8 Rule",

        // History Section
        historyHeading: "Exercise History",
        historyEmpty: "No exercises saved yet.",
        historyExport: "Export History",
        historyClear: "Clear History",
        historyDeleted: "Item deleted from history.",
        historyCleared: "History cleared.",
        historyLoadConfirm: "Load this exercise? Current values will be replaced.",

        // Footer
        footerTitle: "Numerical Methods Calculator",
        footerDescription: "Interactive tool for numerical methods",
        footerDevelopers: "Developers",
        footerProjectInfo: "Project Information",
        footerCreationDate: "Creation date: October 14, 2026",
        footerVersion: "Version: 1.0.0",
        footerCourse: "Course: Numerical Analysis",
        footerTechnologies: "Technologies",
        footerCopyright: "Copyright 2026 - All rights reserved",

        // Language Selector
        language: "Language",
        languageEnglish: "English",
        languageSpanish: "Español",

        // General
        remove: "Remove",
        point: "Point",
        xCoord: "x-coordinate",
        yCoord: "y-coordinate"
    },
    es: {
        // Header
        title: "Calculadora de Análisis Numérico",
        subtitle: "Herramientas computacionales para métodos numéricos",

        // Skip link
        skipToContent: "Saltar al contenido principal",

        // Introduction
        introHeading: "Bienvenido a la Calculadora de Análisis Numérico",
        introText1: "Esta herramienta interactiva ha sido diseñada para facilitar el aprendizaje y la aplicación de métodos numéricos fundamentales.",
        introText2: "La calculadora permite realizar iteraciones de punto fijo, interpolación de Lagrange e integración numérica mediante reglas del trapecio y Simpson, todo con visualización gráfica en tiempo real y validaciones explicativas detalladas.",
        introText3: "Cada módulo incluye representaciones matemáticas profesionales renderizadas con MathJax, gráficos interactivos generados con Chart.js, y un sistema de historial que permite guardar y recuperar ejercicios anteriores. La interfaz es responsiva y se adapta a diferentes dispositivos y orientaciones.",

        // Features
        featureFixedPoint: "Iteración de Punto Fijo",
        featureFixedPointDesc: "Encuentra raíces mediante el método iterativo con visualización de convergencia tipo telaraña.",
        featureLagrange: "Interpolación de Lagrange",
        featureLagrangeDesc: "Genera polinomios que pasan exactamente por puntos dados con gráficos interactivos.",
        featureIntegration: "Integración Numérica",
        featureIntegrationDesc: "Calcula integrales aproximadas usando reglas del trapecio y Simpson con visualización geométrica.",
        featureFormulas: "Referencia de Fórmulas",
        featureFormulasDesc: "Sección dedicada con todas las fórmulas matemáticas y explicaciones detalladas.",

        // Tabs
        tabFixedPoint: "Iteración de Punto Fijo",
        tabInterpolation: "Interpolación e Integración",
        tabFormulas: "Fórmulas",
        tabHistory: "Historial",

        // Fixed Point Module
        fpHeading: "Iteración Simple de Punto Fijo",
        fpDescription: "Método de iteración: $x_{n+1} = g(x_n)$",
        fpFunctionPreset: "Función g(x) — ejemplo predefinido:",
        fpFunctionPresetPlaceholder: "— Selecciona una función de ejemplo —",
        fpFunctionLabel: "O escribe tu propia función g(x):",
        fpFunctionPlaceholder: "Ej: cos(x), sqrt(x+2), (x^2+1)/3",
        fpFunctionHint: "Usa sintaxis de math.js: cos(x), sin(x), sqrt(x), x^2, etc. Selecciona un ejemplo o escribe directamente.",
        fpX0: "Valor inicial x₀:",
        fpStopCriterion: "Criterio de parada:",
        fpStopTolerance: "Por tolerancia",
        fpStopIterations: "Por iteraciones",
        fpStopBoth: "Ambos (tolerancia o iteraciones)",
        fpTolerance: "Tolerancia (ε):",
        fpToleranceHint: "Usa notación científica: 1e-5 para 10⁻⁵",
        fpMaxIter: "Máximo de iteraciones:",
        fpCalculate: "Calcular",
        fpClear: "Limpiar",
        fpResults: "Resultados",
        fpResultsPlaceholder: "Ingresa los parámetros y haz clic en 'Calcular'",
        fpTableScrollHint: "Desplaza para ver el resto de las iteraciones.",
        fpConverged: "Convergencia alcanzada",
        fpNotConverged: "No se alcanzó convergencia",
        fpConvergedIn: "en",
        fpIterations: "iteraciones",
        fpToleranceReached: "(tolerancia alcanzada)",
        fpMaxIterReached: "(máximo de iteraciones alcanzado)",
        fpApproxRoot: "Raíz aproximada:",
        fpFinalError: "Error final:",
        fpLastValue: "Último valor calculado:",
        fpSuggestion: "Sugerencia: Intenta con un valor inicial diferente o verifica si la función cumple las condiciones de convergencia.",
        fp12Selected: "12 iteraciones seleccionadas de",
        fpTotal: "totales",
        fpIterationPoints: "Puntos de iteración mostrados en la gráfica:",

        // Lagrange Module
        lagHeading: "Interpolación de Lagrange",
        lagDescription: "Encuentra el polinomio que pasa por los puntos dados",
        lagPoints: "Puntos de interpolación (x, y)",
        lagAddPoint: "Agregar Punto",
        lagCalculate: "Calcular Polinomio",
        lagClear: "Limpiar",
        lagResults: "Resultados",
        lagResultsPlaceholder: "Ingresa los puntos y haz clic en 'Calcular Polinomio'",
        lagErrorDuplicateX: "Error: Se detectaron valores x duplicados. La interpolación requiere coordenadas x únicas.",
        lagErrorMinPoints: "Error: Se requieren al menos 2 puntos para la interpolación.",
        lagDuplicateX: "Los valores x duplicados son inválidos porque el polinomio no sería una función.",
        lagPolynomial: "Polinomio:",
        lagDegree: "Grado del polinomio:",
        lagChartLabel: "Gráfico del polinomio de interpolación de Lagrange con los puntos dados",

        // Integration Module
        intHeading: "Integración Numérica",
        intDescription: "Aproximación del área bajo la curva",
        intFunctionPreset: "Función f(x) — ejemplo predefinido:",
        intFunctionPresetPlaceholder: "— Selecciona una función de ejemplo —",
        intFunctionLabel: "O escribe tu propia función f(x):",
        intFunctionPlaceholder: "Ej: x^2, sin(x), exp(x)",
        intFunctionHint: "Usa sintaxis de math.js: cos(x), sin(x), sqrt(x), x^2, etc. Selecciona un ejemplo o escribe directamente.",
        intA: "Límite inferior a:",
        intB: "Límite superior b:",
        intN: "Número de subintervalos (n):",
        intNHint: "Para Simpson 1/3: n debe ser par. Para Simpson 3/8: n debe ser divisible por 3.",
        intMethod: "Método de integración:",
        intMethodTrapezoid: "Regla del Trapecio",
        intMethodSimpson13: "Regla de Simpson 1/3",
        intMethodSimpson38: "Regla de Simpson 3/8",
        intCalculate: "Calcular Integral",
        intClear: "Limpiar",
        intResults: "Resultados",
        intResultsPlaceholder: "Ingresa los parámetros y haz clic en 'Calcular Integral'",
        intExactValue: "Valor exacto:",
        intApproximate: "Valor aproximado:",
        intError: "Error:",
        intPartition: "Partición",
        intChartLabel: "Gráfico de integración numérica con visualización geométrica",

        // Formulas Section
        formulasHeading: "Referencia de Fórmulas",
        formulasIntro: "Fórmulas matemáticas y explicaciones para cada método numérico.",
        formulasFixedPoint: "Iteración de Punto Fijo",
        formulasLagrange: "Interpolación de Lagrange",
        formulasTrapezoid: "Regla del Trapecio",
        formulasSimpson13: "Regla de Simpson 1/3",
        formulasSimpson38: "Regla de Simpson 3/8",

        // History Section
        historyHeading: "Historial de Ejercicios",
        historyEmpty: "Aún no hay ejercicios guardados.",
        historyExport: "Exportar Historial",
        historyClear: "Limpiar Historial",
        historyDeleted: "Elemento eliminado del historial.",
        historyCleared: "Historial limpiado.",
        historyLoadConfirm: "¿Cargar este ejercicio? Los valores actuales serán reemplazados.",

        // Footer
        footerTitle: "Calculadora de Análisis Numérico",
        footerDescription: "Herramienta interactiva para métodos numéricos",
        footerDevelopers: "Desarrolladores",
        footerProjectInfo: "Información del Proyecto",
        footerCreationDate: "Fecha de creación: 14 de octubre de 2026",
        footerVersion: "Versión: 1.0.0",
        footerCourse: "Curso: Análisis Numérico",
        footerTechnologies: "Tecnologías",
        footerCopyright: "Copyright 2026 - Todos los derechos reservados",

        // Language Selector
        language: "Idioma",
        languageEnglish: "English",
        languageSpanish: "Español",

        // General
        remove: "Eliminar",
        point: "Punto",
        xCoord: "coordenada x",
        yCoord: "coordenada y"
    }
};

// Current language (default: English)
let currentLanguage = 'en';

/**
 * Get translation for a key
 * @param {string} key - Translation key (dot notation supported)
 * @returns {string} Translated text
 */
function t(key) {
    const keys = key.split('.');
    let value = translations[currentLanguage];

    for (const k of keys) {
        if (value && value[k] !== undefined) {
            value = value[k];
        } else {
            console.warn(`Translation key not found: ${key}`);
            return key;
        }
    }

    return value;
}

/**
 * Set current language
 * @param {string} lang - Language code ('en' or 'es')
 */
function setLanguage(lang) {
    if (translations[lang]) {
        currentLanguage = lang;
        // Save to localStorage
        localStorage.setItem('language', lang);
        // Update HTML lang attribute
        document.documentElement.lang = lang;
        // Update all translatable elements
        updateTranslations();
    }
}

/**
 * Get current language
 * @returns {string} Current language code
 */
function getLanguage() {
    return currentLanguage;
}

/**
 * Update all translatable elements in the DOM
 */
function updateTranslations() {
    // Update elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.textContent = t(key);
    });

    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        element.placeholder = t(key);
    });

    // Update titles
    document.querySelectorAll('[data-i18n-title]').forEach(element => {
        const key = element.getAttribute('data-i18n-title');
        element.title = t(key);
    });

    // Update aria-labels
    document.querySelectorAll('[data-i18n-aria]').forEach(element => {
        const key = element.getAttribute('data-i18n-aria');
        element.setAttribute('aria-label', t(key));
    });

    // Re-render MathJax after language change
    if (window.MathJax) {
        MathJax.typesetPromise();
    }
}

/**
 * Initialize language from localStorage or browser preference
 */
function initLanguage() {
    const savedLang = localStorage.getItem('language');
    if (savedLang && translations[savedLang]) {
        setLanguage(savedLang);
    } else {
        // Try to detect browser language
        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang.startsWith('es')) {
            setLanguage('es');
        } else {
            setLanguage('en');
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { t, setLanguage, getLanguage, initLanguage };
}
