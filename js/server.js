const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const session = require('express-session');

const app = express();
const JWT_SECRET = 'minha-chave-secreta';  // Definição global da chave secreta

// Configurar o CORS para permitir todos os domínios
app.use(cors({
  origin: 'http://34.207.139.134/',
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
  secret: 'sua-chave-secreta',
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
app.post('/get-user', (req, res) => {
  const { identificador, key_valor } = req.body;
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
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
      return res.status(400).json({ message: 'Usuário e senha são obrigatórios.' });
  }

  const userCheckQuery = `SELECT * FROM autenticacao WHERE username = ?`;
  connection.query(userCheckQuery, [username], async (err, results) => {
      if (err) {
          console.error('Erro ao consultar o banco de dados:', err);
          return res.status(500).json({ message: 'Erro no servidor ao consultar o banco de dados.' });
      }

      if (results.length === 0) {
          return res.status(400).json({ message: 'Usuário não encontrado.' });
      }

      const user = results[0];

      try {
          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (!isPasswordValid) {
              return res.status(400).json({ message: 'Senha incorreta.' });
          }

          const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
              expiresIn: '1h',
          });

          req.session.username = username; // Armazena o nome de usuário na sessão
          res.json({ success: true, token });

      } catch (compareError) {
          console.error('Erro ao comparar a senha:', compareError);
          res.status(500).json({ message: 'Erro no servidor ao verificar a senha.' });
      }
  });
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



// --- Rota protegida: Dashboard ---
app.get('/dashboard', authenticateToken, (req, res) => {
  res.json({ message: `${req.user.username}`});
});


const porta = 3400;
app.listen(porta, () => {
  console.log('Servidor express rodando na porta: ', porta);
});




