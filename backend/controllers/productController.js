const { Product } = require('../models');
const { Op } = require('sequelize');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'uploads/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, 'temp_' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });
exports.uploadImage = upload.single('imagine');

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Eroare la preluare produse", error: error.message });
    }
};

exports.addProduct = async (req, res) => {
    try {
        const { id_utilizator, denumire_produs, categorie, cantitate, data_expirare } = req.body;

        if (!denumire_produs) {
            return res.status(400).json({ message: "Denumirea produsului lipsește!" });
        }

        const newProduct = await Product.create({
            id_utilizator,
            denumire_produs,
            categorie,
            cantitate: parseInt(cantitate),
            data_expirare,
            disponibil: true,
            imagine: null 
        });

        if (req.file) {
            const oldPath = req.file.path;
            const extension = path.extname(req.file.originalname); 
            const newFilename = `produs_${newProduct.id_produs}${extension}`;
            const newPath = path.join('uploads', newFilename); 
            
            if (fs.existsSync(oldPath)) {
                 fs.renameSync(oldPath, newPath);
                 
                 const dbPath = `uploads/${newFilename}`; 
                 await newProduct.update({ imagine: dbPath });
            }
        }

        res.status(201).json({ message: "Produs adăugat cu succes!", product: newProduct });
    } catch (error) {
        console.error("Eroare Add Product:", error);
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


exports.getFridgeProducts = async (req, res) => {
  try {
    const { id_utilizator } = req.params;

    if (!id_utilizator) {
      return res.status(400).json({ message: "Lipseste id_utilizator!" });
    }

    const produse = await Product.findAll({
      where: {
        id_utilizator: id_utilizator,
        id_grup: { [Op.is]: null },
      },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({ produse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Eroare la preluarea produselor din frigider", error: error.message });
  }
};
