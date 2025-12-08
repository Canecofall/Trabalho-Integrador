const { OrdemServico, OrdemServicoItem, Cliente, Servico } = require("../models");

module.exports = {
    listar() {
        return OrdemServico.findAll({
            include: [
                { model: Cliente, as: "cliente" },
                {
                    model: OrdemServicoItem,
                    as: "itens",
                    include: [{ model: Servico, as: "servico" }],
                },
            ],
        });
    },

    buscarPorId(id) {
        return OrdemServico.findByPk(id, {
            include: [
                { model: Cliente, as: "cliente" },
                {
                    model: OrdemServicoItem,
                    as: "itens",
                    include: [{ model: Servico, as: "servico" }],
                },
            ],
        });
    },

        async criar(dados) {
        return await OrdemServico.create(
            {
                id_cliente: dados.id_cliente,
                equipamento: dados.equipamento,
                marca: dados.marca,
                modelo: dados.modelo,
                numero_serie: dados.numero_serie,
                defeito: dados.defeito,
                perifericos: dados.perifericos,
                senha: dados.senha,
                status: dados.status || "ABERTA",
                itens: dados.itens
            },
            {
                include: [{ model: OrdemServicoItem, as: "itens" }]
            }
        );
    },

    atualizar(id, dados) {
        return OrdemServico.update(dados, {
            where: { id },
            returning: true,
        });
    },

    deletar(id) {
        return OrdemServico.destroy({ where: { id } });
    }
};
