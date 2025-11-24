const API_BASE = "http://localhost:8081";

const params = new URLSearchParams(window.location.search);
const roteiroId = params.get("id");

// Referências
const destino = document.getElementById("destino");
const pais = document.getElementById("pais");
const dataInicio = document.getElementById("dataInicio");
const dataFim = document.getElementById("dataFim");
const custoTotal = document.getElementById("custoTotal");

const listaPOI = document.getElementById("lista-poi");

let pontos = [];
let poiEditando = null;

// Modal
const modalPOI = new bootstrap.Modal(document.getElementById("modalPOI"));

async function carregarDados() {

    // roteiro
    const r = await fetch(`${API_BASE}/roteiros/${roteiroId}`);
    const roteiro = await r.json();

    destino.value = roteiro.destino;
    pais.value = roteiro.pais;
    dataInicio.value = roteiro.dataInicio;
    dataFim.value = roteiro.dataFim;
    custoTotal.value = roteiro.custoTotal;

    // pontos
    const p = await fetch(`${API_BASE}/pontosInteresse?roteiroId=${roteiroId}`);
    pontos = await p.json();

    renderPOI();
}

function renderPOI() {
    listaPOI.innerHTML = pontos.map(p => `
        <div class="poi-item p-2 border rounded mb-2 d-flex justify-content-between align-items-center">
            <div>
                <strong>${p.nome}</strong><br>
                <small>${p.descricao ?? ""}</small>
            </div>

            <div class="d-flex gap-2">
                <button class="btn btn-sm btn-outline-secondary" onclick="editarPOI(${p.id})">
                    <i class="fas fa-edit"></i>
                </button>

                <button class="btn btn-sm btn-outline-danger" onclick="removerPOI(${p.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join("");
}

// Tornar global
window.editarPOI = (id) => {
    poiEditando = pontos.find(p => p.id === id);

    document.getElementById("poiNome").value = poiEditando.nome;
    document.getElementById("poiDescricao").value = poiEditando.descricao;
    document.getElementById("poiLat").value = poiEditando.latitude;
    document.getElementById("poiLng").value = poiEditando.longitude;

    modalPOI.show();
};

window.removerPOI = async (id) => {
    if (!confirm("Deseja excluir este ponto?")) return;

    await fetch(`${API_BASE}/pontosInteresse/${id}`, {
        method: "DELETE"
    });

    pontos = pontos.filter(p => p.id !== id);
    renderPOI();
};


// Novo ponto
document.getElementById("btn-add-poi").addEventListener("click", () => {
    poiEditando = null;

    document.getElementById("poiNome").value = "";
    document.getElementById("poiDescricao").value = "";
    document.getElementById("poiLat").value = "";
    document.getElementById("poiLng").value = "";

    modalPOI.show();
});

// salvar ponto
document.getElementById("btnSalvarPOI").addEventListener("click", async () => {

    const novo = {
        nome: document.getElementById("poiNome").value,
        descricao: document.getElementById("poiDescricao").value,
        latitude: parseFloat(document.getElementById("poiLat").value),
        longitude: parseFloat(document.getElementById("poiLng").value),
        roteiroId: parseInt(roteiroId)
    };

    // editar
    if (poiEditando) {
        novo.id = poiEditando.id;

        await fetch(`${API_BASE}/pontosInteresse/${novo.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(novo)
        });

        const idx = pontos.findIndex(x => x.id === novo.id);
        pontos[idx] = novo;
    }
    // novo
    else {
        const res = await fetch(`${API_BASE}/pontosInteresse`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(novo)
        });

        const salvo = await res.json();
        pontos.push(salvo);
    }

    modalPOI.hide();
    renderPOI();
});

// salvar roteiro inteiro
document.getElementById("btn-salvar").addEventListener("click", async () => {
    const data = {
        destino: destino.value,
        pais: pais.value,
        dataInicio: dataInicio.value,
        dataFim: dataFim.value,
        custoTotal: parseFloat(custoTotal.value)
    };

    await fetch(`${API_BASE}/roteiros/${roteiroId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    alert("Roteiro atualizado com sucesso!");
});

carregarDados();
