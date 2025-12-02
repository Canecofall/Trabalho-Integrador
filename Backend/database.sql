CREATE TABLE permissao
(
  id bigint  NOT NULL,
  descricao varchar NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE usuario
(
  email varchar NOT NULL,
  nome varchar NOT NULL,
  senha varchar NOT NULL,
  PRIMARY KEY (email)
);

CREATE TABLE usuario_permissao
(
  email varchar NOT NULL,
  id_permissao bigint NOT NULL,
  PRIMARY KEY (email, id_permissao),
  CONSTRAINT fk_usuario_permissao_usuario FOREIGN KEY (email) 
      REFERENCES usuario (email),
  CONSTRAINT fk_usuario_permissao_permissao FOREIGN KEY (id_permissao) 
      REFERENCES permissao (id)
);

-- INSERE PERMISSAO ANTES DE TUDO
INSERT INTO permissao (id, descricao) 
VALUES (1, 'VISUALIZAR_ALUNOS');

-- INSERE USUARIOS
INSERT INTO usuario (email, nome, senha) 
VALUES ('admin@outlook.com', 'Administrador', 'admin');

INSERT INTO usuario (email, nome, senha) 
VALUES ('user@outlook.com', 'Usuario', 'user');

-- INSERE RELACIONAMENTO
INSERT INTO usuario_permissao (email, id_permissao) 
VALUES ('admin@outlook.com', 1);
