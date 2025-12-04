const usuarioRepository = require("../repositories/usuario-repository");

// Função para retornar todos os usuários
const retornaTodosUsuarios = async (req, res) => {
	try {
		const usuarios = await usuarioRepository.obterTodosUsuarios();
		res.status(200).json({ usuarios: usuarios });
	} catch (error) {
		console.log("Erro ao buscar usuários:", error);
		res.sendStatus(500);
	}
};

// Função para criar um novo usuário
const criaUsuario = async (req, res) => {
	const { email, nome, senha } = req.body;
	console.log({ email, nome, senha });
	try {
		if (!email || !nome || !senha) {
			return res
				.status(400)
				.json({ message: "Email, nome e senha são obrigatórios." });
		}

		const usuario = await usuarioRepository.criarUsuario({
			email,
			nome,
			senha,
		});
		res.status(201).json(usuario);
	} catch (error) {
		console.log("Erro ao criar usuário:", error);
		res.sendStatus(500);
	}
};

// Função para atualizar um usuário
const atualizaUsuario = async (req, res) => {
	const { nome, senha } = req.body;
	const email = req.params.email;
	try {
		const usuarioAtualizado = await usuarioRepository.atualizarUsuario({
			email,
			nome,
			senha,
		});

		if (usuarioAtualizado) {
			res.status(200).json(usuarioAtualizado);
		} else {
			res.status(404).json({ message: "Usuário não encontrado" });
		}
	} catch (error) {
		console.log("Erro ao atualizar usuário:", error);
		res.sendStatus(500);
	}
};

// Função para deletar um usuário
const deletaUsuario = async (req, res) => {
	try {
		const email = req.params.email;
		const usuarioRemovido = await usuarioRepository.deletarUsuario({ email });

		if (usuarioRemovido) {
			res.status(200).json({
				message: "Usuário removido com sucesso.",
				usuario: usuarioRemovido,
			});
		} else {
			res.status(404).json({ message: "Usuário não encontrado" });
		}
	} catch (error) {
		console.error("Erro ao deletar usuário:", error);
		res.status(500).json({ message: "Erro ao deletar usuário" });
	}
};

// Função para buscar usuário por email
const retornaUsuarioPorEmail = async (req, res) => {
	try {
		const email = req.params.email;
		const usuario = await usuarioRepository.obterUsuarioPorEmail({
			email,
		});

		if (usuario) {
			res.status(200).json(usuario);
		} else {
			res.status(404).json({ message: "Usuário não encontrado." });
		}
	} catch (error) {
		console.log("Erro ao buscar usuário:", error);
		res.sendStatus(500);
	}
};

// Função para buscar usuário com suas permissões
const retornaUsuarioComPermissoes = async (req, res) => {
	try {
		const email = req.params.email;
		const usuario = await usuarioRepository.obterUsuarioComPermissoes({
			email,
		});

		if (usuario) {
			res.status(200).json(usuario);
		} else {
			res.status(404).json({ message: "Usuário não encontrado." });
		}
	} catch (error) {
		console.log("Erro ao buscar usuário com permissões:", error);
		res.sendStatus(500);
	}
};

module.exports = {
	retornaTodosUsuarios,
	criaUsuario,
	atualizaUsuario,
	deletaUsuario,
	retornaUsuarioPorEmail,
	retornaUsuarioComPermissoes,
};