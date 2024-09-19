document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    let logado = false;

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const data = { username, password };

    fetch('http://seu-servidor.com/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            logado = true;
            alert('Login bem-sucedido!');
        } else {
            alert('Usuário ou senha incorretos.');
        }
    })
    .catch(error => {
        console.error('Erro:', error);
    });
});
