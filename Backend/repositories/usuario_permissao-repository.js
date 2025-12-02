const model = require("../models");

// Função para obter todas as associações usuário-permissão
const obterTodosUsuarioPermissoes = async () => {
	return await model.UsuarioPermissao.findAll({
		include: [
			{
				model: model.Usuario,
			},
			{
				model: model.Permissao,
				as: "Permissao",
			},
		],
	});
};

// Função para obter permissões por email do usuário
const obterPermissoesPorUsuario = async (email) => {
	return await model.UsuarioPermissao.findAll({
		where: {
			email: email,
		},
		include: [
			{
				model: model.Permissao,
				as: "Permissao",
			},
		],
	});
};

// Função para obter usuários por ID da permissão
const obterUsuariosPorPermissao = async (id_permissao) => {
	return await model.UsuarioPermissao.findAll({
		where: {
			id_permissao: id_permissao,
		},
		include: [
			{
				model: model.Usuario,
			},
		],
	});
};

// Função para criar uma nova associação usuário-permissão
const criarUsuarioPermissao = async (usuarioPermissao) => {
	await model.UsuarioPermissao.create(usuarioPermissao);
	return usuarioPermissao;
};

// Função para deletar uma associação usuário-permissão
const deletarUsuarioPermissao = async (usuarioPermissao) => {
	try {
		await model.UsuarioPermissao.destroy({
			where: {
				email: usuarioPermissao.email,
				id_permissao: usuarioPermissao.id_permissao,
			},
		});

		return usuarioPermissao;
	} catch (error) {
		throw error;
	}
};

// Função para verificar se um usuário tem uma permissão específica
const verificarPermissaoUsuario = async (email, id_permissao) => {
	const associacao = await model.UsuarioPermissao.findOne({
		where: {
			email: email,
			id_permissao: id_permissao,
		},
	});

	return associacao !== null;
};

module.exports = {
	obterTodosUsuarioPermissoes,
	obterPermissoesPorUsuario,
	obterUsuariosPorPermissao,
	criarUsuarioPermissao,
	deletarUsuarioPermissao,
	verificarPermissaoUsuario,
};
