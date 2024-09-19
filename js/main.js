const loadContent = () => {

    const form = document.querySelector('.form');
    // Carrega a página localizada na pasta 'pages'
    
    const responseLoad = (evento) =>{
    
    evento.preventDefault();
    fetch('/pages/responseContent.html')
      .then(response => {
        // Verifica se a resposta foi bem-sucedida (código HTTP 200)
        if (!response.ok) {
          throw new Error('Erro ao carregar o conteúdo'); // Se não, lança um erro
        }
        return response.text(); // Transforma a resposta em texto
      })
      .then(data => {
        // Atualiza a div com o conteúdo carregado
        document.querySelector('.container').innerHTML='';
        document.querySelector('.container').innerHTML = data;
      })
      .catch(error => console.error('Erro:', error));
      
    };

    form.addEventListener('submit', responseLoad);
  };
  

  loadContent();
/*
const sendForm = () => {
const receiveData = [];

const form = document.querySelector('.form');
const container = document.querySelector('.container');


const loadForm = (event) => {
    event.preventDefault();
    const name = form.querySelector('.name').value;
    const cliente = form.querySelector('.cliente').value;
    const id_input = form.querySelector('.id_input').value;
    const key_input = form.querySelector('.key_valor').value;

receiveData.push({
    Nome: name,
    Cliente: cliente,
    ID: id_input,
    Key: key_input,
});
   

  container.innerHTML = `<div class='response'>
      <h2>Informações Recebidas:</h2>
      <p><strong>Nome:</strong> ${name}</p>
      <p><strong>Cliente:</strong> ${cliente}</p>
      <p><strong>ID:</strong> ${id_input}</p>
      <p><strong>Key:</strong> ${key_input}</p>
      <p><em>Seu acesso foi liberado com sucesso. Verifique os e-mails de confirmação!</em></p>
      <button onclick="window.location.reload()">Voltar</button> </div>
    `;

};

  console.log(receiveData);
  form.addEventListener('submit', loadForm);
};

sendForm();
*/