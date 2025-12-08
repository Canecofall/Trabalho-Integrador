const express = require("express");
const servicoService = require("../services/servico-service");
const authService = require("../services/auth-service");

const servicoRouter = express.Router();

/**
 * 🔹 LISTAR SERVIÇOS
 * Permissão: VER
 */
servicoRouter.get(
    "/",
    ...authService.requirePermissao("VER"),
    async (req, res) => {
        try {
            const dados = await servicoService.listar();
            res.json(dados);
        } catch (err) {
            res.status(500).json({ erro: err.message });
        }
    }
);

/**
 * BUSCAR POR ID
 * Permissão: VER
 */
servicoRouter.get(
    "/:id",
    ...authService.requirePermissao("VER"),
    async (req, res) => {
        try {
            const dados = await servicoService.buscarPorId(req.params.id);
            res.json(dados);
        } catch (err) {
            res.status(404).json({ erro: err.message });
        }
    }
);

/**
 * CRIAR SERVIÇO
 * Permissão: CRIAR
 */
servicoRouter.post(
    "/",
    ...authService.requirePermissao("CRIAR"),
    async (req, res) => {
        try {
           const novo = await servicoService.criar(req.body);
            res.status(201).json(novo);
        } catch (err) {
           //console.log(" ERRO AO CRIAR SERVIÇO:", err.message);
           //console.log(" DADOS RECEBIDOS NO BACKEND:", req.body);

            res.status(400).json({ erro: err.message });
        }
    }
);

/**
 * ATUALIZAR SERVIÇO
 * Permissão: EDITAR
 */
servicoRouter.put(
    "/:id",
    ...authService.requirePermissao("EDITAR"),
    async (req, res) => {
        try {
            const atualizado = await servicoService.atualizar(
                req.params.id,
                req.body
            );
            res.json(atualizado);
        } catch (err) {
            res.status(400).json({ erro: err.message });
        }
    }
);

/**
 * DELETAR SERVIÇO
 * Permissão: DELETAR
 */
servicoRouter.delete(
    "/:id",
    ...authService.requirePermissao("DELETAR"),
    async (req, res) => {
        try {
            await servicoService.deletar(req.params.id);
            res.json({ mensagem: "Serviço deletado com sucesso" });
        } catch (err) {
            res.status(400).json({ erro: err.message });
        }
    }
);

module.exports = servicoRouter;
