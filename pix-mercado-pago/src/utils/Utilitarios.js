const { FUSO_HORARIO } = require("../helpers/constantes");

const gerarCodigoIdentificacaoTransacao = function(provedor_pagamento_id, tipo_entidade_id, entidade_pagamento_id){
    
    const timestamp = new Date().getTime();
    let codigo_identificacao = null;

    switch(provedor_pagamento_id){
        case 1:
            codigo_identificacao = "mp_"+tipo_entidade_id+"_"+entidade_pagamento_id+"_"+timestamp;
        break;
    }

    return codigo_identificacao;
};

const gerarCodigoInsercao = function(){
    const timestamp = new Date().getTime();
    const codigo = Math.floor(Math.random() * 100000);
    return timestamp+""+codigo;
};

const getDataAtualString = function(){
    const dataAtual = new Date();
    let dataAtualFormatada = (adicionaZero(dataAtual.getFullYear().toString()) + "-" + (adicionaZero(dataAtual.getMonth()+1).toString()) + "-" + dataAtual.getDate()+" "+adicionaZero(dataAtual.getHours().toString())+":"+adicionaZero(dataAtual.getMinutes().toString())+":"+adicionaZero(dataAtual.getSeconds().toString()));
    return dataAtualFormatada;
}

const getEventDateString = function(){
    const dataAtual = new Date();
    let eventDate = (adicionaZero(dataAtual.getFullYear().toString()) + "-" + (adicionaZero(dataAtual.getMonth()+1).toString()) + "-" + dataAtual.getDate()+"T"+adicionaZero(dataAtual.getHours().toString())+":"+adicionaZero(dataAtual.getMinutes().toString())+":"+adicionaZero(dataAtual.getSeconds().toString())+".000"+FUSO_HORARIO);
    return eventDate;
}

const convertData = function(data_americano){
    if(data_americano == null){
        return '';
    }
    if(data_americano.trim() == ''){
        return '';
    }

    const parte = data_americano.split(' ');
    const dataParte = parte[0].split('-');
    const dataFormatada = adicionaZero(dataParte[2])+"/"+adicionaZero(dataParte[1])+"/"+dataParte[0]+" "+parte[1];
    return dataFormatada;
}

const formataValor = function(valor){
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function adicionaZero(numero){
    numero = parseInt(numero);
    if (numero <= 9){ 
        return "0" + numero;
    }else{
        return numero; 
    }
}

module.exports = { gerarCodigoIdentificacaoTransacao, getDataAtualString, getEventDateString, gerarCodigoInsercao, convertData, formataValor };
