const { BASE_URL, MERCADO_PAGO_BASE_URL, ACCESS_TOKEN_PROD } = require('../helpers/constantes.js');
const axios = require('axios');
const Utilitarios = require('../utils/Utilitarios.js');

const createPayment = async function(external_reference, method, produto_id, comprador, email, phone, cpf, description, quantity, price){

    const eventDate = Utilitarios.getEventDateString();
    const payerArray = comprador.split(' ');
    let firstName = comprador;
    let lastName = null;
    const numPayerNames = payerArray.length;
    if(numPayerNames > 1){
        firstName = payerArray[0];
        lastName = payerArray[numPayerNames - 1];
    }

    return axios({
        method: 'POST',
        url: `${MERCADO_PAGO_BASE_URL}/v1/payments`,
        headers: {
            'Authorization': `Bearer ${ACCESS_TOKEN_PROD}`,
            'Content-Type': 'application/json',
            'X-Idempotency-Key': external_reference
        },
        data: {
            callback_url: `${BASE_URL}/pagamento/${external_reference}`,
            notification_url: `${BASE_URL}/webhook`,
            additional_info: {
                items: [
                    {
                        id: produto_id,
                        title: description,
                        description: description,
                        picture_url: null,
                        category_id: "virtual_goods",
                        quantity: quantity,
                        unit_price: price,
                        type: "digital",
                        event_date: eventDate,
                        warranty: false
                    }
                ],
                payer: {
                    first_name: firstName,
                    last_name: lastName,
                    phone: {
                        number: phone
                    }
                }
            },
            binary_mode: false,
            capture: true,
            description: description,
            external_reference: external_reference,
            installments: 1,
            payer: {
                entity_type: "individual",
                type: "customer",
                email: email,
                identification: {
                    type: "CPF",
                    number: cpf
                }
            },
            payment_method_id: method,
            statement_descriptor: description,
            transaction_amount: price
        }
    }).then((response) => {
        return response;
    });
};

const findPayment = async function(dataId){

    return axios({
        method: 'GET',
        url: `${MERCADO_PAGO_BASE_URL}/v1/payments/${dataId}`,
        headers: {
            'Authorization': `Bearer ${ACCESS_TOKEN_PROD}`
        }
    }).then((response) => {
        return response;
    });
};

module.exports = { createPayment, findPayment };