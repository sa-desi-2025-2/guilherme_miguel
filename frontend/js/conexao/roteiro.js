
export async function salvarRoteiroBackend(roteiro) {
    try {
        const response = await fetch("http://localhost:8081/roteiros", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(roteiro)
        });

        if (!response.ok) {
            throw new Error("Erro ao salvar roteiro no backend");
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function atualizarRoteiroBackend(roteiroId, roteiro) {
    try {
        const response = await fetch(`http://localhost:8081/roteiros/${roteiroId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(roteiro)
        });
        if (!response.ok) {
            throw new Error("Erro ao atualizar roteiro no backend");
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function buscarRoteirosPorUsuario(usuarioId) {
    try {
        const response = await fetch(`http://localhost:8081/roteiros/usuario/${usuarioId}`);
        if (!response.ok) {
            throw new Error("Erro ao buscar roteiros do usuário");
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function buscarRoteiroPorId(roteiroId) {
    try {
        const response = await fetch(`http://localhost:8081/roteiros/${roteiroId}`);
        if (!response.ok) {
            throw new Error("Erro ao buscar roteiro por ID");
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function deletarRoteiroPorId(roteiroId) {
    try {
        const response = await fetch(`http://localhost:8081/roteiros/${roteiroId}`, {
            method: "DELETE"
        });
        if (!response.ok) {
            throw new Error("Erro ao deletar roteiro por ID");
        }
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

