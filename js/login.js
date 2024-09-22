document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const data = { username, password };

    fetch('http://127.0.0.1:3300/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.token) {  // Se o login foi bem-sucedido e o token foi retornado
            localStorage.setItem('token', result.token);  // Salva o token no Local Storage
            window.location.href = '../cadastro_acessos.html';  // Redireciona para a página do painel
        } else {
            alert(result.message);  // Exibe a mensagem de erro retornada
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Ocorreu um erro no login. Tente novamente.');
    });
});


fetch('http://localhost:3300/isLoggedIn', {
    credentials: 'include',  // Inclui cookies de sessão
  })
  .then(response => response.json())
  .then(data => {
    const dashboard = document.getElementById('dashboard');
    const logoutButton = document.getElementById('logoutButton');

    if (data.loggedIn) {
      // Exibe o nome do usuário e o botão de deslogar
      dashboard.textContent = data.username;
      logoutButton.style.display = 'block';
    } else {
      // Esconde o botão de deslogar se não estiver logado
      dashboard.textContent = 'Não logado';
      logoutButton.style.display = 'none';
    }
  });

  // Adiciona funcionalidade ao botão de logout
  fetch('../pages/header.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('header-placeholder').innerHTML = data;
    document.getElementById('logoutButton').addEventListener('click', async () => {
      try {
          const response = await fetch('http://127.0.0.1:3300/logout', {
              method: 'POST',
              credentials: 'include' // Inclui cookies na requisição, se necessário
          });
  
          if (response.ok) {
              localStorage.removeItem('token'); // Remove o token do localStorage
              window.location.href = 'http://127.0.0.1:5500/pages/login.html'; // Redireciona para a página de login
          } else {
              console.error('Erro ao deslogar');
              alert('Erro ao deslogar. Tente novamente.');
          }
      } catch (error) {
          console.error('Erro:', error);
      }
  });      

  });
