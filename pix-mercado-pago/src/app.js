const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const { init: initHandlebars } = require('./helpers/handlebars');
const ProdutoController = require('./controllers/ProdutosController');
const VendasController = require('./controllers/VendasController');
const MercadoPagoController = require('./controllers/MercadoPagoController');

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static(path.join(__dirname, "assets")));

initHandlebars(app);

app.get('/', ProdutoController.index);

app.post('/comprar', VendasController.comprar);

app.get('/transacao/:payment_id', MercadoPagoController.findPayment);

app.get('/pagamento/:external_reference', VendasController.getPagamento);

app.post('/webhook', MercadoPagoController.webhook);

app.listen(3000, () => {
    console.log("aplicação rodando na porta 3000");
});