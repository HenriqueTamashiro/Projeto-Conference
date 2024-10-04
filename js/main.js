// Listener para o envio do formulário
document.getElementById('userForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Impede o envio padrão do formulário

  const form = document.querySelector('.form');
  const identificador = form.querySelector('.id_input').value;
  const key_valor = form.querySelector('.key_input').value;

  // Cria a URL com parâmetros de consulta
  const url = `/get-user?identificador=${encodeURIComponent(identificador)}&key_valor=${encodeURIComponent(key_valor)}`;
 
  fetch(url, {
    method: 'GET', // Método GET
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Erro ao buscar os dados: ' + response.statusText);
    }
    return response.json();
  })
  .then(async valor => {
    console.log('Dados recebidos:', valor);
    
    // Carrega o HTML adicional
    const responseAcess = await fetch('/pages/responseAcess.html');
    const Acess = await responseAcess.text();
    

    if (valor.length === 0) {
      // Nenhum usuário encontrado
      const resultadoDiv = document.querySelector('.container');
      resultadoDiv.innerHTML = '<p>Nenhum usuário encontrado.</p>';
      return;
    }
    const resultadoDiv = document.getElementById('userForm');
    resultadoDiv.innerHTML = Acess;
    // Preenche os campos com os dados do usuário encontrado
    const nomeResp = document.getElementById('nomeResp');
    const idResp = document.getElementById('idResp');
    const keyResp = document.getElementById('keyResp');
    const acessosResp = document.getElementById('acessosResp');

    nomeResp.value = valor[0].nome;
    idResp.value = valor[0].identificador;
    keyResp.value = valor[0].key_valor;
    acessosResp.value = valor[0].acessos;



  })
  .catch(error => {
    console.error('Erro:', error);
    const resultadoDiv = document.querySelector('.container');
    resultadoDiv.innerHTML = '<p>Erro ao buscar os dados. Tente novamente!</p>';
  });
});

// Listener para carregar o header após o DOM estar pronto
document.addEventListener('DOMContentLoaded', async () => {
  const headerResponse = await fetch('/pages/header.html');
  const headerData = await headerResponse.text();
  document.getElementById('header-placeholder').innerHTML = headerData;

  const token = localStorage.getItem('token');
  const profileMenu = document.getElementById('profileMenu');
  const loginButton = document.getElementById('loginButton');
  const logoutButton = document.getElementById('logoutButton');
  const dashboard = document.getElementById('dashboard');

  if (token) {
    try {
      const response = await fetch('/isLoggedIn', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (response.ok) {
        dashboard.innerText = result.username;
        profileMenu.style.display = 'block';
        loginButton.style.display = 'none';
        logoutButton.style.display = 'block';
      } else {
        throw new Error('Token inválido ou expirado.');
      }

    } catch (error) {
      console.error('Erro:', error);
      alert('Sua sessão expirou. Faça login novamente.');
      localStorage.removeItem('token');
      window.location.replace('/pages/login.html');
    }
  } else {
    profileMenu.style.display = 'none';
    loginButton.style.display = 'block';
    logoutButton.style.display = 'none';
  }

  // Evento de logout
  logoutButton.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = '/pages/login.html';
  });
});

const hoverElement = document.querySelector('.help');
const popup = document.querySelector('.pop');
hoverElement.addEventListener('click', () => {
  // Obtém o modal
  var modal = document.getElementById("myModal");

  // Obtém o botão que fecha o modal
  var span = document.getElementsByClassName("fecharbutton")[0];

  // Mostra o modal
  modal.style.display = "block";
    popup.classList.add('show');

  // Quando o usuário clica no botão de fechar (x), fecha o modal
  span.onclick = function() {
      modal.style.display = "none";
         popup.classList.remove('show');
  }

  // Quando o usuário clica em qualquer lugar fora do modal, fecha-o
  window.onclick = function(event) {
      if (event.target == modal) {
        popup.classList.remove('show');
          modal.style.display = "none";
      }
  }
})
