# 🧮 Numerical Methods Calculator

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://www.javascript.com/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://www.w3.org/html/)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://www.w3.org/css/)

An interactive web application for numerical analysis with real-time visualization. Implement three fundamental numerical methods: Fixed Point Iteration, Lagrange Interpolation, and Numerical Integration.

## 🎯 Features

- **Fixed Point Iteration**: Find roots using iterative methods with cobweb convergence visualization
- **Lagrange Interpolation**: Generate polynomials that pass exactly through given points
- **Numerical Integration**: Calculate approximate integrals using Trapezoidal and Simpson rules
- **Real-time Visualization**: Interactive charts powered by Chart.js
- **Mathematical Rendering**: Professional formula display with MathJax
- **Exercise History**: Save and retrieve previous calculations using localStorage
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Accessibility**: WCAG AA compliant with keyboard navigation and screen reader support
- **Cross-platform**: Electron desktop application included

## 🛠️ Technologies

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Visualization**: Chart.js 4.4.1
- **Mathematics**: Math.js 12.4.0, MathJax 3
- **Desktop**: Electron 28.0.0
- **Testing**: Playwright (E2E tests)

## 📦 Installation

### Web Version

No installation required. The web version runs directly in the browser using CDN resources.

### Desktop Application

#### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

#### Steps

```bash
# Clone the repository
git clone https://github.com/JManrique26/numerical-methods-calculator-numerical-analysis-tools.git
cd numerical-methods-calculator-numerical-analysis-tools

# Install dependencies
npm install

# Run the application
npm start
```

#### Build Executables

```bash
# Windows
npm run build-win

# Linux
npm run build-linux

# macOS
npm run build-mac
```

## 🚀 Usage

### Web Version

Simply open `index.html` in a modern web browser, or serve it using a local server:

```bash
# Using Python
python3 -m http.server 38141

# Using Node.js (http-server)
npx http-server -p 38141
```

Then navigate to `http://localhost:38141`

### Desktop Application

After running `npm start`, the Electron application will launch automatically.

## 📚 Available Methods

### 1. Fixed Point Iteration

Solves equations of the form $x = g(x)$ using iterative approximation.

**Features:**
- Multiple stopping criteria (tolerance, iterations, or both)
- Convergence visualization with cobweb plot
- Iteration table with error tracking
- Real-time result display

**Example:**
```
Function: cos(x)
Initial value: 0.5
Tolerance: 1e-5
Result: ≈ 0.739085
```

### 2. Lagrange Interpolation

Constructs a polynomial that passes through a set of given points.

**Features:**
- Dynamic point input
- Duplicate x-value validation
- Polynomial degree calculation
- Interactive chart showing the polynomial curve

**Example:**
```
Points: (0, 1), (1, 2), (2, 5)
Result: Polynomial of degree 2
```

### 3. Numerical Integration

Approximates definite integrals using numerical methods.

**Features:**
- Trapezoidal Rule
- Simpson's 1/3 Rule (requires even n)
- Simpson's 3/8 Rule (requires n divisible by 3)
- Geometric visualization
- Partition table display

**Example:**
```
Function: x^2
Interval: [0, 2]
Subintervals: 10
Method: Trapezoidal Rule
Result: ≈ 2.67
```

## 🧪 Testing

The project includes comprehensive E2E tests using Playwright.

```bash
# Install dependencies
npm install

# Run all tests
npm test

# Run tests in UI mode
npm run test:ui

# View test report
npx playwright show-report
```

### Test Coverage

- Navigation and UI rendering
- Mathematical calculations
- Error handling
- Library integration (MathJax, Chart.js)
- History management
- Accessibility (WCAG AA)
- Responsiveness

## 📁 Project Structure

```
numerical-methods-calculator/
├── css/                      # Stylesheets
│   └── styles.css
├── electron/                 # Electron desktop app
│   ├── main.js
│   └── preload.js
├── js/                       # JavaScript files
│   ├── main.js
│   └── i18n.js              # Internationalization
├── modules/                  # Functional modules
│   ├── fixedPoint.js        # Fixed Point Iteration
│   ├── lagrange.js          # Lagrange Interpolation
│   ├── integration.js       # Numerical Integration
│   └── history.js           # Exercise History
├── tests/                    # E2E tests
│   ├── numerical-calculator.spec.js
│   └── README.md
├── assets/                   # Icons and images
├── index.html                # Main HTML file
├── favicon.svg              # Favicon
├── package.json             # Node.js configuration
├── playwright.config.js     # Playwright configuration
└── README.md                # This file
```

## 🌐 Deploy as Web Application

### GitHub Pages

1. Push to GitHub repository
2. Go to **Settings** → **Pages**
3. Select **Source**: `main` branch
4. Your site will be available at `https://yourusername.github.io/repository-name`

### Netlify

1. Connect your GitHub repository to Netlify
2. Build command: (leave empty)
3. Publish directory: `.`
4. Deploy

### Vercel

1. Import repository in Vercel
2. Framework preset: Other
3. Deploy

## 📊 Screenshots

![Fixed Point Iteration](https://via.placeholder.com/800x400?text=Fixed+Point+Iteration)
![Lagrange Interpolation](https://via.placeholder.com/800x400?text=Lagrange+Interpolation)
![Numerical Integration](https://via.placeholder.com/800x400?text=Numerical+Integration)

*Note: Add actual screenshots of your application*

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Authors

- **Jesús Manuel Manrique Rativa**
- **Cristian Villanueva Medina**

## 🙏 Acknowledgments

- [Math.js](https://mathjs.org/) - Mathematical expression evaluation
- [Chart.js](https://www.chartjs.org/) - Interactive charts
- [MathJax](https://www.mathjax.org/) - Mathematical formula rendering
- [Electron](https://www.electronjs.org/) - Desktop application framework

## 📞 Support

If you encounter any issues or have questions:
- Open an [issue](https://github.com/JManrique26/numerical-methods-calculator-numerical-analysis-tools/issues)
- Check the [documentation](https://github.com/JManrique26/numerical-methods-calculator-numerical-analysis-tools/wiki)

## 🔗 Links

- [Live Demo](https://yourusername.github.io/numerical-methods-calculator-numerical-analysis-tools) *(after deploying)*
- [Documentation](https://github.com/JManrique26/numerical-methods-calculator-numerical-analysis-tools/wiki)
- [Issues](https://github.com/JManrique26/numerical-methods-calculator-numerical-analysis-tools/issues)

---

⭐ **Star this repository if you find it useful!**
