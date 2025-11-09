// Botão Excluir
document.querySelector('.btn-danger').addEventListener('click', () => {
  const confirmDelete = confirm('Deseja excluir este roteiro?');
  if (confirmDelete) alert('Roteiro excluído com sucesso!');
});

// Todos os outros botões (exceto o de excluir)
document.querySelectorAll('.btn:not(.btn-danger)').forEach(btn => {
  btn.addEventListener('click', () => {
    alert('Função em desenvolvimento!');
  });
});

