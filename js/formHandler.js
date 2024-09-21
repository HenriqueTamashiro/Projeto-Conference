document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');  // Verifica se o token existe
    const contai = document.querySelector('.container');
    if (!token) {
        alert('Você precisa estar logado para acessar esta página. Ou não possui acesso a esta área');
        
        window.location.href = 'http://127.0.0.1:5500/pages/login.html';  // Redireciona para a página de login
        return;  // Interrompe a execução
    }

    try {
        // Caso o token exista, verificar sua validade com o servidor
        const response = await fetch('http://127.0.0.1:3300/dashboard', {
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
        window.location.href = 'http://127.0.0.1:5500/pages/login.html';  // Redireciona para a página de login
    }
});




document.addEventListener('DOMContentLoaded', function() {
    fetch('http://127.0.0.1:3300/dashboard', {
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

  fetch('http://127.0.0.1:3300/add-user', {
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

  fetch('http://127.0.0.1:3300/acessos')
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
