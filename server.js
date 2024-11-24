const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));


app.use(express.json());


app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

app.post('/canciones', (req, res) => {
    const nuevaCancion = req.body;
    const repertorio = JSON.parse(fs.readFileSync('repertorio.json'));
    repertorio.push(nuevaCancion);
    fs.writeFileSync('repertorio.json', JSON.stringify(repertorio, null, 2));
    res.status(201).send('Canción agregada');
});

app.get('/canciones', (req, res) => {
    const repertorio = JSON.parse(fs.readFileSync('repertorio.json'));
    res.json(repertorio);
});

app.put('/canciones/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const nuevaData = req.body;
    const repertorio = JSON.parse(fs.readFileSync('repertorio.json'));
    const index = repertorio.findIndex(cancion => cancion.id === id);

    if (index !== -1) {
        repertorio[index] = { ...repertorio[index], ...nuevaData };
        fs.writeFileSync('repertorio.json', JSON.stringify(repertorio, null, 2));
        res.send('Canción actualizada');
    } else {
        res.status(404).send('Canción no encontrada');
    }
});

app.delete('/canciones/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const repertorio = JSON.parse(fs.readFileSync('repertorio.json'));
    const nuevoRepertorio = repertorio.filter(cancion => cancion.id !== id);

    if (repertorio.length !== nuevoRepertorio.length) {
        fs.writeFileSync('repertorio.json', JSON.stringify(nuevoRepertorio, null, 2));
        res.send('Canción eliminada');
    } else {
        res.status(404).send('Canción no encontrada');
    }
});
