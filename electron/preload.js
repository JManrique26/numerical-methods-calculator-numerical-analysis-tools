// Preload script de Electron para seguridad
const { contextBridge } = require('electron');

// Exponer APIs seguras al proceso de renderizado
contextBridge.exposeInMainWorld({
    electronAPI: {
        // Aquí puedes agregar APIs seguras si necesitas
        // Por ahora, la aplicación funciona completamente en el renderer
        platform: process.platform
    }
});
