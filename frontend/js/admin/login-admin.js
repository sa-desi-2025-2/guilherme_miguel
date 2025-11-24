const tabs = document.querySelectorAll('.tab-btn');
const forms = document.querySelectorAll('.form-custom');
// Altere esta URL se o seu backend Admin for diferente
const API_URL = "http://localhost:8081"; 

/* ------------ FUNÇÕES DE TOAST (REUTILIZADAS) ------------ */
function showToast(msg, isError = false) {
    const toast = document.getElementById('custom-toast');
    const message = document.getElementById('toast-message');

    message.innerText = msg;
    toast.classList.remove("show", "error");
    if (isError) toast.classList.add("error");
    void toast.offsetWidth; // Trigger reflow
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

/* ------------ LÓGICA DE ABAS (REUTILIZADA) ------------ */
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        forms.forEach(f => f.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(tab.dataset.tab).classList.add('active');
    });
});

/* ------------ LOGIN ADMIN ------------ */
document.getElementById("login-admin").addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("admin-email").value.trim();
    const senha = document.getElementById("admin-senha").value.trim();

    try {
        // MUDANÇA PRINCIPAL: Endpoint para admins/login
        const response = await fetch(`${API_URL}/admins/login`, { 
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, senha })
        });

        if (!response.ok) {
            showError("Credenciais de Admin incorretas.");
            return;
        }

        const admin = await response.json();

        // Armazenamento local com tipo 'admin'
        const usuarioLogado = {
            nome: admin.nome || "Admin",
            email: admin.email || email,
            tipo: "admin" // Indica que é um administrador
        };
        localStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));

        showSuccess(`Bem-vindo, Administrador(a) ${usuarioLogado.nome}!`);

        // Redirecionamento para a área de Admin
        setTimeout(() => {
            window.location.href = "../admin/admin-dashboard.html"; // Mudar para o dashboard de Admin
        }, 1500);

    } catch (error) {
        console.error("Erro no login Admin:", error);
        showError("Erro ao conectar com o servidor.");
    }
});

/* ------------ CADASTRO ADMIN ------------ */
document.getElementById("signup-admin").addEventListener("submit", async (event) => {
    event.preventDefault();

    const nome = document.getElementById("admin-nome").value;
    const email = document.getElementById("signup-admin-email").value;
    const senha = document.getElementById("signup-admin-password").value;
    const confirmar = document.getElementById("confirm-admin-password").value;

    if (senha !== confirmar) {
        showError("As senhas não coincidem.");
        return;
    }

    try {
        // MUDANÇA PRINCIPAL: Endpoint para /admins
        const response = await fetch(`${API_URL}/admins`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            // Assumindo que o backend de Admin espera "senhaHash" como senha
            body: JSON.stringify({ nome, email, senhaHash: senha }) 
        });

        if (!response.ok) {
            showError("Erro ao criar usuário Admin. Verifique se o e-mail já está em uso.");
            return;
        }

        showSuccess("Conta Admin criada com sucesso!");
        document.getElementById("signup-admin").reset();

        // Opcional: Alternar para a aba de Login após o cadastro bem-sucedido
        document.querySelector('.tab-btn[data-tab="login-admin"]').click(); 

    } catch (error) {
        console.error("Erro cadastro Admin:", error);
        showError("Erro ao conectar com o servidor.");
    }
});

// A lógica de LOGIN SOCIAL (AUTH0) foi REMOVIDA, pois geralmente não é usada para contas de administração internas.