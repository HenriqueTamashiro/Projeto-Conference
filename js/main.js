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
    return response.json(); // Converte a resposta para JSON
  })
  .then(async valor => {
    console.log('Dados recebidos:', valor);
    alert('ATENÇÃO! Anote seus acessos, pois eles serão deletados após esta consulta!')
    
    // Carrega o HTML adicional
    const responseAcess = await fetch('/pages/responseAcess.html');
    const Acess = await responseAcess.text();
    
    if (valor.userData) {
      // Preenche os campos com os dados do usuário encontrado
      const resultadoDiv = document.getElementById('containerID');
      resultadoDiv.innerHTML = Acess;
      
      const nomeResp = document.getElementById('nomeResp');
      const idResp = document.getElementById('idResp');
      const keyResp = document.getElementById('keyResp');
      const acessosResp = document.getElementById('acessosResp');

      nomeResp.value = valor.userData.nome;
      idResp.value = valor.userData.identificador.toUpperCase();
      keyResp.value = valor.userData.key_valor;
      acessosResp.value = valor.userData.acessos;
    } else {
      // Se nenhum usuário foi encontrado
      const resultadoDiv = document.querySelector('.container');
      resultadoDiv.innerHTML = '<p>Nenhum usuário encontrado.</p>';
    }
  })
  .catch(error => {
    console.error('Erro:', error);
    const resultadoDiv = document.querySelector('.container');
    resultadoDiv.innerHTML = `<h1>Identificador e/ou Service Tag não encontrado(s)</h1>
    <br><button class="retornar" onclick="window.location.reload();">Voltar</button>`;
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

  loginButton.style.display = 'block';
});

// Modal
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
});
