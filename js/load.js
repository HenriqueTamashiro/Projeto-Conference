
const loadContent = () => {

    const form = document.querySelector('.form');
    // Carrega a página localizada na pasta 'pages'
    
    const responseLoad = (evento) =>{
    
    evento.preventDefault();
    fetch('./pages/responseContent.html')
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
  
  // Chame a função para carregar o conteúdo na div
  loadContent();
  