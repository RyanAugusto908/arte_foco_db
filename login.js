// Defina a URL da API de login
const LOGIN_URL = "http://localhost:3001/login"; // Ex.: "http://localhost:3000/login"

// Função para login
async function login() {
  const email = document.getElementById("loginEmail").value;
  const senha = document.getElementById("loginSenha").value;
  
  if (!email || !senha) {
    document.getElementById("errorMessage").textContent = "Por favor, preencha email e senha.";
    return;
  }
  
  try {
    console.log("Tentando login com:", { email, senha }); // Log para depuração
    const response = await fetch(LOGIN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha })
    });
    console.log("Resposta da API:", response.status, response.statusText); // Log da resposta
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("token", data.token || "logged_in");
      window.location.href = "index.html";
    } else {
      document.getElementById("errorMessage").textContent = "Email ou senha incorretos.";
    }
  } catch (error) {
    console.error("Erro ao fazer login:", error); // Log do erro
    document.getElementById("errorMessage").textContent = "Erro ao fazer login: " + error.message;
  }
}

// Função para ir ao cadastro
function goToCadastro() {
  window.location.href = "cadastro.html";
}