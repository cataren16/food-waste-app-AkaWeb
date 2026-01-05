const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Grup = sequelize.define('Grup', {
        id_grup: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            field: 'id_grup'
        },
        id_admin: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'id_admin',
            references: {
                model: 'Utilizatori', 
                key: 'id_utilizator'
            }
        },
        nume_grup: {
            type: DataTypes.STRING, 
            allowNull: false,
            field: 'nume_grup'
        },
        descriere: {
            type: DataTypes.TEXT, 
            allowNull: true,
            field: 'descriere'
        },
        status_dieta: {
            type: DataTypes.STRING, 
            allowNull: true, 
            field: 'status_dieta'
        }
    }, {
        tableName: 'Grupuri', 
        timestamps: true,
        underscored: true,
    });

    Grup.associate = (models) => {
        Grup.belongsTo(models.User, { 
            foreignKey: 'id_admin', 
            as: 'Admin' 
        });

        Grup.belongsToMany(models.User, {
            through: models.MembriGrup, 
            foreignKey: 'id_grup',      
            otherKey: 'id_utilizator',  
            as: 'Membri'               
        });
        Grup.hasMany(models.Product, {
       foreignKey: 'id_grup',
       as: 'produse'
       });

        
    };

    return Grup;
};