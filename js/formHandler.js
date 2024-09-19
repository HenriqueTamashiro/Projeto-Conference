document.getElementById('userForm').addEventListener('submit', function(event) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const data = {
      nome: formData.get('nome'),
      cliente: formData.get('cliente'),
      identificador: formData.get('identificador'),
      key_valor: formData.get('key')  // Consistência com o nome da chave
  };

  fetch('http://127.0.0.1:3000/add-user', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
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
