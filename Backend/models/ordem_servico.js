"use strict";

module.exports = (sequelize, DataTypes) => {
    const OrdemServico = sequelize.define(
        "OrdemServico",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            id_cliente: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            equipamento: DataTypes.STRING,
            marca: DataTypes.STRING,
            modelo: DataTypes.STRING,
            numero_serie: DataTypes.STRING,
            defeito: DataTypes.STRING,
            perifericos: DataTypes.STRING,
            senha: DataTypes.STRING,
            status: {
                type: DataTypes.STRING,
                defaultValue: "ABERTA",
            },
            criado_em: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            tableName: "ordem_servico",
            timestamps: false,
            underscored: true,
        }
    );
    OrdemServico.associate = (models) => {
        OrdemServico.belongsTo(models.Cliente, {
            foreignKey: "id_cliente",
            as: "cliente",
        });

        OrdemServico.hasMany(models.OrdemServicoItem, {
            foreignKey: "id_ordem",
            as: "itens",
        });
    };


    return OrdemServico;
};
