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

exports.claimProduct = async(req,res)=>{
    const {id_produs, id_solicitant} = req.body;

    if(!id_produs || !id_solicitant){
        return res.status(400).json({message: "Lipsesc datele necesare."});
    }

    try{
        const produs = await Product.findByPk(id_produs);
        if(!produs || !produs.disponibil){
            return res.status(404).json({message: "Produsul nu este disponibil."});
        }
        if(produs.id_utilizator === id_solicitant){
            return res.status(400).json({message: "Nu poti revendica propriul produs."});
        }

        const solicitareExistenta = await Solicitare.findOne({
            where:{
                id_produs: id_produs,
                id_solicitant: id_solicitant,
                status_solicitare: STATUS.PENDING
            }
        });

        if(solicitareExistenta){
            return res.status(400).json({message: "Ai deja o solicitare in asteptare pentru acest produs."});
        }

        const newSolicitare = await Solicitare.create({
            id_produs: id_produs,
            id_solicitant: id_solicitant,
            status_solicitare: STATUS.PENDING,
            nr_bucati: 1
        });

        await Notificare.create({
            id_utilizator: produs.id_utilizator,
            mesaj: `Utilizatorul cu ID ${id_solicitant} a solicitat produsul tau cu ID ${id_produs}.`,
            citit: false
        });

        res.status(201).json({message: "Solicitare creata cu succes.", solicitare: newSolicitare});

    }
    catch(error){
        console.error("Eroare la revendicarea produsului:", error);
        res.status(500).json({message: "Eroare la operatia de solicitare.", error: error.message});
    }
}

exports.getIncomingClaims = async(req,res)=>{
    const userCurent = req.query.userId;

    try{
        const claims = await Solicitare.findAll({
            where:{status_solicitare: STATUS.PENDING},
            include:[
                {
                    model:Product,
                    as: 'ProdusSolicitat',
                    where: {id_utilizator: userCurent},
                    attributes:['id_produs','denumire_produs']
                },
                {
                    model:User,
                    as: 'Solicitant',
                    attributes:['id_utilizator','nume','email']
                }
            ]
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
                    include:[
                    {   model:User,
                        as:'owner',
                        attributes:['id_utilizator','nume','email']
                        }
                    ]
                }
            ]
            });

            res.status(200).json(myClaims);
        }
        catch(error){
            res.status(500).json({message: "Eroare la preluarea solicitarilor mele", error: error.message});
        }
    };

    exports.handleClaim = async(req,res)=>{
        const {Tranzactie} = require("../models")
        const {id_solicitare, action, userId} = req.body;
        
        try{
            const solicitare = await Solicitare.findByPk(id_solicitare,
                {include:[{model:Product, as:'ProdusSolicitat'}]}
            );

            if(!solicitare)
                return res.status(404).json({message:"Cerere inexistenta!"});

            if(solicitare.ProdusSolicitat.id_utilizator!=userId)
                return res.status(403).json({message:"Nu ai dreptul sa gestionezi aceste date!"})


            const product = solicitare.ProdusSolicitat

            if (action === "Approve") {

                const cantitateAprobata = await Solicitare.sum("nr_bucati", {
                    where: {
                        id_produs: product.id_produs,
                        status_solicitare: STATUS.APPROVED
                    }
                });

                const cantitateDisponibila = product.cantitate - (cantitateAprobata || 0);

                if (cantitateDisponibila < solicitare.nr_bucati) {
                    return res.status(400).json({
                        message: "Cantitate insuficienta in stoc pentru aprobarea cererii"
                    });
                }

                await solicitare.update({ status_solicitare: STATUS.APPROVED });

                const cantitateRamasa = cantitateDisponibila - solicitare.nr_bucati;

                await product.update({
                    disponibil: cantitateRamasa > 0
                });

                await Tranzactie.create({
                    id_produs:product.id_produs,
                    id_proprietar:product.id_utilizator,
                    id_beneficiar:solicitare.id_solicitant,
                    nr_bucati:solicitare.nr_bucati,
                    data_finalizare: new Date()
                })

                await Notificare.create({
                    id_utilizator: solicitare.id_solicitant,
                    mesaj: `Cererea ta pentru ${product.denumire_produs} a fost aprobata!`,
                    citita: false
                });

                return res.json({ message: "Cerere aprobata si tranzactie finalizata!" });
            }


            if (action === 'Reject') {

            await solicitare.update({ status_solicitare: STATUS.REJECTED });

            await Notificare.create({
                id_utilizator: solicitare.id_solicitant,
                mesaj: `Cererea ta pentru ${product.denumire_produs} a fost respinsa.`,
                citita: false
            });

            return res.json({ message: "Cerere respinsa." });
        }

        return res.status(400).json({ message: "Actiune necunoscuta" });

    } catch (error) {
        console.error("Eroare la gestionarea solicitarii:", error);
        res.status(500).json({ message: "Eroare la gestionarea solicitarii.", eroare: error.message });
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

            
