// --- Alternância entre abas ---
const tabs = document.querySelectorAll('.tab-btn');
const forms = document.querySelectorAll('.form-custom');
const mensagem = document.getElementById("mensagem");
const API_URL = "http://localhost:8081";

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    forms.forEach(f => f.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab).classList.add('active');
  });
});

//------------------------------------- LOGIN NORMAL -------------------------------------

document.getElementById("login").addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();

  mensagem.innerText = "Verificando...";

  try {
    const response = await fetch(`${API_URL}/usuarios/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha })
    });

    if (!response.ok) {
      mensagem.classList.add("text-danger");
      mensagem.innerText = "E-mail ou senha incorretos.";
      return;
    }

    const usuario = await response.json();

    mensagem.classList.remove("text-danger");
    mensagem.classList.add("text-success");
    mensagem.innerText = `Bem-vindo, ${usuario.nome}!`;

    setTimeout(() => {
      window.location.href = "http://127.0.0.1:5500/frontend/pages/roteiro-page.html";
    }, 1000);

  } catch (error) {
    mensagem.innerText = "Erro ao conectar com o servidor.";
  }
});

//------------------------------------- CADASTRO NORMAL -------------------------------------

document.getElementById("signup").addEventListener("submit", async (event) => {
  event.preventDefault();

  const nome = document.getElementById("nome").value;
  const email = document.getElementById("signup-email").value;
  const senha = document.getElementById("signup-password").value;
  const confirmar = document.getElementById("confirm-password").value;

  if (senha !== confirmar) {
    mensagem.classList.add("text-danger");
    mensagem.innerText = "As senhas não coincidem.";
    return;
  }

  mensagem.innerText = "Criando usuário...";

  try {
    const response = await fetch(`${API_URL}/usuarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, senhaHash: senha })
    });

    if (!response.ok) {
      mensagem.classList.add("text-danger");
      mensagem.innerText = "Erro ao criar usuário.";
      return;
    }

    mensagem.classList.remove("text-danger");
    mensagem.classList.add("text-success");
    mensagem.innerText = "Usuário criado com sucesso!";
    document.getElementById("signup").reset();

  } catch (error) {
    mensagem.innerText = "Erro ao conectar com o servidor.";
  }
});
