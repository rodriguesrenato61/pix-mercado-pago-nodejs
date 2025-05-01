# pix-mercado-pago-nodejs
### Aplicação integrada a API do Mercado Pago para receber pagamentos por PIX

Esta aplicação foi construída utilizando o NodeJs como backend, banco de dados SQLite e para o frontend foram utilizados HTML, CSS e Javascript.

Para testar é necessário ter credenciais próprias de acesso a API do Mercado Pago para gerar o PIX. O webhook já foi implementado e testado somente localmente através do postman, todos os logs de notificação do webhook ficam na tabela logs_webhook_pagamento.

Para qualquer dúvida ou contratar para novos trabalhos mandar email para rrodrigues.dev01@gmail.com.

### Vídeo tutorial
https://www.youtube.com/watch?v=tMUaYeBM_XU

### Ambiente utilizado
npm versão 10.9.0

node versão 22.12.0

### Passos para utilização
#### 1. Baixe o repositório
<pre>git clone https://github.com/rodriguesrenato61/pix-mercado-pago-nodejs.git</pre>

#### 2. Abra o terminal na pasta do repositório e digite o comando para instalar as dependências necessárias
<pre>npm install</pre>

#### 3. Crie o banco de dados SQLite com os scripts no arquivo banco.sql. Ou utilize o banco já preexistente no arquivo pix-mercado-pago/src/database.db

#### 4. Coloque as suas credenciais de autenticação PUBLIC_KEY_PROD e ACCESS_TOKEN_PROD da API do Mercado Pago no arquivo pix-mercado-pago/src/helpers/constantes.js e também a url raíz da sua aplicação em BASE_URL. Para que a notificação de pix pago apareça por atualização através do webhook deixe a variável WEBHOOK como verdadeira, caso contrário uma requisição para o Mercado Pago será feita a cada 5 segundos para verificar o status do PIX.

![constantes](https://github.com/rodriguesrenato61/pix-mercado-pago-nodejs/blob/main/prints/constantes.png)

#### 5. Coloque o seguinte comando no terminal para rodar a aplicação
<pre>npm run dev</pre>

#### 6. Abra o navegador com a url de acordo com a porta mostrada no terminal, exemplo: localhost:3000

#### 7. Selecione o produto

![produtos](https://github.com/rodriguesrenato61/pix-mercado-pago-nodejs/blob/main/prints/produtos.png)

#### 8. Preencha o email e click em Gerar Pix

![email](https://github.com/rodriguesrenato61/pix-mercado-pago-nodejs/blob/main/prints/modal_email.png)

#### 9. Leia o qrcode pix com o aplicativo do seu banco

![qrcode](https://github.com/rodriguesrenato61/pix-mercado-pago-nodejs/blob/main/prints/qrcode.png)

#### 10. Faça o pagamento do pix

![pago](https://github.com/rodriguesrenato61/pix-mercado-pago-nodejs/blob/main/prints/pago.png)

#### 11. Em seguida será redirecionado para página de pagamento confirmado

![pagamento_confirmado](https://github.com/rodriguesrenato61/pix-mercado-pago-nodejs/blob/main/prints/pagamento_confirmado.png)


