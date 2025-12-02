const usuarioPermissaoRepository = require("../repositories/usuario_permissao-repository");

// Função para retornar todas as associações usuário-permissão
const retornaTodosUsuarioPermissoes = async (req, res) => {
	try {
		const usuarioPermissoes = await usuarioPermissaoRepository.obterTodosUsuarioPermissoes();
		res.status(200).json({ usuarioPermissoes: usuarioPermissoes });
	} catch (error) {
		console.log("Erro ao buscar usuário-permissões:", error);
		res.sendStatus(500);
	}
};

// Função para retornar todas as permissões de um usuário
const retornaPermissoesPorUsuario = async (req, res) => {
	try {
		const email = req.params.email;
		const permissoes = await usuarioPermissaoRepository.obterPermissoesPorUsuario(email);
		res.status(200).json({ permissoes: permissoes });
	} catch (error) {
		console.log("Erro ao buscar permissões do usuário:", error);
		res.sendStatus(500);
	}
};

// Função para retornar todos os usuários com uma permissão específica
const retornaUsuariosPorPermissao = async (req, res) => {
	try {
		const id_permissao = parseInt(req.params.id_permissao);
		const usuarios = await usuarioPermissaoRepository.obterUsuariosPorPermissao(id_permissao);
		res.status(200).json({ usuarios: usuarios });
	} catch (error) {
		console.log("Erro ao buscar usuários por permissão:", error);
		res.sendStatus(500);
	}
};

// Função para criar uma nova associação usuário-permissão
const criaUsuarioPermissao = async (req, res) => {
	const { email, id_permissao } = req.body;
	try {
		if (!email || !id_permissao) {
			return res
				.status(400)
				.json({ message: "Email e ID da permissão são obrigatórios." });
		}

		const usuarioPermissao = await usuarioPermissaoRepository.criarUsuarioPermissao({
			email,
			id_permissao,
		});
		res.status(201).json(usuarioPermissao);
	} catch (error) {
		console.log("Erro ao criar usuário-permissão:", error);
		res.sendStatus(500);
	}
};

// Função para deletar uma associação usuário-permissão
const deletaUsuarioPermissao = async (req, res) => {
	try {
		const email = req.params.email;
		const id_permissao = parseInt(req.params.id_permissao);
		const usuarioPermissaoRemovida = await usuarioPermissaoRepository.deletarUsuarioPermissao({
			email,
			id_permissao,
		});

		if (usuarioPermissaoRemovida) {
			res.status(200).json({
				message: "Associação usuário-permissão removida com sucesso.",
				usuarioPermissao: usuarioPermissaoRemovida,
			});
		} else {
			res.status(404).json({ message: "Associação usuário-permissão não encontrada" });
		}
	} catch (error) {
		console.error("Erro ao deletar usuário-permissão:", error);
		res.status(500).json({ message: "Erro ao deletar usuário-permissão" });
	}
};

// Função para verificar se um usuário tem uma permissão específica
const verificaPermissaoUsuario = async (req, res) => {
	try {
		const email = req.params.email;
		const id_permissao = parseInt(req.params.id_permissao);
		const temPermissao = await usuarioPermissaoRepository.verificarPermissaoUsuario(email, id_permissao);

		res.status(200).json({
			email: email,
			id_permissao: id_permissao,
			temPermissao: temPermissao,
		});
	} catch (error) {
		console.log("Erro ao verificar permissão do usuário:", error);
		res.sendStatus(500);
	}
};

module.exports = {
	retornaTodosUsuarioPermissoes,
	retornaPermissoesPorUsuario,
	retornaUsuariosPorPermissao,
	criaUsuarioPermissao,
	deletaUsuarioPermissao,
	verificaPermissaoUsuario,
};
