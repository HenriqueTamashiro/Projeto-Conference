document.getElementById('userForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Impede o envio padrão do formulário

  const identificador = document.querySelector('.id_input').value;
  const key_valor = document.querySelector('.key_input').value;

  const valor = {
    identificador: identificador,
    key_valor: key_valor
  };

  fetch('http://127.0.0.1:3300/get-user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(valor),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Erro ao buscar os dados: ' + response.statusText);
    }
    return response.json();
  })
  .then(valor => {
    console.log('Dados recebidos:', valor);
    
    // Exibe os dados no HTML
    const resultadoDiv = document.querySelector('.container');
    resultadoDiv.innerHTML = ''; // Limpa os resultados anteriores
    
    valor.forEach(user => {
      const userElement = document.createElement('div');
      userElement.innerHTML = `
        <p><strong>Nome:</strong> ${user.nome}</p>
        <p><strong>Cliente:</strong> ${user.cliente}</p>
        <p><strong>Identificador:</strong> ${user.identificador}</p>
        <p><strong>Acessos:</strong> ${user.acessos}</p>
        <button onclick="window.location.reload()">Voltar</button> </div>
      `;
      resultadoDiv.appendChild(userElement);
    });
  })
  .catch(error => {
    console.error('Erro:', error);
    const resultadoDiv = document.getElementById('content');
    resultadoDiv.innerHTML = '<p>Erro ao buscar os dados. Tente novamente.</p>';
  });
});
fetch('./pages/header.html')
      .then(response => response.text())
      .then(data => {
        document.getElementById('header-placeholder').innerHTML = data;
        document.getElementById('logoutButton').addEventListener('click', async () => {
          try {
              const response = await fetch('http://127.0.0.1:3300/logout', {
                  method: 'POST',
                  credentials: 'include' // Inclui cookies na requisição, se necessário
              });
      
              if (response.ok) {
                  localStorage.removeItem('token'); // Remove o token do localStorage
                  window.location.href = 'http://127.0.0.1:5500/pages/login.html'; // Redireciona para a página de login
              } else {
                  console.error('Erro ao deslogar');
                  alert('Erro ao deslogar. Tente novamente.');
              }
          } catch (error) {
              console.error('Erro:', error);
          }
      });      

      });


