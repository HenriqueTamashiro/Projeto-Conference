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
