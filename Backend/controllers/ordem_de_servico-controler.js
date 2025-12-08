const express = require("express");
const ordem_de_servicoRouter = express.Router();
const ordemService = require("../services/ordem_de_servico-service");
const auth = require("../services/auth-service");

// Listar ordens
ordem_de_servicoRouter.get(
    "/",
    auth.requireJWTAuth,
    auth.verificarPermissaoMiddleware("VER"),
    async (req, res) => {
        try {
            res.json(await ordemService.listar());
        } catch (err) {
            res.status(500).json({ erro: err.message });
        }
    }
);

// Buscar 1 ordem
ordem_de_servicoRouter.get(
    "/:id",
    auth.requireJWTAuth,
    auth.verificarPermissaoMiddleware("VER"),
    async (req, res) => {
        try {
            res.json(await ordemService.buscarPorId(req.params.id));
        } catch (err) {
            res.status(404).json({ erro: err.message });
        }
    }
);

// Criar ordem
ordem_de_servicoRouter.post(
    "/",
    auth.requireJWTAuth,
    auth.verificarPermissaoMiddleware("CRIAR"),
    async (req, res) => {
        try {
            res.status(201).json(await ordemService.criar(req.body));
        } catch (err) {
            res.status(400).json({ erro: err.message });
        }
    }
);

// Atualizar ordem
ordem_de_servicoRouter.put(
    "/:id",
    auth.requireJWTAuth,
    auth.verificarPermissaoMiddleware("EDITAR"),
    async (req, res) => {
        try {
            res.json(await ordemService.atualizar(req.params.id, req.body));
        } catch (err) {
            res.status(400).json({ erro: err.message });
        }
    }
);

// Deletar ordem
ordem_de_servicoRouter.delete(
    "/:id",
    auth.requireJWTAuth,
    auth.verificarPermissaoMiddleware("DELETAR"),
    async (req, res) => {
        try {
            await ordemService.deletar(req.params.id);
            res.json({ mensagem: "Ordem excluída" });
        } catch (err) {
            res.status(400).json({ erro: err.message });
        }
    }
);

module.exports = ordem_de_servicoRouter;
