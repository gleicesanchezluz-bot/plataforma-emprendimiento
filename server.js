const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let ideas = [];
let asesorias = [];

app.get('/api/ideas', (req, res) => res.json(ideas));
app.post('/api/ideas', (req, res) => {
    const nuevaIdea = { id: Date.now(), ...req.body };
    ideas.push(nuevaIdea);
    res.json(nuevaIdea);
});

app.get('/api/asesorias', (req, res) => res.json(asesorias));
app.post('/api/asesorias', (req, res) => {
    const nuevaAsesoria = { id: Date.now(), ...req.body };
    asesorias.push(nuevaAsesoria);
    res.json(nuevaAsesoria);
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
