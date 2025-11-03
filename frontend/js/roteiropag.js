
document.querySelector('.btn-primary').addEventListener('click', () => {
    alert('Função para gerar roteiro personalizado será implementada aqui!');
});

document.querySelector('.btn-delete').addEventListener('click', () => {
    const confirmDelete = confirm('Deseja excluir este roteiro?');
    if (confirmDelete) {
        document.querySelector('.roteiro-card').remove();
    }
});
