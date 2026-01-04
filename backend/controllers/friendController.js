const {Prietenii,User}=require('../models');
const {Op}=require('sequelize')

exports.trimiteCerere = async (req, res) => {
  try {
    const { id_eu, id_prieten } = req.body;

    if (!id_eu || !id_prieten) {
      return res.status(400).json({ message: "Lipsesc ID-urile necesare!" });
    }

    // ✅ NOUA FUNCȚIONALITATE: verifică dacă există deja relație (pending sau prieteni)
    const exista = await Prietenii.findOne({
      where: {
        [Op.or]: [
          { id_utilizator_1: id_eu, id_utilizator_2: id_prieten },
          { id_utilizator_1: id_prieten, id_utilizator_2: id_eu },
        ],
      },
    });

    if (exista) {
      if (exista.status_prietenie === 1) {
        return res.status(409).json({ message: "Sunteți deja prieteni!" });
      }
      if (exista.status_prietenie === 0) {
        return res.status(409).json({ message: "Există deja o cerere în așteptare!" });
      }
    }

    await Prietenii.create({
      id_utilizator_1: id_eu,
      id_utilizator_2: id_prieten,
      status_prietenie: 0,
    });

    return res.status(201).json({ message: "Inregistare realizata cu succes!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Eroare la trimiterea cererii", error: error.message });
  }
};


exports.acceptaCerere= async(req,res)=>{

    try{
        const{id_eu,id_prieten}=req.body;
        if(!id_eu||!id_prieten){
            return res.status(400).json({message:"Lipsesc ID-urile necesare!"})

        }
    
        const rezultat = await Prietenii.update(
            {status_prietenie:1},
            {
                where:{
                    id_utilizator_1:id_prieten,
                    id_utilizator_2:id_eu
                }
            }
        );
        if(rezultat[0]===0)
        {
            return res.status(404).json({ message: "Nu am găsit nicio cerere de la acest user!" });
        }
        return res.status(200).json({ message: "Felicitări! Acum sunteți prieteni!" });
    }
    catch(error)
    {
        console.error(error);
        res.status(500).json({ message: "Eroare la acceptarea cererii", error: error.message });
    }
}

exports.stergerCerere = async (req,res)=>{
    try{
        const {id_eu,id_prieten}=req.body

        if(!id_eu||!id_prieten){
            return res.status(404).json({message:"Lipsesc ID-urile necesare!"})
        }

        const rezultat = await Prietenii.destroy({
            where:{
                    [Op.or]:[{id_utilizator_1:id_eu,id_utilizator_2:id_prieten},
                        {id_utilizator_1:id_prieten,id_utilizator_2:id_eu}

                    ]
            }
        });

        if(rezultat===0)
        {
           return res.status(404).json({message:"Nu am găsit nicio prietenie de la acest user!"})
        }

        return res.status(201).json({ message: "Felicitări! Acum prietene stearsa!" });
    }
    catch(error)
    {
        console.error(error)
        res.status(500).json({ message: "Eroare la stergerea cererii", error: error.message });
    }
}

exports.listaPrieteni = async (req,res)=>{
    try{
        const id_eu=req.params.id   
        
        if(!id_eu)
        {
            return res.status(400).json({message:"Lipseste id-ul!"})
        }

        const lista = await Prietenii.findAll({
            where:{
                [Op.or]:[{id_utilizator_1:id_eu},
                        {id_utilizator_2:id_eu}

                    ],
                    status_prietenie:1
            }
        });
        res.status(200).json({ 
            message: `Am găsit ${lista.length} prieteni!`,
            prietenii: lista 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Eroare la preluarea listei", error: error.message });
    }
}


exports.cereriPrimite = async (req, res) => {
  try {
    const id_eu = req.params.id_eu; 

    const cereri = await Prietenii.findAll({
      where: {
        id_utilizator_2: id_eu,
        status_prietenie: 0
      },
      include: [
        {
          model: User,
          as: 'UtilizatorPrincipal',
          attributes: ['id_utilizator', 'nume', 'prenume', 'email']
        }
      ]
    });

    return res.status(200).json({ requests: cereri });
  } catch (error) {
    console.error("Eroare cereriPrimite:", error);
    return res.status(500).json({ message: "Eroare la cereri primite", error: error.message });
  }
};

exports.cereriTrimise = async (req, res) => {
  try {
    const id_eu = req.params.id_eu;

    const cereri = await Prietenii.findAll({
      where: {
        id_utilizator_1: id_eu,
        status_prietenie: 0
      },
      include: [
        {
          model: User,
          as: 'UtilizatorSecundar', // destinatarul cererii
          attributes: ['id_utilizator', 'nume', 'prenume', 'email']
        }
      ]
    });

    return res.status(200).json({ requests: cereri });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Eroare la cereri trimise", error: error.message });
  }
};
exports.anuleazaCerereTrimisa = async (req, res) => {
  try {
    const { id_eu, id_prieten } = req.body;

    if (!id_eu || !id_prieten) {
      return res.status(400).json({ message: "Lipsesc ID-urile necesare!" });
    }

    // șterge DOAR cererea trimisă de mine către el, care e încă în pending
    const rezultat = await Prietenii.destroy({
      where: {
        id_utilizator_1: id_eu,
        id_utilizator_2: id_prieten,
        status_prietenie: 0,
      },
    });

    if (rezultat === 0) {
      return res.status(404).json({ message: "Nu există cerere trimisă de anulat." });
    }

    return res.status(200).json({ message: "Cererea a fost anulată." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Eroare la anulare", error: error.message });
  }
};

