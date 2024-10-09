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
            const response = await fetch('/dashboard', {
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
                window.location.replace('/pages/login.html');
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


document.getElementById('userForm').addEventListener('submit',async function(event) {
    event.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData(event.target);
    const form = document.querySelector('.form');
    const data = {
        nome: formData.get('nome'),
        cliente: formData.get('cliente'),
        identificador: formData.get('identificador').toUpperCase(),
        key_valor: formData.get('key'),
        acessos: formData.get('acessos')
    };
    try{
    const responseAdd = await fetch('https://conference.cbyk.com/add-user', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)  // Usar o objeto `data` com os valores do formulário
    });

    if (responseAdd.status === 403){ 
        alert('Necessário estar logado');
        } 

        else if (responseAdd.status === 400){ 
            alert('Key já existente');
            }
            else if (responseAdd.status === 200){ 
                alert('Dados adicionados!');

                document.addEventListener('DOMContentLoaded', async () => {
                    const responseAcess = await fetch('/pages/responseTable.html');
                    const Acess = await responseAcess.text();
                    document.getElementById('table-placeholder').innerHTML = Acess;
                })
                form.reset();
                }
    
        } catch (error) {
            alert(`Usuário adicionado com sucesso:`)
            console.error('Erro na requisição:', error);
        }


    });

    document.getElementById('randomKey').addEventListener('click', async function(event) {
        event.preventDefault(); // Evita o comportamento padrão do botão de submissão do formulário
        const token = localStorage.getItem('token');
        try {
            // Faz uma requisição para a rota /generate-key para obter a chave aleatória
            const response = await fetch('/generate-key', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                   'Authorization': `Bearer ${token}`
                }
            });

            // Verifica se a requisição foi bem-sucedida
            if (!response.ok) {
                throw new Error('Erro ao gerar a chave');
            }

            // Extrai a chave da resposta JSON
            const data = await response.json();
      
            // Atualiza o elemento que exibe a chave
            const keyRandomElement = document.getElementById('randomKey');
            if (keyRandomElement.value) {
                return;
            }

            keyRandomElement.value = data.key;

           

        } catch (error) {
            console.error('Erro ao gerar a chave:', error);
        }
    });