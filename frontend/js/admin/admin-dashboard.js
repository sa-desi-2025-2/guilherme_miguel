const API_URL = "http://localhost:8081/usuarios";
        const userForm = document.getElementById('userForm');
        const createMsg = document.getElementById('createMsg');
        const userTable = document.getElementById('userTable');

        let editingRow = null;
        let originalRowHTML = '';

        function escapeHtml(s = "") {
            return String(s).replaceAll("&", "&amp;")
                .replaceAll("<", "&lt;")
                .replaceAll(">", "&gt;")
                .replaceAll('"', "&quot;")
                .replaceAll("'", "&#39;");
        }

        async function readResponseBody(res) {
            const ct = res.headers.get('content-type') || '';
            try {
                if (ct.includes('application/json')) {
                    return JSON.stringify(await res.json(), null, 2);
                } else {
                    return await res.text();
                }
            } catch (err) {
                return `<<erro ao ler corpo da resposta: ${err.message}>>`;
            }
        }

        async function loadUsers() {
            userTable.innerHTML = '<tr><td colspan="4" class="text-center">Carregando...</td></tr>';

            try {
                const res = await fetch(API_URL);
                if (!res.ok) {
                    const body = await readResponseBody(res);
                    userTable.innerHTML = `<tr><td colspan="4" class="text-center small">Erro ao listar: ${res.status}</td></tr>`;
                    console.error('GET /usuarios →', body);
                    return;
                }

                const users = await res.json();
                if (!Array.isArray(users) || users.length === 0) {
                    userTable.innerHTML = '<tr><td colspan="4" class="text-center small">Nenhum usuário encontrado</td></tr>';
                    return;
                }

                userTable.innerHTML = '';

                users.forEach(u => {
                    const tr = document.createElement('tr');
                    tr.dataset.userId = u.id;

                    tr.innerHTML = `
                        <td>${escapeHtml(u.id ?? '')}</td>
                        <td data-field="nome">${escapeHtml(u.nome ?? u.name ?? '')}</td>
                        <td data-field="email">${escapeHtml(u.email ?? '')}</td>
                        <td class="d-flex gap-2">
                            <button class="btn btn-success btn-sm" onclick="enableEdit(${u.id})">Editar</button>
                            <button class="btn btn-danger btn-sm" onclick="deleteUser(${u.id})">Excluir</button>
                        </td>
                    `;

                    userTable.appendChild(tr);
                });

            } catch (err) {
                console.error(err);
                userTable.innerHTML = '<tr><td colspan="4" class="text-center small">Erro ao carregar</td></tr>';
            }
        }

        // Criar
        userForm.addEventListener('submit', async (ev) => {
            ev.preventDefault();
            createMsg.textContent = '';

            const nome = document.getElementById('nome').value.trim();
            const email = document.getElementById('email').value.trim();
            const senha = document.getElementById('senha').value;

            if (!nome || !email || senha.length < 6) {
                createMsg.textContent = 'Preencha os dados corretamente.';
                createMsg.classList.add("text-danger");
                return;
            }

            const payload = { nome, email, senhaHash: senha };

            try {
                const res = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const body = await readResponseBody(res);

                if (res.ok) {
                    createMsg.textContent = 'Usuário criado com sucesso!';
                    createMsg.classList.add("text-success");
                    userForm.reset();
                    loadUsers();
                } else {
                    createMsg.textContent = 'Erro: ' + body;
                    createMsg.classList.add("text-danger");
                }

            } catch (err) {
                createMsg.textContent = 'Erro ao conectar.';
                createMsg.classList.add("text-danger");
            }
        });

        // Editar
        window.enableEdit = function (id) {
            if (editingRow) cancelEdit();

            const tr = userTable.querySelector(`[data-user-id="${id}"]`);
            if (!tr) return;

            editingRow = tr;
            originalRowHTML = tr.innerHTML;

            const nome = tr.querySelector('[data-field="nome"]').textContent;
            const email = tr.querySelector('[data-field="email"]').textContent;

            tr.innerHTML = `
                <td>${id}</td>
                <td><input type="text" id="edit-nome-${id}" class="form-control" value="${escapeHtml(nome)}"></td>
                <td><input type="email" id="edit-email-${id}" class="form-control" value="${escapeHtml(email)}"></td>
                <td class="d-flex gap-2">
                    <button class="btn btn-success btn-sm" onclick="editUser(${id})">Salvar</button>
                    <button class="btn btn-secondary btn-sm" onclick="cancelEdit()">Cancelar</button>
                </td>
            `;
        };

        window.cancelEdit = function () {
            if (editingRow) {
                editingRow.innerHTML = originalRowHTML;
                editingRow = null;
            }
        };

        // PUT
        window.editUser = async function (id) {
            const nome = document.getElementById(`edit-nome-${id}`).value.trim();
            const email = document.getElementById(`edit-email-${id}`).value.trim();

            if (!nome || !email) return alert("Preencha corretamente.");

            const payload = { nome, email };

            try {
                const res = await fetch(`${API_URL}/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (res.ok) {
                    loadUsers();
                } else {
                    alert("Erro ao salvar!");
                }

            } catch {
                alert("Falha na conexão");
            }
        };

        // DELETE
        window.deleteUser = async function (id) {
            if (!confirm("Tem certeza?")) return;

            await fetch(`${API_URL}/${id}`, { method: "DELETE" });
            loadUsers();
        };

        loadUsers();