
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


async function carregarRoteirosUsuario() {
    const usuario = obterUsuarioLocal();
    if (!usuario || !usuario.email) {
        console.warn("Nenhum usuário logado");
        return;
    }

    const lista = document.getElementById("lista-roteiros");
    if (!lista) return;

    try {
        const res = await fetch("http://localhost:8081/roteiros");
        const roteiros = await res.json();

        const meusRoteiros = roteiros.filter(r =>
            r.usuario && r.usuario.email === usuario.email
        );

        lista.innerHTML = "";

        if (meusRoteiros.length === 0) {
            lista.innerHTML = `
                <p class="text-muted">Você ainda não criou nenhum roteiro.</p>
            `;
            return;
        }

        meusRoteiros.forEach(r => {
            const card = document.createElement("div");
            card.className = "card p-3 mb-3 shadow-sm";

            card.innerHTML = `
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <h4 class="h6 fw-semibold mb-0 me-3 text-wrap" style="max-width: 80%;">
                        ${r.destino}
                    </h4>
                    <span class="price">R$ ${r.custoTotal || 0}</span>
                </div>

                <div class="trip-info text-muted small mb-3">
                    <p class="mb-1"><i class="bi bi-pin-map me-1"></i> ${r.pais}</p>
                    <p class="mb-0">
                        <i class="bi bi-calendar me-1"></i> 
                        ${new Date(r.dataInicio).toLocaleDateString("pt-BR")}
                        até
                        ${new Date(r.dataFim).toLocaleDateString("pt-BR")}
                    </p>
                </div>
                
                <div class="trip-actions d-flex justify-content-between align-items-center">
                    <button class="btn btn-sm btn-primary btn-primary-custom fw-medium ver-roteiro" data-id="${r.id}">
                        <i class="bi bi-eye-fill me-1"></i> Ver Roteiro
                    </button>
                    <button class="btn-delete" data-id="${r.id}">
                        <i class="bi bi-trash-fill"></i>
                    </button>
                </div>
            `;

            lista.appendChild(card);
        });

        document.querySelectorAll(".ver-roteiro").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.getAttribute("data-id");
                window.location.href = `../pages/mapa-page.html?id=${id}`;
            });
        });

        document.querySelectorAll(".btn-delete").forEach(btn => {
            btn.addEventListener("click", async () => {
                const id = btn.getAttribute("data-id");
                const confirmar = confirm("Deseja excluir este roteiro?");
                if (!confirmar) return;

                await fetch(`http://localhost:8081/roteiros/${id}`, {
                    method: "DELETE"
                });

                btn.closest(".card").remove();
            });
        });

    } catch (e) {
        console.error("Erro ao carregar roteiros:", e);
        lista.innerHTML = `<p class="text-danger">Erro ao carregar roteiros.</p>`;
    }
}

document.addEventListener("DOMContentLoaded", carregarRoteirosUsuario);
