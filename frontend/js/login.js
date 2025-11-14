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

//------------------------------------- Função de Hash -------------------------------------
async function gerarHash(senha) {
  const encoder = new TextEncoder();
  const data = encoder.encode(senha);
  const hashBuffer = await crypto.subtle.digest("SHA-512", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}

//------------------------------------- Login NORMAL -------------------------------------

document.getElementById("login").addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();

  mensagem.innerText = "Verificando...";

  try {
    const response = await fetch(`${API_URL}/usuarios`);
    if (!response.ok) throw new Error("Erro ao buscar usuários.");

    const usuarios = await response.json();
    const usuario = usuarios.find((u) => u.email === email);

    if (!usuario) {
      mensagem.classList.remove("text-success");
      mensagem.classList.add("text-danger");
      mensagem.innerText = "Usuário não encontrado.";
      return;
    }

    const hashDigitado = await gerarHash(senha);

    if (hashDigitado === usuario.senhaHash) {
      mensagem.classList.remove("text-danger");
      mensagem.classList.add("text-success");
      mensagem.innerText = `Bem-vindo, ${usuario.nome}!`;

      setTimeout(() => {
        window.location.href = "http://127.0.0.1:5500/frontend/pages/roteiro-page.html";
      }, 1000);
    } else {
      mensagem.classList.remove("text-success");
      mensagem.classList.add("text-danger");
      mensagem.innerText = "Senha incorreta.";
      console.log(hashDigitado, "  /  ", usuario.senhaHash);
    }

  } catch (error) {
    console.error("Erro:", error);
    mensagem.classList.remove("text-success");
    mensagem.classList.add("text-danger");
    mensagem.innerText = "Erro ao conectar com o servidor.";
  }
});

//------------------------------------- Cadastro NORMAL -------------------------------------

document.getElementById("signup").addEventListener("submit", async (event) => {
  event.preventDefault();

  const nome = document.getElementById("nome").value;
  const email = document.getElementById("signup-email").value;
  const senha = document.getElementById("signup-password").value;
  const confirmarSenha = document.getElementById("confirm-password").value;

  if (senha !== confirmarSenha) {
    mensagem.classList.remove("text-success");
    mensagem.classList.add("text-danger");
    mensagem.innerText = "As senhas não coincidem.";
    return;
  }

  mensagem.innerText = "Criando usuário...";

  try {
    const senhaHash = await gerarHash(senha);

    const response = await fetch(`${API_URL}/usuarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, senhaHash }),
    });

    if (response.ok) {
      mensagem.classList.remove("text-danger");
      mensagem.classList.add("text-success");
      mensagem.innerText = "Usuário criado com sucesso!";
      document.getElementById("signup").reset();
    } else {
      const errorText = await response.text();
      mensagem.classList.remove("text-success");
      mensagem.classList.add("text-danger");
      mensagem.innerText = `Erro ao criar usuário: ${errorText}`;
    }
  } catch (error) {
    console.error("Erro na requisição:", error);
    mensagem.classList.remove("text-success");
    mensagem.classList.add("text-danger");
    mensagem.innerText = "Erro ao conectar com o servidor.";
  }
});

//------------------------------------- Login SOCIAL (Auth0) -------------------------------------

(async function iniciarAuth0() {
  const API_DOMAIN = "dev-qkd234rcx7cfybfs.us.auth0.com";
  const CLIENT_ID = "GwZrceMoqNue4YSR5oVihfMgXqLwrEhw";
  const REDIRECT_URI = "http://127.0.0.1:5500/frontend/pages/login-page.html";

  if (!window.auth0 || !window.auth0.createAuth0Client) {
    console.error(" Biblioteca Auth0 não carregada.");
    return;
  }

  const auth0 = await window.auth0.createAuth0Client({
    domain: API_DOMAIN,
    clientId: CLIENT_ID,
    authorizationParams: { redirect_uri: REDIRECT_URI },
  });

  document.getElementById("login-google").addEventListener("click", async () => {
    await auth0.loginWithRedirect({
      authorizationParams: { connection: "google-oauth2" },
    });
  });

  document.getElementById("login-github").addEventListener("click", async () => {
    await auth0.loginWithRedirect({
      authorizationParams: { connection: "GitHub" },
    });
  });

  document.getElementById("login-facebook").addEventListener("click", async () => {
    await auth0.loginWithRedirect({
      authorizationParams: { connection: "Facebook" },
    });
  });

  const query = window.location.search;

  if (query.includes("code=") && query.includes("state=")) {
    console.log(" Callback detectado — processando Auth0...");
    try {
      await auth0.handleRedirectCallback();
      console.log(" Callback tratado com sucesso!");
      window.history.replaceState({}, document.title, REDIRECT_URI);
    } catch (err) {
      console.error(" Erro ao tratar callback:", err);
      mensagem.innerText = "Erro no retorno do login.";
      return;
    }
  }

  const isAuthenticated = await auth0.isAuthenticated();
  console.log("👤 isAuthenticated:", isAuthenticated);

  if (isAuthenticated) {
    const user = await auth0.getUser();
    console.log(" Usuário logado:", user);

    mensagem.classList.remove("text-danger");
    mensagem.classList.add("text-success");
    mensagem.innerText = `Bem-vindo, ${user.name || user.email}!`;

    window.location.replace("http://127.0.0.1:5500/frontend/pages/roteiro-page.html");
    return;
  } else {
    console.log("Usuário ainda não autenticado.");
  }
})();
