const servicoRepository = require("../repositories/servico-repository");

const servicoService = {
    listar: async () => servicoRepository.listar(),

    buscarPorId: async (id) => {
        const servico = await servicoRepository.buscarPorId(id);
        if (!servico) throw new Error("Serviço não encontrado");
        return servico;
    },

    criar: async (dados) => {
        if (!dados.nome || !dados.descricao || !dados.preco)
            throw new Error("Campos obrigatórios não preenchidos");

        return await servicoRepository.criar(dados);
    },

    atualizar: async (id, dados) => {
        const existe = await servicoRepository.buscarPorId(id);
        if (!existe) throw new Error("Serviço não encontrado");

        await servicoRepository.atualizar(id, dados);
        return await servicoRepository.buscarPorId(id);
    },

    deletar: async (id) => {
        const existe = await servicoRepository.buscarPorId(id);
        if (!existe) throw new Error("Serviço não encontrado");

        return servicoRepository.deletar(id);
    },
};

module.exports = servicoService;
