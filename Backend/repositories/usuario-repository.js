const model = require("../models");

// Função para obter todos os usuários
const obterTodosUsuarios = async () => {
	return await model.Usuario.findAll();
};

// Função para obter usuário por email
const obterUsuarioPorEmail = async (usuario) => {
	return await model.Usuario.findByPk(usuario.email);
};

// Função para obter usuário com suas permissões
const obterUsuarioComPermissoes = async (usuario) => {
	return await model.Usuario.findByPk(usuario.email, {
		include: [
			{
				model: model.Permissao,
				as: "Permissao",
				through: { attributes: [] }, // Não incluir atributos da tabela de junção
			},
		],
	});
};

// Função para criar um novo usuário
const criarUsuario = async (usuario) => {
	await model.Usuario.create(usuario);
	return usuario;
};

// Função para atualizar um usuário
const atualizarUsuario = async (usuario) => {
	try {
		// Atualizar o usuário
		await model.Usuario.update(usuario, { where: { email: usuario.email } });

		// Retornar o usuário atualizado
		return await model.Usuario.findByPk(usuario.email);
	} catch (error) {
		throw error;
	}
};

// Função para deletar um usuário
const deletarUsuario = async (usuario) => {
	try {
		// Deletar o usuário
		await model.Usuario.destroy({ where: { email: usuario.email } });
		return usuario;
	} catch (error) {
		throw error;
	}
};

module.exports = {
	obterTodosUsuarios,
	obterUsuarioPorEmail,
	obterUsuarioComPermissoes,
	criarUsuario,
	atualizarUsuario,
	deletarUsuario,
};
