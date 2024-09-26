document.getElementById('userForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Impede o envio padrão do formulário

  const form = document.querySelector('.form');
  const identificador = form.querySelector('.id_input').value;
  const key_valor = form.querySelector('.key_input').value;

  // Cria a URL com parâmetros de consulta
  const url = `http://34.207.139.134:3300/get-user?identificador=${encodeURIComponent(identificador)}&key_valor=${encodeURIComponent(key_valor)}`;
 
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
  .then(valor => {
    console.log('Dados recebidos:', valor);
    
    // Exibe os dados no HTML
    const resultadoDiv = document.querySelector('.container');
    resultadoDiv.innerHTML = ''; // Limpa os resultados anteriores
    
    if (valor.length === 0) {
      resultadoDiv.innerHTML = '<p>Nenhum usuário encontrado.</p>';
      return;
    }
    
    valor.forEach(user => {
      const userElement = document.createElement('div');
      userElement.innerHTML = `
        <p><strong>Nome:</strong> ${user.nome}</p>
        <p><strong>Cliente:</strong> ${user.cliente}</p>
        <p><strong>Identificador:</strong> ${user.identificador}</p>
        <p><strong>Acessos:</strong> ${user.acessos}</p>
        <button onclick="window.location.reload()">Voltar</button>
      `;
      resultadoDiv.appendChild(userElement);
    });
  })
  .catch(error => {
    console.error('Erro:', error);
    const resultadoDiv = document.querySelector('.container');
    resultadoDiv.innerHTML = '<p>Erro ao buscar os dados. Tente novamente!</p>';
  });
});

// O restante do código não precisa de mudanças significativas

document.addEventListener('DOMContentLoaded', async () => {
  const headerResponse = await fetch('./pages/header.html');
  const headerData = await headerResponse.text();
  document.getElementById('header-placeholder').innerHTML = headerData;

  const token = localStorage.getItem('token'); 
  const profileMenu = document.getElementById('profileMenu');
  const loginButton = document.getElementById('loginButton');
  const dashboard = document.getElementById('dashboard');
  
  if (token) {
      try {
          const response = await fetch('http://34.207.139.134:3300/dashboard', {
              method: 'GET',
              headers: {
                  'Authorization': `Bearer ${token}`
              }
          });

          if (!response.ok) {
              throw new Error('Token inválido ou expirado.');
          }

          const result = await response.json();
          dashboard.innerText = result.message;
          profileMenu.style.display = 'block';
          loginButton.style.display = 'none';

      } catch (error) {
          console.error('Erro:', error);
          alert('Sua sessão expirou. Faça login novamente.');
          localStorage.removeItem('token');
          window.location.href = 'login.html';
      }
    }
  });