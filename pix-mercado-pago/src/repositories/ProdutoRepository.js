const { openDB } = require('../configDB');

const findById = async function(id){
    const db = await openDB();
    try {
        const row = await db.get("SELECT * FROM vw_produtos WHERE rowid = ?", [id]);
        return row;
    }finally{
        await db.close();
        //console.log("Conexão DB ProdutoRepository.findById fechada com sucesso!");
    }
};

const findAll = async function(){
    const db = await openDB();
    try {
        const rows = await db.all('SELECT * FROM vw_produtos');
        return rows.map((row) => {
            return {
                id: row.rowid,
                nome: row.nome,
                valor_formatado: row.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
                data_criacao: row.data_criacao,
                data_atualizacao: row.data_atualizacao
            }
        });
    }finally{
        await db.close();
        //console.log("Conexão DB ProdutoRepository.findAll fechada com sucesso!");
    }
};

module.exports = { findById, findAll };