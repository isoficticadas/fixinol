// server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const compression = require('compression');
const mcache = require('memory-cache');
const config = require('./config');

const app = express();

// Middleware
app.use(cors()); // Habilitamos CORS para todas las rutas
app.use(express.json()); // Parseo de JSON
app.use(compression()); // Compresión HTTP

// Caché en memoria
const cache = (duration) => {
    return (req, res, next) => {
        const key = `__express__${req.originalUrl || req.url}`;
        const cachedBody = mcache.get(key);
        if (cachedBody) {
            res.send(cachedBody);
            return;
        }
        res.sendResponse = res.send;
        res.send = (body) => {
            mcache.put(key, body, duration * 1000);
            res.sendResponse(body);
        };
        next();
    };
};

// Servir archivos estáticos desde la raíz
app.use(express.static(path.join(__dirname, "public")));

// URL de Google Apps Script
const GOOGLE_SCRIPT_URL = config.googleScriptUrl;

// Ruta para manejar el envío del formulario
app.post('/api/form', async (req, res) => {
    try {
        // Envío de datos a Google Apps Script
        console.log('2. Enviando datos');
        const response = await axios({
            method: 'post',
            url: GOOGLE_SCRIPT_URL,
            data: req.body,
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: config.requestTimeout
        });

        console.log('3. Respuesta de Google:', response.data);

        // Verificación de la respuesta
        if (response.data && typeof response.data === 'object') {
            res.json({
                success: true,
                message: 'Datos enviados correctamente',
                data: response.data
            });
        } else {
            throw new Error('Respuesta inválida del servidor');
        }
    } catch (error) {
        console.error('ERROR:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error al procesar la solicitud',
            error: error.message
        });
    }
});

// Rutas para archivos estáticos con caché
app.get('/', cache(60), (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta para servir el archivo policy.html
app.get('/policy.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'policy.html'));
});

app.get('/gracias.html', cache(60), (req, res) => {
    res.sendFile(path.join(__dirname, 'gracias.html'));
});

// Iniciar servidor
const PORT = config.port;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
