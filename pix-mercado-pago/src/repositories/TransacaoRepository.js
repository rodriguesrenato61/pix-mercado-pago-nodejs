const { openDB } = require('../configDB');
const Utilitarios = require('../utils/Utilitarios.js');

const findById = async function(id){
    const db = await openDB();
    try {
        const row = await db.get("SELECT * FROM vw_transacoes WHERE rowid = ?", [id]);
        return row;
    }finally{
        await db.close();
        //console.log("Conexão DB TransacaoRepository.findById fechada com sucesso!");
    }

};

const findByCodigoIdentificacao = async function(codigo_identificacao){
    const db = await openDB();
    try {
        const rows = await db.all("SELECT * FROM vw_transacoes WHERE codigo_identificacao = ?", [codigo_identificacao]);
        return rows.map((row) => {
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
    }finally{
        await db.close();
        //console.log("Conexão DB TransacaoRepository.findByCodigoIdentificacao fechada com sucesso!");
    }
};

const getProxId = async function(){
    const db = await openDB();
    try {
        const row = await db.get('SELECT MAX(id) ultimo_id FROM transacoes');
        if(row.ultimo_id == null || row.ultimo_id == ''){
            console.log("Chegou aqui proxId transação 1");
            return 1;
        }

        const id = parseInt(row.ultimo_id) + 1;
        return id;
    }finally{
        await db.close();
        //console.log("Conexão DB TransacaoRepository.getProxId fechada com sucesso!");
    }
};

const insert = async function(row){
    const db = await openDB();
    try {
        const result = await db.run('INSERT INTO transacoes(tipo_entidade_id, entidade_pagamento_id, provedor_pagamento_id, codigo_identificacao, status_transacao, data_criacao)VALUES(?, ?, ?, ?, ?, ?);', 
            [row.tipo_entidade_id, row.entidade_pagamento_id, row.provedor_pagamento_id, row.codigo_identificacao, row.status_transacao, row.data_criacao]);
        return result;
    }finally{
        await db.close();
        //console.log("Conexão DB TransacaoRepository.insert fechada com sucesso!");
    }
}

const update = async function(row){
    const db = await openDB();
    try {
        const result = await db.run('UPDATE transacoes SET tipo_entidade_id = ?, entidade_pagamento_id = ?, provedor_pagamento_id = ?, codigo_identificacao = ?, status_transacao = ?, data_atualizacao = ? WHERE rowid = ?;', 
            [row.tipo_entidade_id, row.entidade_pagamento_id, row.provedor_pagamento_id, row.codigo_identificacao, row.status_transacao, row.data_atualizacao, row.rowid]);
        return result;
    }finally{
        await db.close();
        //console.log("Conexão DB TransacaoRepository.update fechada com sucesso!");
    }
}

module.exports = { findById, findByCodigoIdentificacao, getProxId, insert, update };