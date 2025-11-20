const express = require('express');
const db = require('./models'); // Importăm conexiunea Sequelize

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Permite Express să citească JSON din cererile HTTP

// 🔑 Rută simplă de test
app.get('/', (req, res) => {
  res.status(200).send('Backend-ul Node.js rulează OK!');
});

// 🔑 Rută de exemplu care interacționează cu baza de date
app.get('/test-db', async (req, res) => {
    try {
        // Această linie verifică conexiunea la baza de date
        await db.sequelize.authenticate();
        res.status(200).send('Conexiunea la baza de date SQLite este funcțională!');
    } catch (error) {
        console.error('Eroare la conexiunea DB:', error);
        res.status(500).send('Conexiunea la baza de date a eșuat!');
    }
});


// Sincronizarea și pornirea serverului
// ATENȚIE: Sincronizarea automată ('sync') nu este recomandată în producție.
// Noi vom folosi MIGRAȚIILE pentru a modifica structura.
db.sequelize.sync({ alter: true }).then(() => { 
  app.listen(PORT, () => {
    console.log(`Serverul Express rulează pe portul: ${PORT}`);
    console.log('Folosiți "docker compose down" la finalul sesiunii.');
  });
}).catch(err => {
    console.error('Eroare la sincronizarea bazei de date:', err);
});