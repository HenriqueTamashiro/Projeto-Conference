document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm'); // Seleciona o formulário de login

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Previne o envio padrão do formulário

        const username = document.getElementById('username').value; // Captura o valor do usuário
        const password = document.getElementById('password').value; // Captura o valor da senha
        

        try {
            const response = await fetch('http://34.207.139.134:3300/login', {
                method: 'POST', // Usando o método POST
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password }) // Enviando os dados
            });

            if (response.ok) {
                const data = await response.json(); // Captura a resposta do servidor
                console.log('Login bem-sucedido:');
                // Redirecionar ou realizar outra ação após o login bem-sucedido
            } else {
                console.error('Erro ao fazer login:', response.statusText);
                alert('Falha no login, verifique suas credenciais.'); // Mensagem de erro
            }
        } catch (error) {
            console.error('Erro de rede:', error);
            alert('Erro ao se conectar ao servidor.'); // Mensagem de erro
        }
    });
});


  // Adiciona funcionalidade ao botão de logout
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
