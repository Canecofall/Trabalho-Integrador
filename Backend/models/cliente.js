"use strict";

module.exports = (sequelize, DataTypes) => {
    const Cliente = sequelize.define(
        "Cliente",
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true,
            },
            nome: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            cpf_cnpj: {
                type: DataTypes.STRING(20),
                allowNull: false,
                unique: true,
            },
            telefone: {
                type: DataTypes.STRING(20),
                allowNull: true,
            },
            email: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            cep: {
                type: DataTypes.STRING(20),
                allowNull: true,
            },
            rg: {
                type: DataTypes.STRING(20),
                allowNull: true,
            },
            nascimento: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            contribuinte: {
                type: DataTypes.STRING(10),
                allowNull: true,
            },
            inscricao_estadual: {
                type: DataTypes.STRING(30),
                allowNull: true,
            },
        },
        {
            tableName: "cliente",
            timestamps: false,
        }
    );

    Cliente.associate = (models) => {
        Cliente.hasMany(models.OrdemServico, {
            foreignKey: "id_cliente",
        });
    };

    return Cliente;
};
