const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- CONFIGURACIÓN ---
const TELEGRAM_TOKEN = "8629940416:AAHTWpv8q-oIXVajCjImTqPANmmu6xJoZGQ"; 
const TELEGRAM_CHAT_ID = "5719584347"; 

async function enviarNotificacionTelegram(mensaje) {
    try {
        const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: mensaje, parse_mode: 'Markdown' })
        });
        const data = await response.json();
        console.log("Respuesta de Telegram:", data);
    } catch (error) { console.error(error); }
}

let proyectos = []; 

app.get('/api/proyectos', (req, res) => res.json(proyectos));

app.post('/api/proyectos', async (req, res) => {
    const nuevo = { ...req.body, estado: 'pendiente' };
    proyectos.push(nuevo);
    await enviarNotificacionTelegram(`🚀 *Nuevo Proyecto:* ${nuevo.titulo}\n👤 *Autor:* ${nuevo.autor}`);
    res.status(201).json(nuevo);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor iniciado en puerto ${PORT}`));
