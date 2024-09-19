const mysql = require('mysql2');
const form =  document.querySelector('.form');

// Configuração da conexão
const connection = mysql.createConnection({
  host: 'localhost',     // Host do seu banco de dados
  user: 'root',          // Usuário do banco
  password: '#c1B2y3k4@e5n6C7r8y9Pt@', // Senha do banco
  database: 'users' // Nome do banco que você criou
});


connection.connect(err => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados: ', err);
    return;
  }
  console.log('Conectado ao banco de dados!');

  // Criação da tabela de exemplo
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS usuarios (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(255) NOT NULL,
      cliente VARCHAR(255) NOT NULL,
      identificador VARCHAR(255) NOT NULL,
      \`key\` VARCHAR(255) NOT NULL
    );
  `;

  connection.query(createTableQuery, (err, result) => {
    if (err) {
      console.error('Erro ao criar a tabela: ', err);
      return;
    }
    console.log('Tabela criada com sucesso!');

    // Inserção de dados
    const insertQuery = `
      INSERT INTO usuarios (nome, cliente, identificador, key_valor)
      VALUES (?, ?, ?, ?);
    `;

    // Dados a serem inseridos
    const values = ['João', 'Empresa X', '12345', 'abcde123'];

    connection.query(insertQuery, values, (err, result) => {
      if (err) {
        console.error('Erro ao inserir dados: ', err);
        return;
      }
      console.log('Dados inseridos com sucesso!', result.insertId);

      // Fechar a conexão após a inserção dos dados
      connection.end();
    });
  });
});
