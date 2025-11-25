document.querySelector('.btn-secondary').addEventListener('click', () => {
    window.scrollTo({
        top: document.querySelector('.como-funciona').offsetTop,
        behavior: 'smooth'
    });
});
