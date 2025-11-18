
function obterUsuarioLocal() {
  try {
    const raw = localStorage.getItem("usuarioLogado");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.warn("Erro ao parsear usuarioLogado:", e);
    return null;
  }
}


document.addEventListener("DOMContentLoaded", () => {
  const usuarioLocal = obterUsuarioLocal();
  const spanUsuario = document.querySelector(".user-email");


  if (spanUsuario && usuarioLocal) {
    spanUsuario.textContent = usuarioLocal.nome || usuarioLocal.email || "Usuário";
  }

  if (!usuarioLocal) {
    window._roteiro_redirect_timeout = setTimeout(() => {
      const afterAuthUser = obterUsuarioLocal();
      if (!afterAuthUser) {
        window.location.href = "../pages/login-page.html";
      }
    }, 700); 
  }
});


const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    localStorage.removeItem("usuarioLogado");

    if (window.auth0Client && typeof window.auth0Client.logout === "function") {
      try {
        await window.auth0Client.logout({
          logoutParams: {
            returnTo: "http://127.0.0.1:5500/frontend/pages/login-page.html"
          }
        });
        return; 
      } catch (e) {
        console.warn("Erro ao fazer logout do Auth0:", e);
      }
    }

    window.location.href = "../pages/login-page.html";
  });
}

const deleteBtn = document.querySelector(".btn-delete");
if (deleteBtn) {
  deleteBtn.addEventListener("click", () => {
    const confirmar = confirm("Deseja excluir este roteiro?");
    if (confirmar) {
      const card = document.querySelector(".card.p-3");
      if (card) card.remove();
    }
  });
}


const createAuth0ClientFn = window.createAuth0Client || (window.auth0 && window.auth0.createAuth0Client);

async function iniciarAuth0Dashboard() {
  if (!createAuth0ClientFn) {
    console.info("Auth0 SDK não disponível.");
    return;
  }

  const API_DOMAIN = "dev-qkd234rcx7cfybfs.us.auth0.com";
  const CLIENT_ID = "GwZrceMoqNue4YSR5oVihfMgXqLwrEhw";
  const REDIRECT_URI = "http://127.0.0.1:5500/frontend/pages/login-page.html";

  try {
    window.auth0Client = await createAuth0ClientFn({
      domain: API_DOMAIN,
      clientId: CLIENT_ID,
      authorizationParams: {
        redirect_uri: REDIRECT_URI
      }
    });
  } catch (e) {
    console.error("Falha ao criar auth0 client:", e);
    return;
  }

  try {
    const isAuth = await window.auth0Client.isAuthenticated();
    if (isAuth) {
      const user = await window.auth0Client.getUser();
      const usuarioLogado = {
        nome: user.name || null,
        email: user.email || null,
        tipo: "auth0"
      };
      localStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));

      if (window._roteiro_redirect_timeout) {
        clearTimeout(window._roteiro_redirect_timeout);
        window._roteiro_redirect_timeout = null;
      }

      const spanUsuario = document.querySelector(".user-email");
      if (spanUsuario) spanUsuario.textContent = usuarioLogado.nome || usuarioLogado.email || "Usuário";
    } else {

      console.log("Auth0: não autenticado");
    }
  } catch (err) {
    console.error("Erro ao verificar sessão Auth0:", err);
  }
}

iniciarAuth0Dashboard();
