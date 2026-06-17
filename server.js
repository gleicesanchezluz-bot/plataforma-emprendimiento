JavaScript
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Bases de datos temporales en memoria
let tareas = [
    { id: 1, texto: "Redactar Resumen Ejecutivo", estado: "pendiente" },
    { id: 2, texto: "Definir Modelo de Negocios", estado: "proceso" },
    { id: 3, texto: "Validar MVP con clientes", estado: "terminado" }
];

let mentorias = [
    { id: 1, fecha: "16/06/2026 10:00", feedback: "Gran avance en el prototipo. Enfocarse en costos." }
];

let archivos = ["Plan_De_Negocios_V1.pdf"];

// RUTAS PARA EL KANBAN
app.get('/api/tareas', (req, res) => res.json(tareas));
app.post('/api/tareas', (req, res) => {
    const nueva = { id: Date.now(), texto: req.body.texto, estado: 'pendiente' };
    tareas.push(nueva);
    res.json(nueva);
});
app.put('/api/tareas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    tareas = tareas.map(t => t.id === id ? { ...t, estado: req.body.estado } : t);
    res.json({ success: true });
});

// RUTAS PARA MENTORÍAS
app.get('/api/mentorias', (req, res) => res.json(mentorias));
app.post('/api/mentorias', (req, res) => {
    const nuevaMentoria = {
        id: Date.now(),
        fecha: new Date().toLocaleString(), // Marca temporal automatizada
        feedback: req.body.feedback
    };
    mentorias.push(nuevaMentoria);
    res.json(nuevaMentoria);
});

// RUTAS PARA ARCHIVOS
app.get('/api/archivos', (req, res) => res.json(archivos));
app.post('/api/archivos', (req, res) => {
    // Simulación de subida de archivo
    archivos.push(req.body.nombreArchivo);
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});