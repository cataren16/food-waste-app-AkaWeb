const express = require('express');
const db = require('./models');
const friendRoutes = require('./routes/friendRoutes');
const groupRoutes=require('./routes/groupRouter');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/api/friends', friendRoutes); 
app.use('/api/groups',groupRoutes);

app.use(cors());
app.use('/api/friends', friendRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Serverul food-waste-app-akaweb ruleaza cu succes!!!');
});

async function initializareDate() {
    try {
        const numarUseri = await db.User.count();
        
        if (numarUseri === 0) {
            console.log("Baza de date e goală! Adaug userii de test...");
            
            await db.User.bulkCreate([
                {
                    nume: 'Renghiuț',
                    prenume: 'Cătălina',
                    email: 'catalina@test.com',
                    parola: 'parola123',
                    descriere: 'Frontend Lead'
                },
                {
                    nume: 'Răsmeriță',
                    prenume: 'Andra',
                    email: 'andra@test.com',
                    parola: 'parola123',
                    descriere: 'Backend Lead'
                }
            ]);
            console.log("Userii Cătălina și Andra au fost creați automat!");
        } else {
            console.log("Baza de date are deja useri. Nu fac nimic.");
        }
    } catch (error) {
        console.error("Eroare la popularea automată:", error);
    }
}

async function startServer() {
  try {
    await db.sequelize.authenticate();
    console.log('Conexiunea la baza de date SQLite a fost stabilita cu succes.');

    await db.sequelize.sync({ alter: true });
    console.log('Toate modelele au fost sincronizate cu succes.');

    await initializareDate();

    app.listen(PORT, () => {
      console.log(`Serverul RULEAZA pe portul http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('Eroare la pornirea serverului:', error.message);
  }
}

startServer();