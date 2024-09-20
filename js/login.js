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
            window.location.href = '../home.html';  // Redireciona para a página do painel
        } else {
            alert(result.message);  // Exibe a mensagem de erro retornada
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Ocorreu um erro no login. Tente novamente.');
    });
});
