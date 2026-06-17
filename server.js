const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- CONFIGURACIÓN ---
const TELEGRAM_TOKEN = "TU_TOKEN_AQUI"; // 8629940416:AAHtWpv8q-oIXVaJcJinTqPANnmu6xJoZGQ
const TELEGRAM_CHAT_ID = "5719584347"; 

async function enviarNotificacionTelegram(mensaje) {
    try {
        const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: mensaje, parse_mode: 'Markdown' })
        });
    } catch (error) { console.error("Error enviando a Telegram:", error); }
}

let proyectos = []; 

app.get('/api/proyectos', (req, res) => res.json(proyectos));

app.post('/api/proyectos', async (req, res) => {
    // Aquí es donde capturamos la fecha que viene del formulario
    const nuevo = { 
        titulo: req.body.titulo,
        autor: req.body.autor,
        fecha: req.body.fecha, // Captura la fecha enviada desde el frontend
        estado: 'pendiente' 
    };
    proyectos.push(nuevo);
    
    await enviarNotificacionTelegram(`🚀 *Nuevo Proyecto:* ${nuevo.titulo}\n👤 *Autor:* ${nuevo.autor}\n📅 *Fecha:* ${nuevo.fecha}`);
    res.status(201).json(nuevo);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor activo en puerto ${PORT}`));
