document.addEventListener('DOMContentLoaded', function() {
    fetch('http://34.207.139.134:3300/dashboard', {
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
  
  document.addEventListener('DOMContentLoaded', async () => {
    // Carregar o header
    const headerResponse = await fetch('../pages/header.html');
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
                const response = await fetch('http://34.207.139.134:3300/logout', {
                    method: 'POST',
                    credentials: 'include'
                });

                if (response.ok) {
                    localStorage.removeItem('token'); // Remove o token
                    window.location.href = '../pages/login.html'; // Redireciona para o login
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
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();  // Evita o recarregamento da página ao enviar o formulário

    const formData = new FormData(event.target);  // Pega os dados do formulário
    const data = {
        username: formData.get('username'),
        password: formData.get('password')
    };


    
    try {
        const response = await fetch('http://34.207.139.134:3300/login', {  // Endpoint de login
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.token) {  // Se o login foi bem-sucedido e o token foi recebido
            localStorage.setItem('token', result.token);  // Salva o token no localStorage
            window.location.href = '/pages/cadastro_acessos.html';
            console.log(result)
            
            
        } else {
            console.error('Token não recebido:', result);
            alert('Login falhou, tente novamente.');
        }

    } catch (error) {
        console.error('Erro no login:', error);
    }
});