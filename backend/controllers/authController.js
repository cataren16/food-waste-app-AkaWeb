const { User } = require('../models');

exports.register = async (req, res) => {
    try {
        const { nume, prenume, email, parola } = req.body;
        if (!nume || !prenume || !email || !parola) {
            return res.status(400).json({ message: "Toate câmpurile sunt obligatorii!" });
        }
        const userExistent = await User.findOne({ where: { email } });
        if (userExistent) {
            return res.status(400).json({ message: "Acest email este deja folosit!" });
        }
        await User.create({
            nume, prenume, email, parola, descriere: "Utilizator nou"
        });
        return res.status(201).json({ message: "Înregistrare realizată cu succes!" });
    } catch (error) {
        res.status(500).json({ message: "Eroare la înregistrare", error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, parola } = req.body;
        const userGasit = await User.findOne({ where: { email } });
  
        if (!userGasit) {
            return res.status(404).json({ message: "Utilizatorul nu a fost găsit!" });
        }
        if (userGasit.parola !== parola) {
            return res.status(401).json({ message: "Parolă incorectă!" });
        }

        return res.status(200).json({
            message: "Autentificare reușită!",
            user: {
                id: userGasit.id_utilizator,
                nume: userGasit.nume,
                email: userGasit.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Eroare server", error: error.message });
    }
};