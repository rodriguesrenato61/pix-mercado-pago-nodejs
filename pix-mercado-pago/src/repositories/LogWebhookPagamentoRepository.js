const { openDB } = require('../configDB');
const Utilitarios = require('../utils/Utilitarios.js');

const findByViewId = async function(id){

    return openDB().then((db) => {
        return db.get("SELECT * FROM vw_logs_webhook_pagamento WHERE rowid = ?", [id]).then((row) => {
            row.data_criacao_br = Utilitarios.convertData(row.data_criacao);
            row.data_atualizacao_br = Utilitarios.convertData(row.data_atualizacao);
            return row;
        });
    });

};

const insert = async function(row){
    return openDB().then((db) => {
        return db.run('INSERT INTO logs_webhook_pagamento(provedor_pagamento_id, conteudo, codigo_identificacao, data_criacao)VALUES(?, ?, ?, ?);', 
        [row.provedor_pagamento_id, row.conteudo, row.codigo_identificacao, row.data_criacao]).then((result) => {
            return result;
        });
    });
}

module.exports = { findByViewId, insert };