const { DataTypes } = require('sequelize');


module.exports = (sequelize) => {
    const Product = sequelize.define('Product', {
        id_produs: {
            type: DataTypes.INTEGER, 
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            field: 'id_produs'
        },
        id_utilizator: {
            type: DataTypes.INTEGER, 
            allowNull: false,
            field: 'id_utilizator'
        },
        denumire_produs: {
            type: DataTypes.TEXT, 
            allowNull: false,
            field: 'denumire_produs'
        },
        categorie: {                
            type: DataTypes.TEXT,
            allowNull: true,
            field: 'categorie'
    },
        cantitate: {
            type: DataTypes.INTEGER, 
            allowNull: true,
            field: 'cantitate'
        },
        data_expirare: {
            type: DataTypes.DATE, 
            allowNull: false,
            field: 'data_expirare'
        },
        disponibil: {
            type: DataTypes.BOOLEAN, 
            defaultValue: true,
            allowNull: false,
            field: 'disponibil'
        },
        id_grup: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'id_grup'
        }

    }, {
        tableName: 'Produse', 
        timestamps: true, 
        underscored: true 
    });


    Product.associate = (models) => {
       
        Product.belongsTo(models.User, {
            foreignKey: 'id_utilizator',
            as: 'owner',
            onDelete: 'CASCADE' 
        });


        Product.hasMany(models.Solicitare, {
            foreignKey: 'id_produs',
            as: 'claims',
            onDelete: 'CASCADE'
        });


       Product.hasMany(models.Tranzactie, { 
            foreignKey: 'id_produs',
            as: 'transactions',
            onDelete: 'SET NULL' 
        });
        Product.belongsTo(models.Grup, {
        foreignKey: 'id_grup',
         as: 'grup',
        onDelete: 'SET NULL'
        });

    };


    return Product;
};
