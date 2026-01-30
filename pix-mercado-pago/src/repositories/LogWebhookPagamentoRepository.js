const { openDB } = require('../configDB');
const Utilitarios = require('../utils/Utilitarios.js');

const findByViewId = async function(id){
    const db = await openDB();
    try {
        const row = await db.get("SELECT * FROM vw_logs_webhook_pagamento WHERE rowid = ?", [id]); 
        if(row == null){
            return row;
        }
        row.data_criacao_br = Utilitarios.convertData(row.data_criacao);
        row.data_atualizacao_br = Utilitarios.convertData(row.data_atualizacao);
        return row;
    }finally{
        await db.close();
        //console.log("Conexão DB LogWebhookPagamento.findByViewId fechada com sucesso!");
    }
};

const insert = async function(row){
    const db = await openDB();
    try {
        const result = await db.run('INSERT INTO logs_webhook_pagamento(provedor_pagamento_id, conteudo, codigo_identificacao, data_criacao)VALUES(?, ?, ?, ?);', 
            [row.provedor_pagamento_id, row.conteudo, row.codigo_identificacao, row.data_criacao]);
        return result; 
    }finally{
        await db.close();
        //console.log("Conexão DB LogWebhookPagamento.insert fechada com sucesso!");
    }
}

module.exports = { findByViewId, insert };