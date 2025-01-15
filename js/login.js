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
        const formattedName = result.message.replace('.', ' '); // Substitui o ponto por um espaço
        document.getElementById('dashboard').innerText = formattedName;

        
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
            const response = await fetch('https://conference.cbyk.com/dashboard', {
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
                    localStorage.removeItem('token'); // Remove o token do localStorage
                    alert('Deslogado com Sucesso!');
                    window.location.href = 'https://conference.cbyk.com/pages/login.html'; // Redireciona para a página de login
                }
             catch (error) {
                console.error('Erro ao deslogar');
                alert('Erro ao deslogar. Tente novamente.');
                console.error('Erro:', error);
            }
        });
    }
});
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();  // Evita o recarregamento da página ao enviar o formulário

    const formData = new FormData(event.target);  // Pega os dados do formulário
    const data = {
        username: formData.get('username').toUpperCase(),
        password: formData.get('password')
    };


    
    try {
        const response = await fetch('https://conference.cbyk.com/login', {  // Endpoint de login
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.token) {  // Se o login foi bem-sucedido e o token foi recebido
            localStorage.setItem('token', result.token);  // Salva o token no localStorage
            window.location.href = 'https://conference.cbyk.com/pages/cadastro_acessos.html'; // Redireciona para a página de logi
            
            
            console.log(result)
            
            
        } else {
            console.error('Token não recebido:', result);
            alert('Login falhou, tente novamente.');
        }

    } catch (error) {
        console.error('Erro no login:', error);
    }


    
});

