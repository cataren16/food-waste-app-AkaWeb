const { User , Solicitare} = require('../models');

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
            where:{id_solicitant:id,
                status_solicitare:1
            }
        });

        const finalData ={
            ...user.toJSON(),
            points:pointsCount
        };

        res.status(200).json(finalData);
    } catch (error) {
        res.status(500).json({ message: "Eroare server", error: error.message });
    }
};