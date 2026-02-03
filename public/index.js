// --- CONFIGURAÇÃO DE URL ---
// Usando caminhos relativos para que funcione tanto local quanto no Railway
const URL = "/usuarios";
const LOGIN_URL = "/login";

// Função para obter o token do LocalStorage
function getToken() {
  return localStorage.getItem("token");
}

// Função para verificar se o usuário está logado
function isLoggedIn() {
  return getToken() !== null;
}

// Função para redirecionar se não estiver logado
function checkAuth() {
  if (!isLoggedIn()) {
    window.location.href = "login.html";
  }
}

// Chama checkAuth ao carregar a página e mostra a lista
window.onload = function () {
  checkAuth();
  if (isLoggedIn()) show();
};

// --- FUNÇÕES DE API ---

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

    document.getElementById("successMessage").innerText = "Usuário cadastrado com sucesso!";
    show(); // Atualiza a lista
  } catch (err) {
    console.error("Erro ao cadastrar:", err);
    document.getElementById("errorMessage").innerText = "Falha ao cadastrar.";
  }
}

async function edit() {
  const id = document.getElementById("editPos").value;
  const name = document.getElementById("editUsuario").value; // Alterado para 'name' para bater com o server.js
  const email = document.getElementById("editEmail").value;
  const senha = document.getElementById("editSenha").value;

  if (!id) {
    alert("Por favor, preencha o ID.");
    return;
  }

  try {
    const response = await fetch(`${URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}` // Envia o token de segurança
      },
      body: JSON.stringify({ name, email, senha }) // Enviando 'name' como o server.js espera
    });

    if (!response.ok) throw new Error(`Erro ${response.status}`);
    alert("Usuário editado com sucesso!");
    show();
  } catch (error) {
    alert("Erro ao editar usuário: " + error.message);
  }
}

async function delItem() {
  const id = document.getElementById("delPos").value;

  if (!id) {
    alert("Por favor, preencha o ID.");
    return;
  }

  if (!confirm("Tem certeza que deseja deletar este usuário?")) return;

  try {
    const response = await fetch(`${URL}/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${getToken()}`
      }
    });

    if (!response.ok) throw new Error(`Erro ${response.status}`);
    alert("Usuário deletado com sucesso!");
    show();
  } catch (error) {
    alert("Erro ao deletar: " + error.message);
  }
}

async function show() {
  try {
    const response = await fetch(URL, {
      headers: {
        "Authorization": `Bearer ${getToken()}`
      }
    });

    if (!response.ok) throw new Error("Falha ao carregar lista.");
    const usuarios = await response.json();

    let lista = "Lista de Usuários:\n\n";
    usuarios.forEach(usuario => {
      lista += `ID: ${usuario.id} | Nome: ${usuario.nome} | Email: ${usuario.email}\n`;
    });

    document.getElementById("lista").textContent = lista;
  } catch (error) {
    console.error(error);
  }
}

// --- NAVEGAÇÃO ---

function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}