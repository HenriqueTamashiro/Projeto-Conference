// Função para carregar e atualizar o header dinamicamente
async function loadHeader() {
    const headerResponse = await fetch('/pages/header.html');
    const headerData = await headerResponse.text();
    document.getElementById('header-placeholder').innerHTML = headerData;

    const token = localStorage.getItem('token');
    const profileMenu = document.getElementById('profileMenu');
    const loginButton = document.getElementById('loginButton');
    const logoutButton = document.getElementById('logoutButton');
    const userNameDisplay = document.getElementById('userName');

    if (token) {
        try {
            const response = await fetch('http://34.207.139.134:3300/isLoggedIn', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await response.json();

            if (result.loggedIn) {
                userNameDisplay.innerText = result.username;
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
            window.location.href = '/pages/login.html';
        }
    } else {
        profileMenu.style.display = 'none';
        loginButton.style.display = 'block';
        logoutButton.style.display = 'none';
    }

    // Adicionar evento de logout
    logoutButton.addEventListener('click', async () => {
        try {
            const response = await fetch('http://34.207.139.134:3300/logout', {
                method: 'POST',
                credentials: 'include'
            });

            if (response.ok) {
                localStorage.removeItem('token');
                window.location.href = '/pages/login.html';
            } else {
                alert('Erro ao deslogar. Tente novamente.');
            }
        } catch (error) {
            console.error('Erro ao deslogar:', error);
        }
    });
}

// Chama o loadHeader quando a página é carregada
document.addEventListener('DOMContentLoaded', async () => {
    await loadHeader();
});

// Função de login
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = {
        username: formData.get('username'),
        password: formData.get('password')
    };

    try {
        const response = await fetch('http://34.207.139.134:3300/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.token) {
            localStorage.setItem('token', result.token);
            console.log('Token recebido:', result.token);

            // Atualizar o header após o login bem-sucedido
            await loadHeader();
        } else {
            console.error('Token não recebido:', result);
            alert('Login falhou, tente novamente.');
        }

    } catch (error) {
        console.error('Erro no login:', error);
    }
});

// Função de logout
document.getElementById('logoutButton').addEventListener('click', async () => {
    try {
        const response = await fetch('http://34.207.139.134:3300/logout', {
            method: 'POST',
            credentials: 'include'
        });

        if (response.ok) {
            localStorage.removeItem('token');
            // Atualizar o header após o logout
            await loadHeader();
            window.location.href = '/pages/login.html';
        } else {
            alert('Erro ao deslogar. Tente novamente.');
        }
    } catch (error) {
        console.error('Erro ao deslogar:', error);
    }
});
