const ProdutoRepository = require('../repositories/ProdutoRepository.js');
const { MASTER_DIR, PIX_EXPIRACAO } = require('../helpers/constantes');

const index = async function(request, response){
    const produtos = await ProdutoRepository.findAll();
    return response.render('index', {layout: MASTER_DIR, title: "Produtos", pix_expiracao: PIX_EXPIRACAO, produtos: produtos});
};

module.exports = { index };