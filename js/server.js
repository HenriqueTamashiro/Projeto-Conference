const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Configurar o CORS para permitir todos os domínios
app.use(cors());

// Configuração para servir arquivos estáticos, como o favicon
app.use(express.static('public')); // Certifique-se de que o diretório `public` contém o favicon

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuração da conexão com o banco de dados
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '#c1B2y3k4@e5n6C7r8y9Pt@',
  database: 'users'
});

connection.connect(err => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados: ', err);
    return;
  }
  console.log('Conectado ao banco de dados!');

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS usuarios (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(255) NOT NULL,
      cliente VARCHAR(255) NOT NULL,
      identificador VARCHAR(255) NOT NULL,
      key_valor VARCHAR(255) NOT NULL,
      acessos VARCHAR(255) NOT NULL
    );
  `;

  connection.query(createTableQuery, (err, result) => {
    if (err) {
      console.error('Erro ao criar a tabela: ', err);
      return;
    }
    console.log('Tabela criada com sucesso!');
  });
});

// Endpoint para inserção de dados
app.post('/add-user', (req, res) => {
  const { nome, cliente, identificador, key_valor, acessos} = req.body;

  const insertQuery = `
    INSERT INTO usuarios (nome, cliente, identificador, key_valor, acessos)
    VALUES (?, ?, ?, ?, ?);
  `;

  const values = [nome, cliente, identificador, key_valor, acessos];

  connection.query(insertQuery, values, (err, result) => {
    if (err) {
      console.error('Erro ao inserir dados: ', err);
      return res.status(500).send('Erro ao inserir dados');
    }
    console.log('Dados inseridos com sucesso!', result.insertId);
    res.send('Dados inseridos com sucesso!');
  });
});

// Endpoint básico para verificar se o servidor está funcionando
app.get('/', (req, res) => {
  res.send('Servidor está funcionando');
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
