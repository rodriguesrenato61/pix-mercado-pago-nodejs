const { openDB } = require('../configDB');
const Utilitarios = require('../utils/Utilitarios.js');

const findById = async function(id){
    const db = await openDB();
    try {
        const row = await db.get("SELECT * FROM produto_pagamentos WHERE rowid = ?", [id]);
        return row;
    }finally{
        await db.close();
        //console.log("Conexão DB ProdutoPagamentoRepository.findById fechada com sucesso!");
    }
};

const findByViewId = async function(id){
    const db = await openDB();
    try {
        const row = await db.get("SELECT * FROM vw_produto_pagamentos WHERE rowid = ?", [id]);
        if(row == null){
            return null;
        }
        row.data_criacao_br = Utilitarios.convertData(row.data_criacao);
        row.data_atualizacao_br = Utilitarios.convertData(row.data_atualizacao);
        row.valor_formatado = Utilitarios.formataValor(row.valor);
        return row;
    }finally{
        await db.close();
        //console.log("Conexão DB ProdutoPagamentoRepository.findByViewId fechada com sucesso!");
    }
};

const findByPaymentId = async function(payment_id){
    const db = await openDB();
    try {
        const row = await db.get("SELECT * FROM vw_produto_pagamentos WHERE payment_id = ?", [payment_id]);
        return row;
    }finally{
        await db.close();
        //console.log("Conexão DB ProdutoPagamentoRepository.findByPaymentId fechada com sucesso!");
    }
};

const getProxId = async function(){
    const db = await openDB();
    try {
        const row = await db.get('SELECT MAX(id) ultimo_id FROM produto_pagamentos');
        if(row.ultimo_id == null){
            return 1;
        }
        const id = parseInt(row.ultimo_id) + 1;
        return id;
    }finally{
        await db.close();
        //console.log("Conexão DB ProdutoPagamentoRepository.getProxId fechada com sucesso!");
    }

};

const insert = async function(row){
    const db = await openDB();
    try {
        const result = await db.run('INSERT INTO produto_pagamentos(produto_id, produto_nome, comprador, email, valor, provedor_pagamento_id, status_pagamento_id, arquivo_transacao, payment_id, codigo_insercao, data_criacao)VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);', 
            [row.produto_id, row.produto_nome, row.comprador, row.email, row.valor, row.provedor_pagamento_id, row.status_pagamento_id, row.arquivo_transacao, row.payment_id, row.codigo_insercao, row.data_criacao]);
        return result;
    }finally{
        await db.close();
        //console.log("Conexão DB ProdutoPagamentoRepository.insert fechada com sucesso!");
    }
}

const update = async function(row){
    const db = await openDB();
    try {
        const result = await db.run('UPDATE produto_pagamentos SET produto_id = ?, produto_nome = ?, comprador = ?, email = ?, valor = ?, provedor_pagamento_id = ?, status_pagamento_id = ?, arquivo_transacao = ?, payment_id = ?, codigo_insercao = ?, data_atualizacao = ? WHERE rowid = ?;', 
            [row.produto_id, row.produto_nome, row.comprador, row.email, row.valor, row.provedor_pagamento_id, row.status_pagamento_id, row.arquivo_transacao, row.payment_id, row.codigo_insercao, row.data_atualizacao, row.rowid]);
        return result;
    }finally{
        await db.close();
        //console.log("Conexão DB ProdutoPagamentoRepository.update fechada com sucesso!");
    }
}

module.exports = { findById, findByViewId, findByPaymentId, getProxId, insert, update };