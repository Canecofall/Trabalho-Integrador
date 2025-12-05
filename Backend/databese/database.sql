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

-- INSERE USUARIOS
--usuario admin@outlook.com
--senha   Administrador
INSERT INTO usuario (email, nome, senha) 
VALUES ('admin@outlook.com', 'Administrador', '"$2b$10$mHBljwcXFAHfT73HXh5FZOZsgsqmiBGrLALB3qJhSzJ3CLCqWoN8K"');

--usuario usuario@outlook.com
--senha   usuario
INSERT INTO usuario (email, nome, senha) 
VALUES ('usuario@outlook.com', 'usuario', '$2b$10$V1OXzHqOoG0QJSfN3Iqp6.IXJ5/QVHIAsjBFeA9DVWdrVv1Fyod0u');

-- INSERE PERMISSAO ANTES DE TUDO
INSERT INTO permissao (id, descricao) 
VALUES (1, 'VER');
VALUES (2, 'EDITAR');
VALUES (3, 'CRIAR');
VALUES (4, 'DELETAR');


-- INSERE RELACIONAMENTO
INSERT INTO usuario_permissao (email, id_permissao) 
VALUES ('usuario@outlook.com', 1);
VALUES ('admin@outlook.com', 1);
VALUES ('admin@outlook.com', 2);
VALUES ('admin@outlook.com', 3);
VALUES ('admin@outlook.com', 4);
