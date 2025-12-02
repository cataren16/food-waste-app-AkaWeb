const { User } = require('../models');

exports.getProfile = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByPk(id, {
            attributes: { exclude: ['parola'] } 
        });

        if (!user) {
            return res.status(404).json({ message: "Utilizatorul nu a fost găsit" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Eroare server", error: error.message });
    }
};