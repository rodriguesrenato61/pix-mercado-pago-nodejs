const { openDB } = require('../configDB');
const Utilitarios = require('../utils/Utilitarios.js');

const findById = async function(id){

    return openDB().then((db) => {
        return db.get("SELECT * FROM vw_transacoes WHERE rowid = ?", [id]).then((row) => {
            return row;
        });
    });

};

const findByCodigoIdentificacao = async function(codigo_identificacao){

    return openDB().then((db) => {
        return db.all("SELECT * FROM vw_transacoes WHERE codigo_identificacao = ?", [codigo_identificacao]).then((rows) => {
            const registros = rows.map((row) => {
                return {
                    rowid: row.rowid,
                    tipo_entidade_id: row.tipo_entidade_id,
                    entidade_pagamento_id: row.entidade_pagamento_id,
                    provedor_pagamento_id: row.provedor_pagamento_id,
                    codigo_identificacao: row.codigo_identificacao,
                    status_transacao: row.status_transacao,
                    data_criacao: row.data_criacao,
                    data_criacao_br: Utilitarios.convertData(row.data_criacao),
                    data_atualizacao: row.data_atualizacao,
                    data_atualizacao_br: Utilitarios.convertData(row.data_atualizacao)
                };
            });
            return registros;
        });
    });

};

const getProxId = async function(){

    return openDB().then((db) => {
        return db.get('SELECT MAX(id) ultimo_id FROM transacoes').then((row) => {
            if(row.ultimo_id == null || row.ultimo_id == ''){
                console.log("Chegou aqui proxId transação 1");
                return 1;
            }

            const id = parseInt(row.ultimo_id) + 1;
            return id;
        });
    });

};

const insert = async function(row){
    return openDB().then((db) => {
        return db.run('INSERT INTO transacoes(tipo_entidade_id, entidade_pagamento_id, provedor_pagamento_id, codigo_identificacao, status_transacao, data_criacao)VALUES(?, ?, ?, ?, ?, ?);', 
        [row.tipo_entidade_id, row.entidade_pagamento_id, row.provedor_pagamento_id, row.codigo_identificacao, row.status_transacao, row.data_criacao]).then((result) => {
            return result;
        });
    });
}

const update = async function(row){
    return openDB().then((db) => {
        return db.run('UPDATE transacoes SET tipo_entidade_id = ?, entidade_pagamento_id = ?, provedor_pagamento_id = ?, codigo_identificacao = ?, status_transacao = ?, data_atualizacao = ? WHERE rowid = ?;', 
        [row.tipo_entidade_id, row.entidade_pagamento_id, row.provedor_pagamento_id, row.codigo_identificacao, row.status_transacao, row.data_atualizacao, row.rowid]).then((result) => {
            return result;
        });
    });
}

module.exports = { findById, findByCodigoIdentificacao, getProxId, insert, update };