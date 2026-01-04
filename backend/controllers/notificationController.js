const {Notificare, User} = require("../models");
const {Op} = require("sequelize");

exports.getNotifications = async(req,res)=>{
    const userId = req.query.userId;

    if(!userId)
        return res.status(400).json({message:"Nu exista acest user"});

    try{
        const notificari = await Notificare.findAll({
            where:{id_utilizator:userId},
            order:[["data_notificare", "DESC"]]
        });

        res.status(200).json(notificari);
    }
    catch(error){
        res.status(500).json({message:"Eroare la obtinerea notificarilor", error})
    }
};

exports.getUnreadCount = async(req,res)=>{
    const userId = req.query.userId;

    try{
        const contor = await Notificare.count({
            where:{
                id_utilizator:userId,
                citita:false
            }
        });

        res.json({unread:contor});
    }
    catch(error){
        res.status(500).json({message:"Eroare la numararea notificarilor", error});
    }
};


exports.markAsRead = async(req,res)=>{
    const {id_notificare, userId} = req.body

    try{
        if(id_notificare){
            await Notificare.update(
                {citita:true},
                {where:
                    {id_notificare,
                    id_utilizator:userId
                    }
                }
            )
        }
        else{
            await Notificare.update(
                { citita: true },
                { where: {
                     id_utilizator: userId 
                    } 
                }
            )
        }

        res.json({message:"Notificari actualizate"});
    }
    catch(error){
        res.status(500).json({message:"Eroare la marcarea notificarilor citite", error});
    }
};

exports.deleteNotification = async(req,res)=>{
    const id = req.params.id;

    try{
        await Notificare.destroy({where:{
            id_notificare:id
        }});

        res.json({message:"Notificarea a fost stearsa"})
    }
    catch(error){
        res.status(500).json({message:"Eroare la stergerea notificarii", error})
    }
}

exports.deleteAllNotifications = async (req, res) => {
    try {
        const { userId } = req.params; 

        if (!userId) {
            return res.status(400).json({ message: "ID utilizator lipsă." });
        }

        await Notificare.destroy({
            where: { id_utilizator: userId }
        });

        res.status(200).json({ message: "Toate notificările au fost șterse cu succes." });
    } catch (err) {
        console.error("Eroare la ștergerea tuturor notificărilor:", err);
        res.status(500).json({ message: "Eroare la server la ștergerea notificărilor." });
    }
};