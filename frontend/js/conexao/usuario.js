export async function buscarUsuarioPorEmail(email) {
    try {
        const response = await fetch(`http://localhost:8081/usuarios/email/${email}`);

        if (!response.ok) return null;

        return await response.json();
    } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        return null;
    }
}

export async function salvarUsuarioBackend(usuario) {
    try {
        const response = await fetch("http://localhost:8081/usuarios", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(usuario)
        });
        if (!response.ok) {
            throw new Error("Erro ao salvar usuário no backend");
        }
        return await response.json();
    }
    catch (error) {
        console.error(error);
        return null;
    }
}

export async function atualizarUsuarioBackend(usuarioId, usuario) {
    try {
        const response = await fetch(`http://localhost:8081/usuarios/${usuarioId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(usuario)
        });
        if (!response.ok) {
            throw new Error("Erro ao atualizar usuário no backend");
        }  
        return await response.json();
    }
    catch (error) {
        console.error(error);
        return null;
    }
}

export async function buscarUsuarios() {
    try {
        const response = await fetch("http://localhost:8081/usuarios");
        if (!response.ok) {
            throw new Error("Erro ao buscar usuários");
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }    
}

export async function buscarUsuarioPorId(usuarioId) {
    try {
        const response = await fetch(`http://localhost:8081/usuarios/${usuarioId}`);
        if (!response.ok) { 
            throw new Error("Erro ao buscar usuário por ID");
        }
        return await response.json();
    }
    catch (error) {
        console.error(error);
        return null;
    }
}


