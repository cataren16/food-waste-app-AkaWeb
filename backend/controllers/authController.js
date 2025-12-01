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
            nume: nume,
            prenume: prenume,
            email: email,
            parola: parola, 
            descriere: "Utilizator nou" 
        });

        return res.status(201).json({ message: "Înregistrare realizată cu succes!" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Eroare la înregistrare", error: error.message });
    }
};