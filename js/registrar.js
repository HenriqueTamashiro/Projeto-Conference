document.getElementById('registerForm').addEventListener('submit', async function (event) {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const response = await fetch('/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
    try{

    if (response.status === 200) {
      alert('Cadastrado!');
      
    }
    else if (response.status=== 409) {
      alert('usuário existente!')
      
    } 
    else if (response.status=== 401) {
      alert('Não autorizado!')
      response.status(401).send('Não autorizado');
    } 
  }
  catch(error){
    console.error('Erro',error);
  }
});
