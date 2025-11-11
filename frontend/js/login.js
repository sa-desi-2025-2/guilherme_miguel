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

// ===============================
// LOGIN NORMAL (via backend local)
// ===============================
document.getElementById("login").addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  mensagem.innerText = "Verificando...";

  try {
    const response = await fetch(`${API_URL}/usuarios/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });

    if (response.ok) {
      const data = await response.json();
      mensagem.classList.remove("text-danger");
      mensagem.classList.add("text-success");
      mensagem.innerText = `Bem-vindo, ${data.nome}!`;
      // Redirecionar após login se quiser:
      // window.location.href = "../pages/home.html";
    } else {
      mensagem.classList.remove("text-success");
      mensagem.classList.add("text-danger");
      mensagem.innerText = "Usuário ou senha incorretos.";
    }
  } catch (error) {
    console.error("Erro na requisição:", error);
    mensagem.classList.remove("text-success");
    mensagem.classList.add("text-danger");
    mensagem.innerText = "Erro ao conectar com o servidor.";
  }
});

// ===============================
// CADASTRO NORMAL (via backend local)
// ===============================
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
    const response = await fetch(`${API_URL}/usuarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, senhaHash: senha }),
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

// ===============================
// LOGIN SOCIAL (via Auth0)
// ===============================
(async function iniciarAuth0() {
  const API_DOMAIN = "dev-qkd234rcx7cfybfs.us.auth0.com";
  const CLIENT_ID = "GwZrceMoqNue4YSR5oVihfMgXqLwrEhw";
  const REDIRECT_URI = "http://127.0.0.1:5500/frontend/pages/login-page.html";

  // Espera carregar a biblioteca do Auth0
  if (!window.auth0 || !window.auth0.createAuth0Client) {
    console.error("Auth0 não carregado corretamente.");
    return;
  }

  const auth0 = await window.auth0.createAuth0Client({
    domain: API_DOMAIN,
    clientId: CLIENT_ID,
    authorizationParams: { redirect_uri: REDIRECT_URI },
  });

  // Botões de login social
  document.getElementById("login-google").addEventListener("click", async () => {
    await auth0.loginWithRedirect({
      authorizationParams: { connection: "google-oauth2" },
    });
  });

  document.getElementById("login-github").addEventListener("click", async () => {
    await auth0.loginWithRedirect({
      authorizationParams: { connection: "github" },
    });
  });

  document.getElementById("login-microsoft").addEventListener("click", async () => {
    await auth0.loginWithRedirect({
      authorizationParams: { connection: "windowslive" },
    });
  });

  // Verifica retorno de autenticação social
  window.addEventListener("load", async () => {
    try {
      const query = window.location.search;
      if (query.includes("code=") && query.includes("state=")) {
        await auth0.handleRedirectCallback();
        window.history.replaceState({}, document.title, REDIRECT_URI);
      }

      const isAuthenticated = await auth0.isAuthenticated();
      if (isAuthenticated) {
        const user = await auth0.getUser();
        mensagem.classList.remove("text-danger");
        mensagem.classList.add("text-success");
        mensagem.innerText = `Bem-vindo, ${user.name || user.email}!`;
      }
    } catch (err) {
      console.error("Erro Auth0:", err);
      mensagem.classList.remove("text-success");
      mensagem.classList.add("text-danger");
      mensagem.innerText = "Erro ao autenticar com Auth0.";
    }
  });
})();
