function openModalSpinner(){
	const modalFundo = document.querySelector('#modalfundo');
    const spinner = document.querySelector('.spinner');
    modalFundo.style.display = 'block';
    spinner.classList.add('active-spinner');
}

function closeModalSpinner(){
	const modalFundo = document.querySelector('#modalfundo');
    const spinner = document.querySelector('.spinner');
    modalFundo.style.display = 'none';
    spinner.classList.remove('active-spinner');
}

function closeModalSpinnerAnimation(){
    const spinner = document.querySelector('.spinner');
    spinner.classList.remove('active-spinner');
}