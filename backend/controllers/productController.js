const { Product } = require('../models');

exports.addProduct = async (req, res) => {
    try {
        const { id_utilizator, denumire_produs, categorie, cantitate, data_expirare } = req.body;

        const newProduct = await Product.create({
            id_utilizator,
            denumire_produs,
            categorie,
            cantitate,
            data_expirare,
            disponibil: true
        });

        res.status(201).json({ message: "Produs adăugat cu succes!", product: newProduct });
    } catch (error) {
        res.status(500).json({ message: "Eroare la adăugare", error: error.message });
    }
};

exports.getUserProducts = async (req, res) => {
    try {
        const { id_utilizator } = req.params;
        const products = await Product.findAll({ 
            where: { id_utilizator } 
        });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Eroare la preluare produse", error: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({ message: "Produsul nu a fost găsit" });
        }

        await product.update(updatedData);
        res.status(200).json({ message: "Produs actualizat!", product });
    } catch (error) {
        res.status(500).json({ message: "Eroare la actualizare", error: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await Product.destroy({ 
            where: { id_produs: id } 
        });

        if (!result) {
            return res.status(404).json({ message: "Produsul nu a fost găsit" });
        }

        res.status(200).json({ message: "Produs șters cu succes!" });
    } catch (error) {
        res.status(500).json({ message: "Eroare la ștergere", error: error.message });
    }
};