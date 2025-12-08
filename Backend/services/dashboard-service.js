const { OrdemServico } = require("../models");
const { Sequelize } = require("sequelize");

module.exports = {
    async getDashboardData() {
        const total_de_ordens = await OrdemServico.count();

        const ordensFinalizadas = await OrdemServico.count({
            where: { status: "FINALIZADA" }
        });

        return {
            total_de_ordens,
            ordensFinalizadas
        };
    }
};
