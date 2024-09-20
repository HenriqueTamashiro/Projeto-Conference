document.addEventListener('DOMContentLoaded', function() {
  fetch('http://127.0.0.1:3300/dashboard', {
      method: 'GET',
      headers: {
          'Authorization': localStorage.getItem('token')  // Envia o token JWT
      }
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Erro ao carregar o dashboard.');
      }
      return response.json();
  })
  .then(result => {
      // Exibe a mensagem do servidor no elemento HTML
      document.getElementById('dashboard').innerText = result.message;
  })
  .catch(error => {
      console.error('Erro:', error);
      document.getElementById('dashboard').innerText = 'Falha ao carregar o dashboard.';
  });
});
