const tabs = document.querySelectorAll('.tab-btn');
const forms = document.querySelectorAll('.form-custom');
const API_URL = "http://localhost:8081";

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    forms.forEach(f => f.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab).classList.add('active');
  });
});

/* ------------ TOAST FUNCTIONS ------------ */
function showToast(msg, isError = false) {
  const toast = document.getElementById('custom-toast');
  const message = document.getElementById('toast-message');

  message.innerText = msg;

  toast.classList.remove("show", "error");

  if (isError) toast.classList.add("error");

  void toast.offsetWidth;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 4000);
}

function showSuccess(msg) {
  showToast(msg, false);
}

function showError(msg) {
  showToast(msg, true);
}

/* ------------ LOGIN NORMAL ------------ */
document.getElementById("login").addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();

  try {
    const response = await fetch(`${API_URL}/usuarios/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha })
    });

    if (!response.ok) {
      showError("E-mail ou senha incorretos.");
      return;
    }

    const usuario = await response.json();

    const usuarioLogado = {
      nome: usuario.nome || null,
      email: usuario.email || email,
      tipo: "normal"
    };
    localStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));

    showSuccess(`Bem-vindo, ${usuarioLogado.nome || usuarioLogado.email}!`);

    setTimeout(() => {
      window.location.href = "http://127.0.0.1:5500/frontend/pages/roteiro-page.html";
    }, 1500);

  } catch (error) {
    console.error("Erro no login:", error);
    showError("Erro ao conectar com o servidor.");
  }
});

/* ------------ CADASTRO ------------ */
document.getElementById("signup").addEventListener("submit", async (event) => {
  event.preventDefault();

  const nome = document.getElementById("nome").value;
  const email = document.getElementById("signup-email").value;
  const senha = document.getElementById("signup-password").value;
  const confirmar = document.getElementById("confirm-password").value;

  if (senha !== confirmar) {
    showError("As senhas não coincidem.");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/usuarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, senhaHash: senha })
    });

    if (!response.ok) {
      showError("Erro ao criar usuário.");
      return;
    }

    showSuccess("Usuário criado com sucesso!");
    document.getElementById("signup").reset();

  } catch (error) {
    console.error("Erro cadastro:", error);
    showError("Erro ao conectar com o servidor.");
  }
});

/* ------------ LOGIN SOCIAL (AUTH0) ------------ */
(async function iniciarAuth0() {
  const API_DOMAIN = "dev-qkd234rcx7cfybfs.us.auth0.com";
  const CLIENT_ID = "GwZrceMoqNue4YSR5oVihfMgXqLwrEhw";
  const REDIRECT_URI = "http://127.0.0.1:5500/frontend/pages/login-page.html";

  if (!window.auth0?.createAuth0Client) {
    console.error("Auth0 não carregado.");
    return;
  }

  const auth0 = await window.auth0.createAuth0Client({
    domain: API_DOMAIN,
    clientId: CLIENT_ID,
    authorizationParams: { redirect_uri: REDIRECT_URI },
  });

  document.getElementById("login-google").addEventListener("click", async () =>
    auth0.loginWithRedirect({ authorizationParams: { connection: "google-oauth2" } })
  );

  document.getElementById("login-github").addEventListener("click", async () =>
    auth0.loginWithRedirect({ authorizationParams: { connection: "github" } })
  );

  document.getElementById("login-facebook").addEventListener("click", async () =>
    auth0.loginWithRedirect({ authorizationParams: { connection: "facebook" } })
  );

  const query = window.location.search;

  if (query.includes("code=") && query.includes("state=")) {
    try {
      await auth0.handleRedirectCallback();
      window.history.replaceState({}, document.title, REDIRECT_URI);
    } catch (err) {
      console.error("Erro no callback Auth0:", err);
      showError("Erro no retorno do login.");
      return;
    }
  }

  const isAuthenticated = await auth0.isAuthenticated();

  if (isAuthenticated) {
    const user = await auth0.getUser();

    const usuarioLogado = {
      nome: user.name || null,
      email: user.email || null,
      tipo: "auth0"
    };
    localStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));

    showSuccess(`Bem-vindo, ${user.name || user.email}!`);

    setTimeout(() => {
      window.location.replace("http://127.0.0.1:5500/frontend/pages/roteiro-page.html");
    }, 1500);

    return;
  }
})();
