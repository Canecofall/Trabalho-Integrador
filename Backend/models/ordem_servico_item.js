"use strict";

module.exports = (sequelize, DataTypes) => {
    const OrdemServicoItem = sequelize.define(
        "OrdemServicoItem",
        {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            id_ordem: { type: DataTypes.INTEGER, allowNull: false },
            id_servico: { type: DataTypes.INTEGER, allowNull: false },
            quantidade: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
            preco: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
        },
        {
            tableName: "ordem_servico_item",
            timestamps: false,
            underscored: true,
        }
    );

    OrdemServicoItem.associate = (models) => {
        OrdemServicoItem.belongsTo(models.OrdemServico, {
            foreignKey: "id_ordem",
            as: "ordem",
        });

        OrdemServicoItem.belongsTo(models.Servico, {
            foreignKey: "id_servico",
            as: "servico",
        });
    };

    return OrdemServicoItem;
};
