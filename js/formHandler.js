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


document.getElementById('userForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData(event.target);
    const data = {
        nome: formData.get('nome'),
        cliente: formData.get('cliente'),
        identificador: formData.get('identificador'),
        key_valor: formData.get('key'),
        acessos: formData.get('acessos')
    };
    console.log('teste')
    fetch('http://34.207.139.134:3300/add-user', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)  // Usar o objeto `data` com os valores do formulário
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
  });