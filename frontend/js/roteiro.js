document.getElementById('roteiroForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const destino = document.getElementById('destino').value;
    const inicio = document.getElementById('inicio').value;
    const fim = document.getElementById('fim').value;
    const hobbies = document.getElementById('hobbies').value;
    const gastronomia = document.getElementById('gastronomia').value;
    const orcamento = document.getElementById('orcamento').value;
    const tipo = document.getElementById('tipo').value;

    alert(`Roteiro gerado para ${destino}!\nDe ${inicio} até ${fim}\nHobbies: ${hobbies}\nGastronomia: ${gastronomia}\nOrçamento: R$${orcamento}\nTipo: ${tipo}`);
});
``
