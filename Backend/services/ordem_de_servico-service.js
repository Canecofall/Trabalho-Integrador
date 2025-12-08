const { OrdemServico, OrdemServicoItem, Cliente, Servico } = require("../models");

module.exports = {
    // LISTAR TODAS AS ORDENS
    listar: async () => {
        return await OrdemServico.findAll({
            include: [
                { model: Cliente, as: "cliente" },
                { model: OrdemServicoItem, as: "itens", include: [{ model: Servico, as: "servico" }] }
            ]
        });
    },

    // BUSCAR POR ID
    buscarPorId: async (id) => {
        return await OrdemServico.findByPk(id, {
            include: [
                { model: Cliente, as: "cliente" },
                { model: OrdemServicoItem, as: "itens", include: [{ model: Servico, as: "servico" }] }
            ]
        });
    },

    // CRIAR ORDEM
    criar: async (dados) => {
        const { itens, ...ordemData } = dados;

        const ordemCriada = await OrdemServico.create(ordemData);

        if (itens && itens.length > 0) {
            for (const item of itens) {
                await OrdemServicoItem.create({
                    id_ordem: ordemCriada.id,
                    id_servico: item.id_servico,
                    quantidade: item.quantidade,
                    preco: item.preco
                });
            }
        }

        return ordemCriada;
    },

    // ATUALIZAR ORDEM
    atualizar: async (id, dados) => {
        const { itens, ...ordemData } = dados;

        // Atualiza dados da ordem
        await OrdemServico.update(ordemData, { where: { id } });

        // Remove itens antigos
        await OrdemServicoItem.destroy({ where: { id_ordem: id } });

        // Insere itens novos
        if (itens && itens.length > 0) {
            for (const item of itens) {
                await OrdemServicoItem.create({
                    id_ordem: id,
                    id_servico: item.id_servico,
                    quantidade: item.quantidade,
                    preco: item.preco
                });
            }
        }

        // Retorna a OS atualizada
        return await OrdemServico.findByPk(id, {
            include: [
                { model: Cliente, as: "cliente" },
                { model: OrdemServicoItem, as: "itens", include: [{ model: Servico, as: "servico" }] }
            ]
        });
    },


    // DELETAR
    deletar: async (id) => {
        await OrdemServicoItem.destroy({ where: { id_ordem: id } });
        await OrdemServico.destroy({ where: { id } });
        return { mensagem: "Ordem de serviço removida" };
    }
};
