
document.querySelector('.btn-primary').addEventListener('click', () => {
    alert('Função para consultar roteiro será implementada aqui!');
});

document.querySelector('.btn-secondary').addEventListener('click', () => {
    window.scrollTo({
        top: document.querySelector('.como-funciona').offsetTop,
        behavior: 'smooth'
    });
});
