const { BASE_URL } = require('../helpers/constantes');
const ProdutoRepository = require('../repositories/ProdutoRepository.js');
const ProdutoPagamentoRepository = require('../repositories/ProdutoPagamentoRepository.js');
const TransacaoRepository = require('../repositories/TransacaoRepository.js');
const Utilitarios = require('../utils/Utilitarios.js');
const MercadoPagoClientApi = require('../api/MercadoPagoClientApi.js');

const comprar = async function(request, response){

    try {

        const produto_id = request.body.produto_id;
        const email = request.body.email;

        const produto = await ProdutoRepository.findById(produto_id);
        if(produto == null){
            return response.json({
                'success': false,
                'msg': "Produto não encontrado",
                dados: request.body
            });
        }

        let produto_pagamento = {
            rowid: null,
            produto_id: produto.id,
            produto_nome: produto.nome,
            comprador: "Renato Rodrigues",
            email: email,
            valor: produto.valor,
            provedor_pagamento_id: 1,
            status_pagamento_id: 1,
            arquivo_transacao: null,
            payment_id: null,
            codigo_insercao: Utilitarios.gerarCodigoInsercao(),
            data_criacao: Utilitarios.getDataAtualString()
        };

        const phone = "98987457410";
        const cpf = "25450655010";

        let insert = await ProdutoPagamentoRepository.insert(produto_pagamento);
        if(!insert.lastID){
            return response.json({
                success: false,
                msg: "Entidade pagamento não pode ser cadastrada"
            });
        }

        const entidade_pagamento_id = insert.lastID;
        const external_reference = Utilitarios.gerarCodigoIdentificacaoTransacao(1, 1, entidade_pagamento_id);
        
        let createPix = await MercadoPagoClientApi.createPayment(external_reference, "pix", produto_pagamento.produto_id, produto_pagamento.comprador, produto_pagamento.email, phone, cpf, produto_pagamento.produto_nome, 1, produto_pagamento.valor);
        createPix = createPix.data;

        produto_pagamento.rowid = insert.lastID;
        produto_pagamento.arquivo_transacao = external_reference;
        produto_pagamento.payment_id = createPix.id.toString();
        produto_pagamento.data_atualizacao = Utilitarios.getDataAtualString();
        const update = await ProdutoPagamentoRepository.update(produto_pagamento);
                
        return response.json({
            success: true,
            msg: "Pix do Mercado Pago criado com sucesso",
            dados: {
                qr_code: createPix.point_of_interaction.transaction_data.qr_code,
                qr_code_img: createPix.point_of_interaction.transaction_data.qr_code_base64,
                external_reference: external_reference,
                payment_id: createPix.id
            }
        });

    }catch(e){
        if(e.response){
            const create_pix_data = e.response.data;
            const create_pix_status = e.response.status;
            const error = (create_pix_data.error) ? create_pix_data.error : "Error";
            const messageError = (create_pix_data.message) ? create_pix_data.message : "não foi possível criar o payment pix no Mercado Pago";
            return response.json({
                success: false,
                msg: create_pix_status+" - "+error+": "+messageError
            });
        }

        return response.json({
            success: false,
            msg: "Erro ao comprar: "+e.message
        });
    }
};

const getPagamento = async function(request, response){

    try {

        const external_reference = request.params.external_reference;

        let transacao = await TransacaoRepository.findByCodigoIdentificacao(external_reference);
        if(transacao.length == 0){
            return response.json({
                success: false,
                msg: "Nenhuma transação registrada com esse external_reference"
            });
        }
                        
        transacao = transacao[0];
        const produto_pagamento = await ProdutoPagamentoRepository.findByViewId(transacao.entidade_pagamento_id);
        if(produto_pagamento == null){
            return response.json({
                success: false,
                msg: "Pagamento não encontrado"
            });
        }
        
        let titulo_pagina = "Pagamento bem sucedido";
        let titulo = "Pagamento realizado com sucesso!";
        const status_pagamento_id = parseInt(produto_pagamento.status_pagamento_id);
        if(status_pagamento_id != 2){
            titulo_pagina = "Pagamento pendente";
            titulo = "Seu pagamento ainda não foi efetuado!";
        }

        const pago = (status_pagamento_id == 2); 
        
        return response.render('pagamento', {
            success: true,
            msg: "Pagamento encontrado com sucesso",
            layout: "pagamento.hbs",
            title: titulo_pagina,
            titulo_pagamento: titulo,
            external_reference: external_reference,
            produtoPagamento: produto_pagamento,
            pago: pago,
            url_retorno: `${BASE_URL}/`
        });

    }catch(e){
        return response.render('pagamento', {
            success: false,
            msg: "Erro ao acessar pagamento: "+e.message,
            layout: "pagamento.hbs",
            title: "Erro no pagamento",
            titulo_pagamento: "Ocorreu um erro no seu pagamento",
            external_reference: "",
            produtoPagamento: null,
            pago: false,
            url_retorno: `${BASE_URL}/`
        });
    }
};

module.exports = { comprar, getPagamento };