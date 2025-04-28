const { BASE_URL } = require('../helpers/constantes');
const ProdutoRepository = require('../repositories/ProdutoRepository.js');
const ProdutoPagamentoRepository = require('../repositories/ProdutoPagamentoRepository.js');
const TransacaoRepository = require('../repositories/TransacaoRepository.js');
const Utilitarios = require('../utils/Utilitarios.js');
const MercadoPagoClientApi = require('../api/MercadoPagoClientApi.js');

const comprar = async function(request, response){
    const produto = await ProdutoRepository.findById(request.params.produto_id);
    if(produto == null){
        return response.json({
            'success': false,
            'msg': "Produto não encontrado"
        });
    }

    let produto_pagamento = {
        rowid: null,
        produto_id: produto.id,
        produto_nome: produto.nome,
        comprador: "Adão José",
        email: request.params.email,
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
    
    const createPix = await MercadoPagoClientApi.createPayment(external_reference, "pix", produto_pagamento.produto_id, produto_pagamento.comprador, produto_pagamento.email, phone, cpf, produto_pagamento.produto_nome, 1, produto_pagamento.valor);
    if(!createPix.point_of_interaction){
        const error = (createPix.error) ? createPix.error : "Error";
        const messageError = (createPix.message) ? createPix.message : "não foi possível criar o payment pix no Mercado Pago";
        return response.json({
            success: false,
            msg: error+": "+messageError
        });
    }

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
};

const findPayment = async function(request, response){

    const payment_id = request.params.payment_id;
    const produto_pagamento = await ProdutoPagamentoRepository.findByPaymentId(payment_id);
    if(produto_pagamento == null){
        return response.json({
            success: false,
            msg: "Produto pagamento com esse payment_id não encontrado"
        });
    }
    const paymentResponse = await MercadoPagoClientApi.findPayment(payment_id);
    if(!paymentResponse.id){
        const error = (paymentResponse.error) ? paymentResponse.error : "Error";
        const messageError = (paymentResponse.message) ? paymentResponse.message : "não foi possível criar o payment pix no Mercado Pago";
        return response.json({
            success: false,
            msg: error+": "+messageError
        });
    }

    const payment_status = paymentResponse.status;

    const external_reference = paymentResponse.external_reference;
    let transacoes = await TransacaoRepository.findByCodigoIdentificacao(external_reference);
    let transacao = null;
    if(transacoes.length > 0){
        transacao = transacoes[transacoes.length - 1];
    }else{
        transacao = {
            tipo_entidade_id: 1,
            entidade_pagamento_id: produto_pagamento.rowid,
            provedor_pagamento_id: 1,
            codigo_identificacao: external_reference,
            status_transacao: '',
            data_criacao: Utilitarios.getDataAtualString()
        };
    }

    if(transacao.status_transacao != payment_status){
        transacao.status_transacao = payment_status;
        const insertTransacao = await TransacaoRepository.insert(transacao);
        if(!insertTransacao.lastID){
            return response.json({
                success: false,
                msg: "Transação não pode ser cadastrada",
                dados: transacao
            });
        }

        switch(payment_status){
            case "pending":
                produto_pagamento.status_pagamento_id = 1;
            break;
            case "approved":
                produto_pagamento.status_pagamento_id = 2;
            break;
            case "authorized":
                produto_pagamento.status_pagamento_id = 3;
            break;
            case "in_process":
                produto_pagamento.status_pagamento_id = 3;
            break;
            case "in_mediation":
                produto_pagamento.status_pagamento_id = 3;
            break;
            case "rejected":
                produto_pagamento.status_pagamento_id = 6;
            break;
            case "cancelled":
                produto_pagamento.status_pagamento_id = 5;
            break;
            case "refunded":
                produto_pagamento.status_pagamento_id = 4;
            break;
            case "charged_back":
                produto_pagamento.status_pagamento_id = 7;
            break;
        }

        produto_pagamento.data_atualizacao = Utilitarios.getDataAtualString();
        const updateProdutoPagamento = await ProdutoPagamentoRepository.update(produto_pagamento);
    }

    return response.json({
        success: true,
        msg: "Transação encontrada com sucesso",
        dados: {
            payment_status: paymentResponse.status
        }
    });
};

const getPagamento = async function(request, response){
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
};

module.exports = { comprar, findPayment, getPagamento };