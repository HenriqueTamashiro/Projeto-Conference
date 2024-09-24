// Função para carregar o header e gerenciar a exibição dos elementos
document.addEventListener('DOMContentLoaded', async () => {
    // Carregar o header
    const headerResponse = await fetch('header.html');
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
            const response = await fetch('http://127.0.0.1:3300/dashboard', {
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
document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');  // Verifica se o token existe
    if (!token) {
        alert('Você precisa estar logado para acessar esta página ou não possui acesso ');
        
        window.location.href = '/pages/login.html';  // Redireciona para a página de login
        return;  // Interrompe a execução
    }

    try {
        // Caso o token exista, verificar sua validade com o servidor
        const response = await fetch('/dashboard', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`  // Envia o token JWT para validação
            }
        });

        if (!response.ok) {
            throw new Error('Token inválido ou expirado.');
        }

        const result = await response.json();
        // Exibe a mensagem do servidor no elemento HTML
        document.getElementById('dashboard').innerText = result.message;

    } catch (error) {
        console.error('Erro:', error);
        alert('Sua sessão expirou. Faça login novamente.');
        localStorage.removeItem('token');  // Remove o token inválido
        window.location.href = '/pages/login.html';  // Redireciona para a página de login
    }
});




document.addEventListener('DOMContentLoaded', function() {
    fetch('/dashboard', {
        method: 'GET',
        headers: {
            'Authorization': localStorage.getItem('token')  // Envia o token JWT
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao carregar o dashboard.');
        }
        return response.json();
    })
    .then(result => {
        // Exibe a mensagem do servidor no elemento HTML
        document.getElementById('dashboard').innerText = result.message;
    })
    .catch(error => {
        console.error('Erro:', error);
        document.getElementById('dashboard').innerText = 'Falha ao carregar o dashboard.';
    });
  });
document.getElementById('userForm').addEventListener('submit', function(event) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const data = {
      nome: formData.get('nome'),
      cliente: formData.get('cliente'),
      identificador: formData.get('identificador'),
      key_valor: formData.get('key'),
      acessos: formData.get('acessos') 
  };

  fetch('/add-user', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(data) 
  })

  .then(response => response.text())
  .then(result => {
      console.log(result);
      alert('Dados enviados com sucesso!');
  })

  .catch(error => {
      console.error('Erro ao enviar dados:', error);
      alert('Erro ao enviar dados.');
  });

  fetch('/acessos')
    .then(response => response.json()) // Converte a resposta para JSON
        .then(dataGet => {
            // Seleciona o corpo da tabela onde os dados serão inseridos
            const displayContainer = document.querySelector('.container');
            displayContainer.innerHTML = '';

            dataGet.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                        <td>${user.id}</td>
                        <td>${user.nome}</td>
                        <td>${user.cliente}</td>
                        <td>${user.identificador}</td>
                        <td>${user.key_valor}</td>
                        <td>${user.acessos}</td>
                    `;
                    displayContainer.appendChild(row);
            });
    });

});



// Logout Handler
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

