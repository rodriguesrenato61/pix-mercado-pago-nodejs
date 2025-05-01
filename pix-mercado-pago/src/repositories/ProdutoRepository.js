const { openDB } = require('../configDB');

const findById = async function(id){

    return openDB().then((db) => {
        return db.get("SELECT * FROM vw_produtos WHERE rowid = ?", [id]).then((row) => {
            return row;
        });
    });

};

const findAll = async function(){

    return openDB().then((db) => {
        return db.all('SELECT * FROM vw_produtos').then((rows) => {
            return rows.map((row) => {
                return {
                    id: row.rowid,
                    nome: row.nome,
                    valor_formatado: row.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
                    data_criacao: row.data_criacao,
                    data_atualizacao: row.data_atualizacao
                }
            });
        });
    });

};

module.exports = { findById, findAll };