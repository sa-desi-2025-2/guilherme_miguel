// roteiropag.js

// Garante compatibilidade com diferentes formas de exposição do SDK
const createAuth0ClientFn = window.createAuth0Client || (window.auth0 && window.auth0.createAuth0Client);

async function iniciarAuth0Dashboard() {
  if (!createAuth0ClientFn) {
    console.error("Auth0 SDK não carregado. Verifique se o <script> do Auth0 está no HTML antes deste arquivo.");
    return;
  }

  // CONFIGURE AQUI com seu domínio e clientId (mesmos do login-page)
  const API_DOMAIN = "dev-qkd234rcx7cfybfs.us.auth0.com";
  const CLIENT_ID = "GwZrceMoqNue4YSR5oVihfMgXqLwrEhw";
  const REDIRECT_URI = "http://127.0.0.1:5500/frontend/pages/login-page.html"; // apenas para referência

  // cria o client e expõe globalmente para facilitar uso em outros scripts
  window.auth0Client = await createAuth0ClientFn({
    domain: API_DOMAIN,
    clientId: CLIENT_ID,
    authorizationParams: {
      redirect_uri: REDIRECT_URI
    }
  });

  // Opcional: mostra no console se está autenticado
  try {
    const isAuth = await window.auth0Client.isAuthenticated();
    console.log("Auth0 client inicializado. isAuthenticated:", isAuth);
    if (isAuth) {
      const user = await window.auth0Client.getUser();
      // Mostra email no header (se o elemento existir)
      const emailSpan = document.querySelector('.user-email');
      if (emailSpan) emailSpan.textContent = user.email || user.name || '';
    }
  } catch (err) {
    console.error("Erro ao verificar auth0.isAuthenticated():", err);
  }

  // Adiciona o handler de logout
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      try {
        await window.auth0Client.logout({
          logoutParams: {
            // A URL abaixo deve estar em Allowed Logout URLs no painel Auth0
            returnTo: "http://127.0.0.1:5500/frontend/pages/login-page.html",
            // federated: true // opcional: comente se não quiser terminar sessão no provedor externo
          }
        });
      } catch (e) {
        console.error("Erro no logout:", e);
        alert("Erro ao efetuar logout. Veja o console para detalhes.");
      }
    });
  } else {
    console.warn("Botão #logout-btn não encontrado no DOM.");
  }
}

// Executa
iniciarAuth0Dashboard();

// --- resto do código da página (botões, etc) ---
document.querySelector('.btn-primary').addEventListener('click', () => {
    alert('Função para gerar roteiro personalizado será implementada aqui!');
});

document.querySelector('.btn-delete').addEventListener('click', () => {
    const confirmDelete = confirm('Deseja excluir este roteiro?');
    if (confirmDelete) {
        const card = document.querySelector('.card.p-3'); // ajuste conforme sua estrutura
        if (card) card.remove();
    }
});
