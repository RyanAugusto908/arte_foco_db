// Alterado para caminho relativo - assim funciona no seu PC e no Railway sem mexer em nada!
const URL = "/usuarios";

async function cadastrar() {
    const nome = document.getElementById("addUsuario").value;
    const email = document.getElementById("addEmail").value;
    const senha = document.getElementById("addSenha").value;

    // Limpa mensagens anteriores
    document.getElementById("errorMessage").innerText = "";
    document.getElementById("successMessage").innerText = "";

    if (!nome || !email || !senha) {
        document.getElementById("errorMessage").innerText = "Preencha todos os campos!";
        return;
    }

    try {
        console.log("Enviando cadastro para o servidor...");
        const res = await fetch(URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, email, senha })
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || `Erro: ${res.status}`);
        }

        document.getElementById("successMessage").innerText = "Usuário cadastrado com sucesso! Redirecionando...";

        // Redireciona após 2 segundos para o usuário ver a mensagem de sucesso
        setTimeout(() => {
            window.location.href = "login.html";
        }, 2000);

    } catch (err) {
        console.error("Erro ao cadastrar:", err);
        document.getElementById("errorMessage").innerText = "Falha ao cadastrar: " + err.message;
    }
}

function goToLogin() {
    window.location.href = "login.html";
}