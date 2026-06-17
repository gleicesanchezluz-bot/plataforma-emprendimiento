const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Tus credenciales (Ya configuradas)
const TELEGRAM_TOKEN = "8629940416:AAHPdgkeg-iMH7WKl2grYMAwFQezjquoyVM"; 
const TELEGRAM_CHAT_ID = "5719584347"; 

// Función para enviar notificaciones a Telegram
async function enviarNotificacionTelegram(mensaje) {
    try {
        const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: mensaje, parse_mode: 'Markdown' })
        });
    } catch (error) { console.error(error); }
}

// Bases de datos en memoria (Simulando el Kanban)
let proyectos = []; // Estructura: { titulo, autor, estado: 'pendiente' | 'proceso' | 'terminado' }

app.get('/api/proyectos', (req, res) => res.json(proyectos));

app.post('/api/proyectos', async (req, res) => {
    const nuevo = { ...req.body, estado: 'pendiente' };
    proyectos.push(nuevo);
    await enviarNotificacionTelegram(`🚀 *Nuevo Proyecto:* ${nuevo.titulo}\n*Estado:* Pendiente`);
    res.status(201).json(nuevo);
});

// Ruta para mover tareas (Kanban)
app.put('/api/proyectos/:titulo', (req, res) => {
    const { titulo } = req.params;
    const { nuevoEstado } = req.body;
    const proj = proyectos.find(p => p.titulo === titulo);
    if (proj) {
        proj.estado = nuevoEstado;
        res.json({ mensaje: 'Estado actualizado' });
    } else {
        res.status(404).json({ mensaje: 'No encontrado' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en ${PORT}`));
