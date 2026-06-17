const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'), 
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage: storage });

app.use(express.static(path.join(__dirname, 'public')));

const TELEGRAM_TOKEN = "8629940416:AAHtWpv8q-oIXVaJcJinTqPANnmu6xJoZGQ"; 
const TELEGRAM_CHAT_ID = "5719584347"; 

async function enviarNotificacionTelegram(mensaje) {
    try {
        const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: mensaje, parse_mode: 'Markdown' })
        });
    } catch (error) { console.error("Error:", error); }
}

let proyectos = []; 
app.get('/api/proyectos', (req, res) => res.json(proyectos));
app.post('/api/proyectos', upload.single('archivo'), async (req, res) => {
    const nuevo = { titulo: req.body.titulo, autor: req.body.autor, fecha: req.body.fecha, archivo: req.file ? req.file.filename : null, estado: 'pendiente' };
    proyectos.push(nuevo);
    await enviarNotificacionTelegram(`🚀 *Nuevo Proyecto:* ${nuevo.titulo}\n👤 *Autor:* ${nuevo.autor}`);
    res.status(201).json(nuevo);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Activo en ${PORT}`));
