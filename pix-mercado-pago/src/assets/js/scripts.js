let idEscolhido = null;
const items = document.querySelectorAll('.item-box');
const modalFundo = document.querySelector('#modalfundo');
const btnCloseModalForm = document.querySelector('#modalpixclose');
const formGeraPix = document.querySelector('#form-gera-pix');
const btnCopiar = document.querySelector('#btn-copiar');

let paymentId = null;
let externalReference = null;
let monitora = null;
let tempo = 0;
let expiracao = parseInt(document.querySelector('#pix-expiracao').value);
let pixPago = false;

inicializa();

function inicializa(){
    if(items != null){
        items.forEach((item) => {
            item.addEventListener('click', () => {
                idEscolhido = item.getAttribute('data-id');
                openModalForm();
            });
        });
    }
}

btnCloseModalForm.addEventListener('click', (e) => {
    e.preventDefault();
    closeModalForm();
});

formGeraPix.addEventListener('submit', (e) => {
    e.preventDefault();
    gerarItemPix();
});

btnCopiar.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('#copia-cola').select();
    document.execCommand('copy');
    alert("Copiado para área de transferência");
});

function openModalForm(){
    const modalContent = document.querySelector('#modalpixcontent');
    modalFundo.style.display = 'block';
    modalContent.classList.add('active');
}

function closeModalForm(){
    const modalContent = document.querySelector('#modalpixcontent');
    modalFundo.style.display = 'none';
    modalContent.classList.remove('active');
}

function openModal(){
    const modalContent = document.querySelector('#modalcontent');
    modalFundo.style.display = 'block';
    modalContent.classList.add('active');
}

function closeModal(){
    const modalContent = document.querySelector('#modalcontent');
    modalFundo.style.display = 'none';
    modalContent.classList.remove('active');
}

function gerarItemPix(){

    closeModalForm();
    openModalSpinner();

    const email = document.querySelector('#email').value;

    fetch('/comprar/'+idEscolhido+'/'+email)
    .then((response) => {
        return response.json();
    }).then((response) => {
        console.log(response);
        if(response.success){
            closeModalSpinnerAnimation();
            const pix = response.dados;
			paymentId = pix.payment_id;
            externalReference = pix.external_reference;

            let html = "<div id='img-qrcode'><img src='data:image/png;base64, "+pix.qr_code_img+"' /></div>";
			html += "<div class='pix-qrcode'><strong>Código copia e cola: </strong></div>";

            const modalBody = document.querySelector('#modalbody');
            const modalBottom = document.querySelector('#modalbottom');
            const copiaCola = document.querySelector('#copia-cola');
            modalBody.innerHTML = html;
            copiaCola.value = pix.qr_code
            modalBottom.style.display = 'block';

            openModal();
            monitoraPix();

        }else{
            let msg = response.msg;
            if(response.erro){
                msg = msg+": "+response.erro;
            }
            alert(msg);
            closeModalSpinner();
            openModalForm();
        }
    }).catch((error) => {
        closeModalSpinner();
        openModalForm();
        alert("Erro ao gerar o pix!");
    });
}

function monitoraPix(){
	
	monitora = setInterval(() => {
		
		fetch("/transacao/"+paymentId)
		.then((response) => {
			return response.json();
		}).then((response) => {
			console.clear();
			console.log(response);
			if(response.success){
                if(response.dados.payment_status == "approved"){
                    clearInterval(monitora);
				    pago();
                }
			}else{
				tempo += 5;
			}
			
			if(tempo >= expiracao){
				clearInterval(monitora);
				console.log("Pix expirou!");
				//pago();
			}
			
		}).catch((error) => {
			tempo += 5;
			console.log(error);
		});
		
	} , 5000);
}

function pago(){
	
	closeModal();
	
	let html = "<div class='pix-pago'><img src='img/check_circle_green.svg' /></div>";
	html += "<h4 class='pix-pago-text'>Pago</h4>";

    const modalPixBody = document.querySelector('#modalbody');
    const modalPixBottom = document.querySelector('#modalbottom');
   
    modalPixBody.innerHTML = html;
    modalPixBottom.style.display = 'none';
    
    openModal();
    
    pixPago = true;
    
    setTimeout(() => {
		window.location.href = "/pagamento/"+externalReference;
	}, 3000);
}


