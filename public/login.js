// Alteração aqui: removendo o localhost e deixando apenas o endpoint
const LOGIN_URL = "/login";

// Função para login
async function login() {
  const email = document.getElementById("loginEmail").value;
  const senha = document.getElementById("loginSenha").value;

  if (!email || !senha) {
    document.getElementById("errorMessage").textContent = "Por favor, preencha email e senha.";
    return;
  }

  try {
    console.log("Tentando login no Railway...");
    const response = await fetch(LOGIN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha })
    });

    if (response.ok) {
      const data = await response.json();
      // Armazena o token JWT recebido do servidor
      localStorage.setItem("token", data.token);
      window.location.href = "index.html";
    } else {
      const errorData = await response.json();
      document.getElementById("errorMessage").textContent = errorData.error || "Erro ao fazer login.";
    }
  } catch (error) {
    console.error("Erro na requisição:", error);
    document.getElementById("errorMessage").textContent = "Erro de conexão com o servidor.";
  }
}

function goToCadastro() {
  window.location.href = "cadastro.html";
}