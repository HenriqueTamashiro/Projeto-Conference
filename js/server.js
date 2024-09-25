const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const session = require('express-session');
require('dotenv').config(); // Importa e configura o dotenv


const app = express();
const JWT_SECRET = process.env.SECRET_KEY;  // Usa a chave secreta do .env

// Configurar o CORS para permitir todos os domínios
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuração da conexão com o banco de dados
const porta_db = 3306;
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '#c1B2y3k4@e5n6C7r8y9Pt@',
  database: 'users',
  port: porta_db
});




async function findUserByUsername(username) {
  return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM autenticacao WHERE username = ?';
      connection.query(query, [username], (error, results) => {
          if (error) {
              return reject(error);
          }
          resolve(results[0]); // Retorna o primeiro usuário encontrado
      });
  });
}
console.log('Servidor de DB rodando na porta: ', porta_db);

connection.connect(err => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados: ', err);
    return;
  }
  console.log('Conectado ao banco de dados!');
});

// Configuração do middleware de sessões
app.use(session({
  secret: process.env.SECRET_KEY, // Usa a chave secreta do .env
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// --- Rota para inserir um novo usuário no banco ---
app.post('/add-user', (req, res) => {
  const { nome, cliente, identificador, key_valor, acessos } = req.body;
  const insertQuery = `INSERT INTO usuarios (nome, cliente, identificador, key_valor, acessos) VALUES (?, ?, ?, ?, ?)`;

  connection.query(insertQuery, [nome, cliente, identificador, key_valor, acessos], (err, result) => {
    if (err) {
      console.error('Erro ao inserir dados:', err);
      return res.status(500).send('Erro ao inserir dados');
    }
    console.log('Dados inseridos com sucesso!', result.insertId);
    res.send('Dados inseridos com sucesso!');
  });
});

// --- Rota para buscar usuário pelo identificador e key ---
app.get('/get-user', (req, res) => {
  const { identificador, key_valor } = req.query;
  
  const selectQuery = `SELECT * FROM usuarios WHERE identificador = ? AND key_valor = ?`;

  connection.query(selectQuery, [identificador, key_valor], (err, resultados) => {
    if (err) {
      console.error('Erro ao buscar os dados:', err);
      return res.status(500).send('Erro ao buscar os dados');
    }

    if (resultados.length > 0) {
      console.log('Usuário encontrado:', resultados);
      res.json(resultados);
    } else {
      console.log('Nenhum usuário encontrado com esses dados.');
      res.status(404).send('Usuário não encontrado');
    }
  });
});


// --- Rota para logout ---
app.post('/logout', (req, res) => {
  if (!req.session) {
    return res.status(400).send('Sessão não existe');
  }

  req.session.destroy(err => {
    if (err) {
      console.error('Erro ao destruir a sessão:', err);
      return res.status(500).send('Erro ao deslogar');
    }
    res.clearCookie('connect.sid');
    req.session = null; // Limpa a sessão
    res.status(200).send('Deslogado com sucesso');
  });
});

// --- Endpoint para login ---
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Buscar o usuário no banco de dados
  const user = await findUserByUsername(username);
  
  if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
      return res.status(400).json({ message: 'Senha incorreta.' });
  }

  // Gerar um token JWT
  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
      expiresIn: '1h' // O token expira em 1 hora
  });

  // Retornar a resposta com o token
  return res.status(200).json({ message: 'Login bem-sucedido!', token });
});



// --- Middleware para autenticação via JWT ---
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'Token não fornecido.' });

  jwt.verify(token.split(' ')[1], JWT_SECRET, (err, user) => {  // Use apenas o token
    if (err) return res.status(403).json({ message: 'Token inválido.' });
    req.user = user;
    next();
  });
};

app.get('/isLoggedIn', (req, res) => {
  if (req.session.user) {
    // Supondo que req.session.user contenha as informações do usuário logado
    res.status(200).send({ loggedIn: true, username: req.session.user.username });
  } else {
    res.status(200).send({ loggedIn: false });
  }
});

// Endpoint de teste para buscar todos os usuários
// Rota para testar a conexão com o banco de dados
app.get('/test-database', (req, res) => {
  console.log('Rota /test-database acessada');

  connection.query('SELECT * FROM usuarios', (error, results) => {
    if (error) {
      console.error('Erro ao conectar ao banco de dados:', error);
      return res.status(500).send('Erro ao conectar ao banco de dados');
    }

    // Retornando todos os resultados da tabela 'usuarios'
    res.json({
      message: 'A conexão foi bem-sucedida!',
      data: results
    });
  });
});

// --- Rota protegida: Dashboard ---
app.get('/dashboard', authenticateToken, (req, res) => {
  res.json({ message: `${req.user.username}` });
});

const porta = 3300;
app.listen(porta, () => {
  console.log('Servidor express rodando na porta: ', porta);
});
