const express = require('express');
const db = require('./models'); 
const friendRoutes = require('./routes/friendRoutes');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(cors());
app.use('/api/friends', friendRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Serverul food-waste-app-akaweb ruleaza cu succes!!!');
});

async function startServer() {
  try {
    await db.sequelize.authenticate();
    console.log('Conexiunea la baza de date SQLite a fost stabilita cu succes.');

    await db.sequelize.sync({ alter: true });
    console.log('Toate modelele au fost sincronizate cu succes. Baza de date este gata!');

    app.listen(PORT, () => {
      console.log(`Serverul RULEAZA pe portul http://localhost:${PORT}`);
      console.log(`Fișierul bazei de date (SQLite) se află în: backend/data/food-waste-app-akaweb-dev.sqlite`);
    });

  } catch (error) {
    console.error('Eroare la pornirea serverului sau la conectarea la DB:', error.message);
    process.exit(1); 
  }
}

startServer();