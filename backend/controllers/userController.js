const { User, Solicitare } = require('../models');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['parola'] }
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Eroare server", error: error.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByPk(id, {
            attributes: { exclude: ['parola'] } 
        });

        if (!user) {
            return res.status(404).json({ message: "Utilizatorul nu a fost găsit" });
        }

        const pointsCount = await Solicitare.count({
            where: {
                id_solicitant: id,
                status_solicitare: 1
            }
        });

        const finalData = {
            ...user.toJSON(),
            points: pointsCount
        };

        res.status(200).json(finalData);
    } catch (error) {
        res.status(500).json({ message: "Eroare server", error: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { descriere } = req.body; 

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: "Utilizatorul nu a fost găsit" });
        }

        user.descriere = descriere;
        await user.save(); 

        res.status(200).json({ message: "Profil actualizat!", user });
    } catch (error) {
        console.error("Eroare update:", error);
        res.status(500).json({ message: "Eroare server", error: error.message });
    }
};