const express = require("express");
const clienteService = require("../services/cliente-service");
const authService = require("../services/auth-service");

const clienteRouter = express.Router();

// LISTAR TODOS (requer permissão VER)
clienteRouter.get(
    "/",
    ...authService.requirePermissao("VER"),
    async (req, res) => {
        try {
            const clientes = await clienteService.listarClientes();
            res.json(clientes);
        } catch (err) {
            res.status(500).json({ erro: err.message });
        }
    }
);

// BUSCAR POR ID
clienteRouter.get(
    "/:id",
    ...authService.requirePermissao("VER"),
    async (req, res) => {
        try {
            const cliente = await clienteService.buscarClientePorId(req.params.id);
            res.json(cliente);
        } catch (err) {
            res.status(404).json({ erro: err.message });
        }
    }
);

// CRIAR
clienteRouter.post(
    "/",
    ...authService.requirePermissao("CRIAR"),
    async (req, res) => {
        try {
            const novo = await clienteService.criarCliente(req.body);
            res.status(201).json(novo);
        } catch (err) {
            res.status(400).json({ erro: err.message });
        }
    }
);

// ATUALIZAR
clienteRouter.put(
    "/:id",
    ...authService.requirePermissao("EDITAR"),
    async (req, res) => {
        try {
            const atualizado = await clienteService.atualizarCliente(req.params.id, req.body);
            res.json(atualizado);
        } catch (err) {
            res.status(400).json({ erro: err.message });
        }
    }
);

// DELETAR
clienteRouter.delete(
    "/:id",
    ...authService.requirePermissao("DELETAR"),
    async (req, res) => {
        try {
            await clienteService.deletarCliente(req.params.id);
            res.json({ mensagem: "Cliente deletado com sucesso." });
        } catch (err) {
            res.status(400).json({ erro: err.message });
        }
    }
);

module.exports = clienteRouter;