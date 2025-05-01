const { WEBHOOK } = require('../helpers/constantes');
const ProdutoPagamentoRepository = require('../repositories/ProdutoPagamentoRepository.js');
const TransacaoRepository = require('../repositories/TransacaoRepository.js');
const Utilitarios = require('../utils/Utilitarios.js');
const MercadoPagoClientApi = require('../api/MercadoPagoClientApi.js');

const findPayment = async function(request, response){

    try {

        const payment_id = request.params.payment_id;
        const produto_pagamento = await ProdutoPagamentoRepository.findByPaymentId(payment_id);
        if(produto_pagamento == null){
            return response.json({
                success: false,
                msg: "Produto pagamento com esse payment_id não encontrado"
            });
        }

        if(WEBHOOK){
            return response.json({
                success: true,
                msg: "Produto pagamento encontrado com sucesso",
                dados: {
                    status_pagamento_id: parseInt(produto_pagamento.status_pagamento_id)
                }
            });
        }

        let paymentResponse = await MercadoPagoClientApi.findPayment(payment_id);
        paymentResponse = paymentResponse.data;

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
                status_pagamento_id: parseInt(produto_pagamento.status_pagamento_id)
            }
        });

    }catch(e){
        if(e.response){
            const response_data = e.response.data;
            const response_status = e.response.status;
            const error = (response_data.error) ? response_data.error : "Error";
            const messageError = (response_data.message) ? response_data.message : "não foi possível encontrar o payment pix no Mercado Pago";
            return response.json({
                success: false,
                msg: response_status+" "+error+": "+messageError
            });
        }
        return response.json({
            success: false,
            msg: "Erro ao encontrar transação: "+e.message
        });
    }
};

const webhook = async function(request, response){

    try {

        const data_id = request.query.data_id;
        const type = request.query.type;
        const form = request.body;

        if(data_id == null){
            return response.json({
                success: false,
                msg: "data_id não encontrada"
            });
        }
			
        if(type != "payment"){
            return response.json({
                success: false,
                msg: "type na requisição não é payment"
            });
        }

        const produto_pagamento = await ProdutoPagamentoRepository.findByPaymentId(data_id);
        if(produto_pagamento == null){
            return response.json({
                success: false,
                msg: "Produto pagamento com esse payment_id não encontrado"
            });
        }

        let paymentResponse = await MercadoPagoClientApi.findPayment(data_id);
        paymentResponse = paymentResponse.data;
    
        const payment_status = paymentResponse.status;
        const external_reference = paymentResponse.external_reference;

        if(form.action == "payment.created" || form.action == "payment.updated"){
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
            }
        }

        let status_pagamento_id = 1;

        switch(payment_status){
            case "pending":
                status_pagamento_id = 1;
            break;
            case "approved":
                status_pagamento_id = 2;
            break;
            case "authorized":
                status_pagamento_id = 3;
            break;
            case "in_process":
                status_pagamento_id = 3;
            break;
            case "in_mediation":
                status_pagamento_id = 3;
            break;
            case "rejected":
                status_pagamento_id = 6;
            break;
            case "cancelled":
                status_pagamento_id = 5;
            break;
            case "refunded":
                status_pagamento_id = 4;
            break;
            case "charged_back":
                status_pagamento_id = 7;
            break;
        }

        let msg = "Webhook executado com sucesso";

        if(status_pagamento_id != parseInt(produto_pagamento.status_pagamento_id)){
            produto_pagamento.status_pagamento_id = status_pagamento_id;
            produto_pagamento.data_atualizacao = Utilitarios.getDataAtualString();
            const updateProdutoPagamento = await ProdutoPagamentoRepository.update(produto_pagamento);
            msg = "Status pagamento atualizado com sucesso";
        }
    
        return response.json({
            success: true,
            msg: msg,
            dados: {
                data_id: data_id,
                type: type,
                form: form,
                produto_pagamento: produto_pagamento
            }
        });
    }catch(e){
        if(e.response){
            const response_data = e.response.data;
            const response_status = e.response.status;
            const error = (response_data.error) ? response_data.error : "Error";
            const messageError = (response_data.message) ? response_data.message : "não foi possível encontrar o payment pix no Mercado Pago";
            return response.json({
                success: false,
                msg: response_status+" "+error+": "+messageError
            });
        }
        return response.json({
            success: false,
            msg: "Erro webhook: "+e.message
        });
    }

};

module.exports = { findPayment, webhook };