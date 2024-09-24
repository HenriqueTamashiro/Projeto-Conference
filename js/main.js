document.getElementById('userForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Impede o envio padrão do formulário

  const identificador = document.querySelector('.id_input').value;
  const key_valor = document.querySelector('.key_input').value;

  const valor = {
    identificador: identificador,
    key_valor: key_valor
  };

  fetch('/get-user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(valor),
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
    
    valor.forEach(user => {
      const userElement = document.createElement('div');
      userElement.innerHTML = `
        <p><strong>Nome:</strong> ${user.nome}</p>
        <p><strong>Cliente:</strong> ${user.cliente}</p>
        <p><strong>Identificador:</strong> ${user.identificador}</p>
        <p><strong>Acessos:</strong> ${user.acessos}</p>
        <button onclick="window.location.reload()">Voltar</button> </div>
      `;
      resultadoDiv.appendChild(userElement);
    });
  })
  .catch(error => {
    console.error('Erro:', error);
    const resultadoDiv = document.getElementById('content');
    resultadoDiv.innerHTML = '<p>Erro ao buscar os dados. Tente novamente.!</p>';
  });
});
document.addEventListener('DOMContentLoaded', async () => {
  // Carregar o header
  const headerResponse = await fetch('./pages/header.html');
  const headerData = await headerResponse.text();
  document.getElementById('header-placeholder').innerHTML = headerData;

  // Verificar o token
  const token = localStorage.getItem('token'); 

  // Referências aos elementos do header
  const profileMenu = document.getElementById('profileMenu');
  const loginButton = document.getElementById('loginButton');
  const dashboard = document.getElementById('dashboard');
  
  if (token) {
      // Se o token existe, validar com o servidor
      try {
          const response = await fetch('/dashboard', {
              method: 'GET',
              headers: {
                  'Authorization': `Bearer ${token}`
              }
          });

          if (!response.ok) {
              throw new Error('Token inválido ou expirado.');
          }

          const result = await response.json();
          dashboard.innerText = result.message; // Exibe o nome do usuário
          profileMenu.style.display = 'block';
          loginButton.style.display = 'none';

      } catch (error) {
          console.error('Erro:', error);
          alert('Sua sessão expirou. Faça login novamente.');
          localStorage.removeItem('token');  // Remove o token inválido
          window.location.href = '/pages/login.html';  // Redireciona para a página de login
      }

      // Adicionar o evento de logout
      document.getElementById('logoutButton').addEventListener('click', async () => {
          try {
              const response = await fetch('/logout', {
                  method: 'POST',
                  credentials: 'include'
              });

              if (response.ok) {
                  localStorage.removeItem('token'); // Remove o token
                  window.location.href = '/pages/login.html'; // Redireciona para o login
              } else {
                  alert('Erro ao deslogar. Tente novamente.');
              }
          } catch (error) {
              console.error('Erro:', error);
          }
      });

  } else {
      // Caso não tenha token, mostrar o botão de login e ocultar o menu
      profileMenu.style.display = 'none';
      loginButton.style.display = 'block';
  }
});


