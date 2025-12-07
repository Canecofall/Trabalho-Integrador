const db = require("../models");   // importa index.js dos models
const Servico = db.Servico;        // acessa a model Servico

const servicoRepository = {
    listar: async () => {
        return await Servico.findAll();
    },

    buscarPorId: async (id) => {
        return await Servico.findByPk(id);
    },

    criar: async (dados) => {
        return await Servico.create(dados);
    },

    atualizar: async (id, dados) => {
        return await Servico.update(dados, { where: { id } });
    },

    deletar: async (id) => {
        return await Servico.destroy({ where: { id } });
    }
};

module.exports = servicoRepository;
