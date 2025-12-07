"use strict";

module.exports = (sequelize, DataTypes) => {

    const Servico = sequelize.define("Servico", {
        id: {
            type: DataTypes.BIGINT, 
            autoIncrement: true,
            primaryKey: true
        },
        nome: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        descricao: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        preco: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        }
    }, {
        tableName: "servicos",
        timestamps: false
    });

    return Servico;
};
