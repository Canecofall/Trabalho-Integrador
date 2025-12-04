const express = require("express");
const usuarioService = require("../services/usuario-service");

const usuarioRouter = express.Router();

// POST /usuario - Criar novo usuário
usuarioRouter.post("/", usuarioService.criaUsuario);

// GET /usuario/todos - Retornar todos os usuários
usuarioRouter.get("/todos", usuarioService.retornaTodosUsuarios);

// GET /usuario/:email - Retornar usuário por email
usuarioRouter.get("/:email", usuarioService.retornaUsuarioPorEmail);

// GET /usuario/:email/permissoes - Retornar usuário com suas permissões
usuarioRouter.get("/:email/permissoes", usuarioService.retornaUsuarioComPermissoes);

// PUT /usuario/:email - Atualizar usuário
usuarioRouter.put("/:email", usuarioService.atualizaUsuario);

// DELETE /usuario/:email - Deletar usuário
usuarioRouter.delete("/:email", usuarioService.deletaUsuario);

module.exports = usuarioRouter;