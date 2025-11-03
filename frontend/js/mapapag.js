
// Exemplo simples para interatividade
document.querySelector('.btn-danger').addEventListener('click', () => {
    const confirmDelete = confirm('Deseja excluir este roteiro?');
    if (confirmDelete) {
        alert('Roteiro excluído com sucesso!');
    }
});

document.querySelector('.btn').addEventListener('click', () => {
    alert('Função em desenvolvimento!');
});
``
