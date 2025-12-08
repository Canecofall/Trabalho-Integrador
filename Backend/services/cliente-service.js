const clienteRepository = require("../repositories/cliente-repository");

module.exports = {
    async listarClientes() {
        return await clienteRepository.listar();
    },

    async buscarClientePorId(id) {
        const cliente = await clienteRepository.buscarPorId(id);
        if (!cliente) throw new Error("Cliente não encontrado.");
        return cliente;
    },

    async criarCliente(dados) {
        if (!dados.nome || !dados.telefone) {
            throw new Error("Nome e Telefone são obrigatórios.");
        }
        return await clienteRepository.criar(dados);
    },

    async atualizarCliente(id, dados) {
        if (!dados.nome || !dados.telefone) {
            throw new Error("Nome e Telefone são obrigatórios.");
        }
        return await clienteRepository.atualizar(id, dados);
    },

    async deletarCliente(id) {
        return await clienteRepository.deletar(id);
    }
};
