// Defina a URL da API (substitua pela sua URL real)
const URL = "http://localhost:3001/usuarios"; // Ex.: "http://localhost:3000/usuarios"
const LOGIN_URL = "http://localhost:3001/login"; // Ex.: "http://localhost:3000/login"

// Função para verificar se o usuário está logado
function isLoggedIn() {
  return localStorage.getItem("token") !== null;
}

// Função para redirecionar se não estiver logado
function checkAuth() {
  if (!isLoggedIn()) {
    window.location.href = "login.html";
  }
}

// Chama checkAuth ao carregar a página
window.onload = function () {
  checkAuth();
};


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

    document.getElementById("successMessage").innerText = "Usuário cadastrado com sucesso!"
  } catch (err) {
    console.error("Erro ao cadastrar:", err);
    document.getElementById("errorMessage").innerText = "Falha ao cadastrar. Veja o console.";
  }
}

async function edit() {
  if (!isLoggedIn()) {
    alert("Você precisa estar logado!");
    return;
  }

  const id = document.getElementById("editPos").value;
  const name = document.getElementById("editUsuario").value;
  const email = document.getElementById("editEmail").value;
  const senha = document.getElementById("editSenha").value;

  if (!id || (!name && !email && !senha)) {
    alert("Por favor, preencha o ID e pelo menos um campo para editar.");
    return;
  }

  try {
    console.log("Tentando editar usuário ID:", id, { name, email, senha });
    const response = await fetch(`${URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, senha })
    });
    console.log("Resposta da API:", response.status, response.statusText);
    if (!response.ok) throw new Error(`Erro ${response.status}: ${response.statusText}`);
    alert("Usuário editado com sucesso!");
  } catch (error) {
    console.error("Erro ao editar:", error);
    alert("Erro ao editar usuário: " + error.message);
  }

  document.getElementById("editPos").value = "";
  document.getElementById("editUsuario").value = "";
  document.getElementById("editEmail").value = "";
  document.getElementById("editSenha").value = "";
  show();
}

// Função assíncrona para deletar um usuário
async function delItem() {
  if (!isLoggedIn()) {
    alert("Você precisa estar logado!");
    return;
  }

  const id = document.getElementById("delPos").value;

  if (!id) {
    alert("Por favor, preencha o ID do usuário a ser deletado.");
    return;
  }

  try {
    console.log("Tentando deletar usuário ID:", id);
    const response = await fetch(`${URL}/${id}`, { method: "DELETE" });
    console.log("Resposta da API:", response.status, response.statusText);
    if (!response.ok) throw new Error(`Erro ${response.status}: ${response.statusText}`);
    alert("Usuário deletado com sucesso!");
  } catch (error) {
    console.error("Erro ao deletar:", error);
    alert("Erro ao deletar usuário: " + error.message);
  }

  document.getElementById("delPos").value = "";
  show();
}

// Função assíncrona para visualizar usuários
async function show() {
  if (!isLoggedIn()) return;

  try {
    console.log("Tentando carregar usuários");
    const response = await fetch(URL);
    console.log("Resposta da API:", response.status, response.statusText);
    if (!response.ok) throw new Error(`Erro ${response.status}: ${response.statusText}`);
    const usuarios = await response.json();

    let lista = "Lista de Usuários:\n\n";
    usuarios.forEach(usuario => {
      lista += `ID: ${usuario.id} | Nome: ${usuario.nome} | Email: ${usuario.email}\n\n`;
    });

    document.getElementById("lista").textContent = lista;
  } catch (error) {
    console.error("Erro ao carregar usuários:", error);
    alert("Erro ao carregar usuários: " + error.message);
  }
}

// Função para ir ao login
function goToLogin() {
  window.location.href = "login.html";
}

// Função para logout
function logout() {
  localStorage.removeItem("token");
  alert("Logout realizado!");
  window.location.href = "login.html";
}