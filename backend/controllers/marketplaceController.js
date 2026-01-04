const { Op } = require("sequelize");
const { Product, User, Prietenii, Solicitare, Notificare, MembriGrup} = require('../models');

exports.getFriendFeed = async (req, res) => {
    const currentUserId = req.query.userId; 

    if (!currentUserId) return res.status(400).json({ message: "userId este necesar." });

    try {
        const friendships = await Prietenii.findAll({
            where: {
                status_prietenie: 1, 
                [Op.or]: [
                    { id_utilizator_1: currentUserId },
                    { id_utilizator_2: currentUserId }
                ]
            }
        });

        let relevantUserIds = friendships.map(rel => {
            return rel.id_utilizator_1 == currentUserId ? rel.id_utilizator_2 : rel.id_utilizator_1;
        });

        const myGroups = await MembriGrup.findAll({
            where: { id_utilizator: currentUserId },
            attributes: ['id_grup']
        });
        const myGroupIds = myGroups.map(g => g.id_grup);

        if (myGroupIds.length > 0) {
            const groupMates = await MembriGrup.findAll({
                where: {
                    id_grup: { [Op.in]: myGroupIds },
                    id_utilizator: { [Op.ne]: currentUserId } 
                },
                attributes: ['id_utilizator']
            });

            groupMates.forEach(member => relevantUserIds.push(member.id_utilizator));
        }

        relevantUserIds = [...new Set(relevantUserIds)];

        const feedProducts = await Product.findAll({
            where: {
                id_utilizator: { [Op.in]: relevantUserIds }, 
                disponibil: true 
            },
            include: [
                { 
                    model: User,
                    as: 'owner', 
                    attributes: ['nume', 'email'] 
                }
            ],
            order: [['createdAt', 'DESC']] 
        });

        res.status(200).json(feedProducts);

    } catch (error) {
        console.error("Eroare Feed:", error);
        res.status(500).json({ message: "Eroare server.", error: error.message });
    }
};

const STATUS = {
    PENDING:  0,
    APPROVED: 1,
    REJECTED: 2
}

exports.claimProduct = async (req, res) => {
    const { id_produs, id_solicitant, nr_bucati } = req.body;

    try {
        const produs = await Product.findByPk(id_produs);
        
        if (!produs || !produs.disponibil || produs.cantitate <= 0) {
            return res.status(404).json({ message: "Ne pare rău, produsul tocmai s-a epuizat!" });
        }

        if (nr_bucati > produs.cantitate) {
            return res.status(400).json({ 
                message: `Stoc insuficient. Mai sunt disponibile doar ${produs.cantitate} bucăți.` 
            });
        }

        const cerereIdentica = await Solicitare.findOne({
            where: {
                id_produs,
                id_solicitant,
                status_solicitare: STATUS.PENDING,
                nr_bucati 
            }
        });

        if (cerereIdentica) {
            return res.status(400).json({ message: "Ai trimis deja o solicitare identică. Așteaptă răspunsul proprietarului." });
        }

        const newSolicitare = await Solicitare.create({
            id_produs,
            id_solicitant,
            status_solicitare: STATUS.PENDING,
            nr_bucati
        });

        await Notificare.create({
            id_utilizator: produs.id_utilizator,
            mesaj: `O nouă solicitare: ${nr_bucati} buc. de ${produs.denumire_produs}.`,
            citita: false
        });

        res.status(201).json({ 
            message: "Solicitare trimisă! Așteaptă aprobarea proprietarului.",
            solicitare: newSolicitare
         });

    } catch (error) {
        res.status(500).json({ message: "Eroare server.", error: error.message });
    }
};

exports.getIncomingClaims = async(req,res)=>{
    const userCurent = req.query.userId;

    try{
        const claims = await Solicitare.findAll({
            include:[
                {
                    model:Product,
                    as: 'ProdusSolicitat',
                    where: {id_utilizator: userCurent},
                    attributes:['id_produs','denumire_produs', 'cantitate' ]
                },
                {
                    model:User,
                    as: 'Solicitant',
                    attributes:['id_utilizator','nume','prenume','email']
                }
            ],
            order:[['created_at','DESC']]
        });
        res.status(200).json(claims);
    }catch(error){
        res.status(500).json({message: "Eroare la preluarea solicitarilor.", error: error.message});
    }
    };

    exports.getMyClaims = async(req,res)=>{
        const userCurent = req.query.userId;

        try{
            const myClaims = await Solicitare.findAll({
                where:{id_solicitant: userCurent},
                include:[
                {
                    model:Product,
                    as: 'ProdusSolicitat',
                    attributes:['id_produs','denumire_produs'],
                    include:[
                    {   model:User,
                        as:'owner',
                        attributes:['id_utilizator','nume','prenume','email']
                        }
                    ],
                    order:['created_at','DESC']
                }
            ]
            });

            res.status(200).json(myClaims);
        }
        catch(error){
            res.status(500).json({message: "Eroare la preluarea solicitarilor mele", error: error.message});
        }
    };

    exports.handleClaim = async (req, res) => {
    const { Tranzactie, Product, Solicitare, Notificare } = require("../models");
    const { id_solicitare, action, userId } = req.body;

    try {
        const solicitare = await Solicitare.findByPk(id_solicitare, {
            include: [{ model: Product, as: 'ProdusSolicitat' }]
        });

        if (!solicitare) {
            return res.status(404).json({ message: "Cerere inexistenta!" });
        }

        const produs = solicitare.ProdusSolicitat;

        if (produs.id_utilizator != userId) {
            return res.status(403).json({ message: "Nu ai dreptul să gestionezi această solicitare!" });
        }

        if (solicitare.status_solicitare !== STATUS.PENDING) {
            return res.status(400).json({ message: "Această solicitare a fost deja procesată." });
        }

        if (action === "Approve") {
            if (produs.cantitate < solicitare.nr_bucati) {
                return res.status(400).json({
                    message: `Stoc insuficient! Mai sunt doar ${produs.cantitate} bucăți disponibile.`
                });
            }

            const nouaCantitate = produs.cantitate - solicitare.nr_bucati;

            await produs.update({
                cantitate: nouaCantitate,
                disponibil: nouaCantitate > 0
            });

            await solicitare.update({ status_solicitare: STATUS.APPROVED });

            await Tranzactie.create({
                id_produs: produs.id_produs,
                id_proprietar: produs.id_utilizator,
                id_beneficiar: solicitare.id_solicitant,
                nr_bucati: solicitare.nr_bucati,
                data_finalizare: new Date()
            });

            await Notificare.create({
                id_utilizator: solicitare.id_solicitant,
                mesaj: `Cererea ta pentru ${solicitare.nr_bucati} buc. de ${produs.denumire_produs} a fost aprobată!`,
                citita: false
            });

            return res.json({ 
                message: "Solicitare aprobată cu succes!", 
                cantitateRamasa: nouaCantitate 
            });
        }

        if (action === "Reject") {
            await solicitare.update({ status_solicitare: STATUS.REJECTED });
            await Notificare.create({
                id_utilizator: solicitare.id_solicitant,
                mesaj: `Ne pare rău, solicitarea ta pentru ${produs.denumire_produs} a fost respinsă.`,
                citita: false
            });

            return res.json({ message: "Solicitare respinsă." });
        }

        return res.status(400).json({ message: "Acțiune necunoscută!" });

    } catch (error) {
        console.error("Eroare la gestionarea solicitării:", error);
        res.status(500).json({ 
            message: "Eroare la gestionarea solicitării.", 
            eroare: error.message 
        });
    }
};

    exports.getTransactionHistory = async (req, res) => {
        const {Tranzactie} = require("../models")
        const userId = req.query.userId;

        try {
            const tranzactii = await Tranzactie.findAll({
                where: {
                    [Op.or]: [
                        { id_proprietar: userId },
                        { id_beneficiar: userId }
                    ]
                },
                include: [
                    {
                        model: Product,
                        as: "product",
                        attributes: ["denumire_produs", "categorie"]
                    },
                    {
                        model: User,
                        as: "owner",
                        attributes: ["nume", "prenume"]
                    },
                    {
                        model: User,
                        as: "beneficiary",
                        attributes: ["nume", "prenume"]
                    }
                ],
                order: [["data_finalizare", "DESC"]]
            });

            res.status(200).json(tranzactii);

        } catch (error) {
            console.error("Eroare istoric tranzactii:", error);
            res.status(500).json({ 
                message: "Eroare la preluarea istoricului tranzactiilor.", 
                error: error.message 
            });
        }
    };

            
