// Função para carregar e atualizar o header dinamicamente
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
            const response = await fetch('http://34.207.139.134:3300/isLoggedIn', {
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
            window.location.href = '/pages/login.html';
           
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


