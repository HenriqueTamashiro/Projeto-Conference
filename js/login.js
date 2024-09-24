document.getElementById('loginButton1').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const submitButton = document.getElementById('submitButton');
    submitButton.disabled = true;  // Desabilita o botão
    const data = { username, password };

    fetch('/login', {
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
            window.location.href = '../pages/cadastro_acessos.html';  // Redireciona para a página do painel
        } else {
            alert(result.message);  // Exibe a mensagem de erro retornada
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Ocorreu um erro no login. Tente novamente.');
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
