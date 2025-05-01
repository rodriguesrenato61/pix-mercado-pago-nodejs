-- Active: 1717381940628@@127.0.0.1@3306
CREATE TABLE provedores_pagamento(
	id INTEGER AUTO_INCREMENT NOT NULL,
	nome VARCHAR(50),
	data_criacao DATETIME NOT NULL,
	data_atualizacao DATETIME,
	PRIMARY KEY(id)
);

INSERT INTO provedores_pagamento(id, nome, data_criacao)
	VALUES(1, 'Mercado Pago', '2024-06-02 10:14:05');

CREATE TABLE logs_webhook_pagamento(
	id INTEGER AUTO_INCREMENT NOT NULL,
	provedor_pagamento_id INTEGER,
	conteudo LONGTEXT,
	codigo_identificacao VARCHAR(50),
	data_criacao DATETIME,
	data_atualizacao DATETIME,
	PRIMARY KEY(id)
);

CREATE TABLE status_pagamento(
	id INTEGER AUTO_INCREMENT NOT NULL,
	descricao VARCHAR(50) NOT NULL,
	PRIMARY KEY(id)
);

INSERT INTO status_pagamento(id, descricao)
	VALUES(1, 'Aguardando pagamento'),(2, 'Pago'),(3, 'Em processamento'),
	(4, 'Devolvido'),(5, 'Cancelado'),(6, 'Rejeitado'),(7, 'Cobrado de volta');

CREATE TABLE produtos(
    id INTEGER AUTO_INCREMENT NOT NULL,
    nome VARCHAR(100),
    valor DOUBLE,
    data_criacao DATETIME,
    data_atualizacao DATETIME,
    PRIMARY KEY(id)
);

INSERT INTO produtos(id, nome, valor, data_criacao)
    VALUES(1, 'Curso de Wordpress', 0.15, '2024-06-02 10:14:05'),
    (2, 'Curso de Marketing Digital', 0.06, '2024-06-02 10:14:05'),
    (3, 'Software de Relatórios', 0.07, '2024-06-02 10:14:05'),
    (4, 'Ebook - Vendas pela internet', 0.08, '2024-06-02 10:14:05'),
    (5, 'Ebook - Receitas baratas', 0.09, '2024-06-02 10:14:05'),
    (6, 'Curso de HTML5', 0.10, '2024-06-02 10:14:05'),
    (7, 'Curso de Php', 0.11, '2024-06-02 10:14:05');

CREATE VIEW vw_produtos AS SELECT p.id, p.nome, p.valor, p.data_criacao, STRFTIME('%d/%m/%Y %H:%i:%s', p.data_criacao) data_criacao_br, p.data_atualizacao, STRFTIME('%d/%m/%Y %H:%i:%s', p.data_atualizacao) data_atualizacao_br
FROM produtos p;

CREATE TABLE produto_pagamentos(
    produto_id INTEGER,
    produto_nome VARCHAR(100),
    comprador VARCHAR(150),
	email VARCHAR(50),
    valor DOUBLE,
	provedor_pagamento_id INTEGER,
    status_pagamento_id INTEGER,
	arquivo_transacao VARCHAR(50),
    payment_id VARCHAR(30),
	codigo_insercao VARCHAR(20),
	data_criacao DATETIME NOT NULL,
	data_atualizacao DATETIME
);


CREATE VIEW vw_produto_pagamentos AS SELECT pp.rowid, pp.produto_id, pp.produto_nome, pp.comprador, pp.email, pp.valor, pp.provedor_pagamento_id, ppg.nome provedor_pagamento, pp.status_pagamento_id, sp.descricao status_pagamento,
pp.arquivo_transacao, pp.payment_id, pp.codigo_insercao, pp.data_criacao, STRFTIME('%d/%m/%Y %H:%i:%s', pp.data_criacao) data_criacao_br, pp.data_atualizacao, STRFTIME('%d/%m/%Y %H:%i:%s', pp.data_atualizacao) data_atualizacao_br
FROM produto_pagamentos pp
INNER JOIN provedores_pagamento ppg ON pp.provedor_pagamento_id = ppg.id
INNER JOIN status_pagamento sp ON pp.status_pagamento_id = sp.id;

CREATE TABLE tipos_entidade(
	id INTEGER AUTO_INCREMENT NOT NULL,
	nome VARCHAR(50) NOT NULL,
	PRIMARY KEY(id)
);

INSERT INTO tipos_entidade(id, nome)
	VALUES(1, 'Produto');

CREATE TABLE transacoes(
	tipo_entidade_id INTEGER,
	entidade_pagamento_id INTEGER,
	provedor_pagamento_id INTEGER,
	codigo_identificacao VARCHAR(50),
	status_transacao VARCHAR(50),
	data_criacao DATETIME NOT NULL,
	data_atualizacao DATETIME
);

CREATE VIEW vw_transacoes AS SELECT rowid, tipo_entidade_id, entidade_pagamento_id, provedor_pagamento_id, codigo_identificacao, status_transacao, data_criacao, data_atualizacao FROM transacoes;