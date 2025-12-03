const {Grup, MembriGrup,User}=require('../models');

exports.creeazaGrup= async(req,res)=>{
    try{
        const {nume_grup,id_admin,descriere,status_dieta}=req.body;
        if (!nume_grup || !id_admin) {
            return res.status(400).json({ message: "Numele și Adminul sunt obligatorii!" });
        }

        const grupNou=await Grup.create({
            id_admin:id_admin,
            nume_grup:nume_grup,
            descriere:descriere,
            status_dieta:status_dieta
        })
        
        await MembriGrup.create({
            id_grup:grupNou.id_grup,
            id_utilizator:id_admin
        })
         return res.status(201).json({message:"Creare grup realizata cu succes!"})
}
catch(error)
{
    console.log(error);
    res.status(500).json({ message: "Eroare la trimiterea cererii", error: error.message });
}
}

exports.adaugaMembru= async (req,res)=>{

    try{
        const{id_grup,id_utilizator}=req.body;

        if (!id_grup || !id_utilizator) {
            return res.status(400).json({ message: "Lipsesc ID-urile!" });
        }
        const rezultat= await MembriGrup.findOne({where:{id_utilizator:id_utilizator,id_grup:id_grup}})

        if(rezultat !==null)
        {
            return res.status(409).json({ message: "Utilizatorul este deja în grup!" });
        }

        await MembriGrup.create({
            id_grup:id_grup,
            id_utilizator:id_utilizator
        })

        return res.status(201).json({ message: "Utilizator adaugat cu succes!" });
    }
    catch(error)
    {
        console.log(error);
        res.status(500).json({ message: "Eroare la trimiterea cererii de adaugare utilizator", error: error.message });
   }
    }

    exports.stergeMembru=async (req,res)=>{
        try{
                const{id_utilizator,id_grup}= req.body;
                
                if(!id_utilizator||!id_grup)
                {
                    return res.status(400).json({ message: "Lipsesc ID-urile!" });
                }

                const rezultat = await MembriGrup.destroy({
                    where:{id_utilizator:id_utilizator,id_grup:id_grup}
                })

                if(rezultat === 0 )
                {
                    return res.status(404).json({ message: "Utilizatorul nu este în acest grup!" });
                }

                res.status(200).json({ message: "Membru șters cu succes!" });
        }catch (error) {
        console.error(error);
        res.status(500).json({ message: "Eroare la ștergere", error: error.message });
    }
    }

    exports.listaMembri = async (req,res)=>{
        try{
            const id_grup =req.params.id;

            if(!id_grup)
            {
                return res.status(400).json({ message: "Lipseste ID-ul grupului!" });
            }

            const grupGasit = await Grup.findByPk(id_grup,{
                include:[{
                        model:User,
                        as:'Membri',
                        attributes:['id_utilizator', 'nume', 'prenume', 'email']
                }]
            })
            if (!grupGasit) {
            return res.status(404).json({ message: "Grupul nu există!" });
            
        }

        res.status(200).json({
            grup: grupGasit.nume_grup,
            membri: grupGasit.Membri
        });

        }catch (error) {
        console.error(error);
        res.status(500).json({ message: "Eroare la afișarea membrilor", error: error.message });
    }
    }

    exports.afisazaGrupuri = async (req,res)=>{
        try{
            const id_utilizator = req.params.id;

            if(!id_utilizator)
            {
                return res.status(400).json({ message: "Lipseste ID-ul utilizatorului!" })
            }

            const grupuriGasite = await MembriGrup.findAll({
                where:{
                    id_utilizator:id_utilizator
                },
                include:[{
                    model:Grup,
                    attributes:['id_grup', 'nume_grup', 'descriere', 'id_admin']
                }]
            })

            return res.status(200).json({
                message:`Utilizatorul face parte din ${grupuriGasite.length} grupuri.`,
                grupuri:grupuriGasite.map(grupuri=>grupuri.Grup)
            })
        }catch (error) {
        console.error(error);
        res.status(500).json({ message: "Eroare la preluarea grupurilor", error: error.message });
    }
    }

    exports.stergeGrup = async (req,res)=>{
        try{
            const id_grup = req.params.id;
            const {id_utilizator} = req.body;

            if(!id_grup)
            {
                return res.status(400).json({message:"Id-ul grupului lipseste!"});
            }

            const grup = await Grup.findByPk(id_grup);

            if(!grup)
            {
                return res.status(404).json({message:"Grupul nu exista!"});
            }
            if(grup.id_admin !== id_utilizator)
            {
                return res.status(400).json({message:"Doar admin-ul poate sterge grupul!"});
            }

            await MembriGrup.destroy({
                where:{
                    id_grup:id_grup
                }
            });
            await Grup.destroy({
                where:{
                    id_grup:id_grup
                }
            });

            res.status(200).json({message:"Grupul a fost sters cu succes!"});
        }catch(error)
        {
            console.error(error);
            res.status(500).json({ message: "Eroare la ștergerea grupului", error: error.message });
        }
    }