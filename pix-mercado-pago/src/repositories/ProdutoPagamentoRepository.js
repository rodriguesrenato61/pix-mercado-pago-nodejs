const { openDB } = require('../configDB');
const Utilitarios = require('../utils/Utilitarios.js');

const findById = async function(id){

    return openDB().then((db) => {
        return db.get("SELECT * FROM produto_pagamentos WHERE rowid = ?", [id]).then((row) => {
            return row;
        });
    });

};

const findByViewId = async function(id){

    return openDB().then((db) => {
        return db.get("SELECT * FROM vw_produto_pagamentos WHERE rowid = ?", [id]).then((row) => {
            row.data_criacao_br = Utilitarios.convertData(row.data_criacao);
            row.data_atualizacao_br = Utilitarios.convertData(row.data_atualizacao);
            row.valor_formatado = Utilitarios.formataValor(row.valor);
            return row;
        });
    });

};

const findByPaymentId = async function(payment_id){

    return openDB().then((db) => {
        return db.get("SELECT * FROM vw_produto_pagamentos WHERE payment_id = ?", [payment_id]).then((row) => {
            return row;
        });
    });

};

const getProxId = async function(){

    return openDB().then((db) => {
        return db.get('SELECT MAX(id) ultimo_id FROM produto_pagamentos').then((row) => {
            if(row.ultimo_id == null){
                return 1;
            }

            const id = parseInt(row.ultimo_id) + 1;
            return id;
        });
    });

};

const insert = async function(row){
    return openDB().then((db) => {
        return db.run('INSERT INTO produto_pagamentos(produto_id, produto_nome, comprador, email, valor, provedor_pagamento_id, status_pagamento_id, arquivo_transacao, payment_id, codigo_insercao, data_criacao)VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);', 
        [row.produto_id, row.produto_nome, row.comprador, row.email, row.valor, row.provedor_pagamento_id, row.status_pagamento_id, row.arquivo_transacao, row.payment_id, row.codigo_insercao, row.data_criacao]).then((result) => {
            return result;
        });
    });
}

const update = async function(row){
    return openDB().then((db) => {
        return db.run('UPDATE produto_pagamentos SET produto_id = ?, produto_nome = ?, comprador = ?, email = ?, valor = ?, provedor_pagamento_id = ?, status_pagamento_id = ?, arquivo_transacao = ?, payment_id = ?, codigo_insercao = ?, data_atualizacao = ? WHERE rowid = ?;', 
        [row.produto_id, row.produto_nome, row.comprador, row.email, row.valor, row.provedor_pagamento_id, row.status_pagamento_id, row.arquivo_transacao, row.payment_id, row.codigo_insercao, row.data_atualizacao, row.rowid]).then((result) => {
            return result;
        });
    });
}

module.exports = { findById, findByViewId, findByPaymentId, getProxId, insert, update };