// --- Alternância entre abas ---
const tabs = document.querySelectorAll('.tab-btn');
const forms = document.querySelectorAll('.form-custom');
const mensagem = document.getElementById("mensagem");
// ajuste a URL conforme seu backend está rodando (8080 ou 8081)
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
  mensagem.classList.remove("text-success", "text-danger");

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

    // SALVA UM OBJETO ÚNICO usuarioLogado no localStorage
    const usuarioLogado = {
      nome: usuario.nome || null,
      email: usuario.email || email,
      tipo: "normal"
    };
    localStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));

    mensagem.classList.remove("text-danger");
    mensagem.classList.add("text-success");
    mensagem.innerText = `Bem-vindo, ${usuarioLogado.nome || usuarioLogado.email}!`;

    // aguarda 600ms pra garantir escrita e melhor UX
    setTimeout(() => {
      window.location.href = "http://127.0.0.1:5500/frontend/pages/roteiro-page.html";
    }, 600);

  } catch (error) {
    console.error("Erro no fetch de login:", error);
    mensagem.classList.add("text-danger");
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
  mensagem.classList.remove("text-success", "text-danger");

  try {
    const response = await fetch(`${API_URL}/usuarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // enviamos senha "crua" e backend irá hashear
      body: JSON.stringify({ nome, email, senhaHash: senha })
    });

    if (!response.ok) {
      const txt = await response.text().catch(()=>"Erro ao criar usuário.");
      mensagem.classList.add("text-danger");
      mensagem.innerText = `Erro ao criar usuário: ${txt}`;
      return;
    }

    mensagem.classList.remove("text-danger");
    mensagem.classList.add("text-success");
    mensagem.innerText = "Usuário criado com sucesso!";
    document.getElementById("signup").reset();

  } catch (error) {
    console.error("Erro no fetch de cadastro:", error);
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

    // --- SALVANDO NO LOCALSTORAGE ---
    const usuarioLogado = {
      nome: user.name || null,
      email: user.email || null,
      tipo: "auth0"
    };
    localStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));
    // --------------------------------

    mensagem.classList.remove("text-danger");
    mensagem.classList.add("text-success");
    mensagem.innerText = `Bem-vindo, ${user.name || user.email}!`;

    window.location.replace("http://127.0.0.1:5500/frontend/pages/roteiro-page.html");
    return;
}
})();