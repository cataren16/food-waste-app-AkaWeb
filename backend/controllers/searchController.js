const {User}=require('../models');
const {Op}=require('sequelize');

exports.cautaUtilizator = async (req,res)=>{
    try{
        const textCautat=req.query.q;

        if(!textCautat)
        {
            return res.status(400).json({message:"Lipseste textul!"})
        }

        const rezultat = await User.findAll({

            where:{
                [Op.or]:[{nume:{[Op.like]:`%${textCautat}%`}},
                        {prenume:{[Op.like]:`%${textCautat}%`}},
                        {email: {[Op.like]:`%${textCautat}%`}}
            ]},
            attributes: ['id_utilizator', 'nume', 'prenume', 'email', 'descriere']
        });
        res.status(200).json({
            message: `Am găsit ${rezultat.length} utilizatori.`,
            users: rezultat
        });
    }catch (error) {
        console.error(error);
        res.status(500).json({ message: "Eroare la căutare", error: error.message });
    }
}