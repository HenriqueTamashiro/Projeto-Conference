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
        <p><strong>Nome:</strong> ${user.nome}</p><br>
        <p><strong>Cliente:</strong> ${user.cliente}</p><br>
        <p><strong>Identificador:</strong> ${user.identificador}</p><br>
        <p><strong>Acessos:</strong> ${user.acessos}</p><br>
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


    // Adicionar evento de logout
    logoutButton.addEventListener('click', async () => {

                localStorage.removeItem('token');
                window.location.href = '/pages/login.html';

    });
});