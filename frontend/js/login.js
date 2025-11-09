     const tabs = document.querySelectorAll('.tab-btn');
        const forms = document.querySelectorAll('.form-custom');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                forms.forEach(f => f.classList.remove('active'));

                tab.classList.add('active');
                // Adiciona 'active' ao formulário correspondente
                document.getElementById(tab.dataset.tab).classList.add('active');
            });
        });
        

//------------------------------------------------------------------------------
/*
document.getElementById("form").addEventListener("submit", async (event) => {
  event.preventDefault();

  const tabLoginAtiva = document.getElementById("tab-login").classList.contains("active");
  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  const mensagem = document.getElementById("mensagem");

  try {
    if (tabLoginAtiva) {
      // 🔹 LOGIN
      const response = await fetch("http://localhost:8081/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      if (response.ok) {
        const data = await response.json();
        mensagem.innerText = `Bem-vindo, ${data.nome}!`;
      } else {
        mensagem.innerText = "Usuário ou senha incorretos.";
      }
    } else {
      // 🔹 CADASTRO
      const response = await fetch("http://localhost:8081/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          email,
          senhaHash: senha, // precisa coincidir com o campo esperado no backend
        }),
      });

      if (response.ok) {
        mensagem.innerText = "Usuário criado com sucesso!";
      } else {
        const errorText = await response.text();
        mensagem.innerText = `Erro ao criar usuário: ${errorText}`;
      }
    }
  } catch (error) {
    console.error("❌ Erro na requisição:", error);
    mensagem.innerText = "Erro ao conectar com o servidor.";
  }
});
*/