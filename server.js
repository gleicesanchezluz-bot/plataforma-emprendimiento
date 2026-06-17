const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- CONFIGURACIÓN DEL BOT ---
const TELEGRAM_TOKEN = "8629940416:AAHPdgkeg-iMH7WKl2grYMAwFQezjquoyVM"; 
const TELEGRAM_CHAT_ID = "5719584347"; 

// Función para enviar notificaciones a Telegram
async function enviarNotificacionTelegram(mensaje) {
    try {
        const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: mensaje,
                parse_mode: 'Markdown'
            })
        });
    } catch (error) {
        console.error("Error enviando a Telegram:", error);
    }
}

// Rutas (Almacenamiento temporal)
let ideas = [];
let asesorias = [];

app.get('/api/ideas', (req, res) => res.json(ideas));

app.post('/api/ideas', async (req, res) => {
    const nuevaIdea = req.body;
    ideas.push(nuevaIdea);
    await enviarNotificacionTelegram(`💡 *Nueva Idea:* ${nuevaIdea.titulo}\n*Autor:* ${nuevaIdea.autor}`);
    res.status(201).json({ mensaje: 'Guardado' });
});

app.post('/api/asesorias', async (req, res) => {
    const nuevaAsesoria = req.body;
    asesorias.push(nuevaAsesoria);
    await enviarNotificacionTelegram(`🤝 *Nueva Asesoría:* ${nuevaAsesoria.nombre}\n*Tema:* ${nuevaAsesoria.tema}`);
    res.status(201).json({ mensaje: 'Guardado' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
