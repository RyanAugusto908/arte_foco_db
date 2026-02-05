const URL = "http://localhost:3001/usuarios";

async function cadastrar() {
    const nome = document.getElementById("addUsuario").value;
    const email = document.getElementById("addEmail").value;
    const senha = document.getElementById("addSenha").value;
    
    if (!nome || !email || !senha) {
        document.getElementById("errorMessage").innerText = "Preencha todos os campos!";
        return;
    }
    
    try {
        const res = await fetch(URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, email, senha })
        });
        if (!res.ok) throw new Error(`Erro: ${res.status}`);
        
        document.getElementById("successMessage").innerText = "Usuário cadastrado com sucesso! Redirecionando...";
        setTimeout(() => window.location.href = "login.html", 2000);  // Redireciona após 2 segundos
    } catch (err) {
        console.error("Erro ao cadastrar:", err);
        document.getElementById("errorMessage").innerText = "Falha ao cadastrar. Veja o console.";
    }
}

function goToLogin() {
    window.location.href = "login.html";
}