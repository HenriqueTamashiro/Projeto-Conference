const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const path = require('path');
const jwt = require('jsonwebtoken');
const session = require('express-session');
require('dotenv').config(); 
const JWT_SECRET = process.env.SECRET_KEY;  
const app = express();




app.use(cors({
  origin: 'https://conference.cbyk.com',
  methods: ['GET', 'POST'], 
  credentials: false
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Configuração da conexão com o banco de dados
const porta_db = 3306;
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.env.DB_PASSWORD,
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
          resolve(results[0]); 
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


app.use(session({
  secret: process.env.SECRET_KEY, 
  saveUninitialized: true,
  cookie: { secure: true, 
            maxAge: 1000 * 60 * 60 
  }
}));


app.use(express.static(path.join(__dirname, '..')));


const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Obtém o token do cabeçalho Authorization

  if (!token) return res.status(401).send({ message: 'Token não fornecido' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return res.status(403).send({ message: 'Token inválido ou expirado' });
      
      req.user = user; 
      next(); 
  });
};

app.get ('/healthz' , (req, res) => {
  res.status(200).send({ message: 'Ok' });
})

app.post('/add-user', authenticateToken, (req, res) => {
  const { nome, cliente, identificador, key_valor, acessos } = req.body;


  const checkKeyQuery = 'SELECT * FROM usuarios WHERE key_valor = ?';

  connection.query(checkKeyQuery, [key_valor], (err, results) => {
    if (err) {
      console.error('Erro ao verificar key_valor:', err);
      return res.status(500).send('Erro ao verificar key_valor');
    }

    if (results.length > 0) {
     
      return res.status(400).send('key_valor já existe no banco de dados');
    }

   
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
});


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
      const userData = resultados[0];
      const deleteQuery = `DELETE FROM usuarios WHERE identificador = ? AND key_valor = ?`; 
  connection.query(deleteQuery, [identificador, key_valor],(err) => {
    if(err){
      console.error(`Erro ao deletar o usuário!`,err);
      return res.status(500).send('Erro ao deletar os dados consultados');
    }
    res.json({ message: 'Consulta e remoção de dados executados com sucesso!', userData });
  });

    } else {
      console.log('Nenhum usuário encontrado com esses dados.');
      res.status(404).send('Usuário não encontrado');
    }
  });
});





app.post('/login', async (req, res) => {
  const { username, password } = req.body;


  const user = await findUserByUsername(username);
  
  if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
      return res.status(400).json({ message: 'Senha incorreta.' });
  }

 console.log('Requisião de login efetuada e aprovada ');
  req.session.user = {
    id: user.id,
    username: user.username
  };
  console.log(`Sessão criada: ${req.session.user} `);
  // Gerar um token JWT
  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
      expiresIn: '1h' // O token expira em 1 hora
  });
  // Retornar a resposta com o token e a mensagem de login bem-sucedido
  return res.status(200).json({ message: 'Login bem-sucedido!', token, user: req.session.user });

});




app.post('/generate-key', authenticateToken, (req, res) => {
  
  const gerarChaveAleatoria = (tamanho) => {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?'; // Conjunto de caracteres
    let chaveAleatoria = '';

    for (let i = 0; i < tamanho; i++) {
      const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
      chaveAleatoria += caracteres[indiceAleatorio];
    }

    return chaveAleatoria;
  };

  const gerarChaveUnica = () => {
    const chaveAleatoria = gerarChaveAleatoria(8); // Gera uma chave de (x) caracteres

    // Verifica se a chave já existe no banco de dados
    const checkKeyQuery = 'SELECT * FROM usuarios WHERE key_valor = ?';
    connection.query(checkKeyQuery, [chaveAleatoria], (err, results) => {
      if (err) {
        console.error('Erro ao verificar key_valor:', err);
        return res.status(500).send('Erro ao verificar key_valor');
      }

      if (results.length > 0) {
        
        gerarChaveUnica();
      } else {
        
        res.json({ key: chaveAleatoria });
      }
    });
  };

  gerarChaveUnica();
});





app.get('/test-database', authenticateToken,(req, res) => {
  console.log('Rota /test-database acessada');

  connection.query('SELECT * FROM usuarios', (error, results) => {
    if (error) {
      console.error('Erro ao conectar ao banco de dados:', error);
      return res.status(500).send('Erro ao conectar ao banco de dados');
    }

    
    res.json({
      message: 'A conexão foi bem-sucedida!',
      data: results
    });
  });
});
app.get('/isLoggedIn', authenticateToken, (req, res) => {
  
  res.status(200).send({ loggedIn: true, username: req.user.username });
  console.log('Sessão encontrada:', req.user);

});

app.get('/dashboard', authenticateToken, (req, res) => {
  console.log('Sessão encontrada:', req.user);

  
  res.status(200).json({ loggedIn: true, username: req.user.username });
});

app.post('/register',authenticateToken, async  (req, resp) => {
  console.log('Funcionando');
  const { username, password } = req.body;

 
  connection.query('SELECT * FROM autenticacao WHERE username = ?', [username], async (err, resultado) => {
    if (err) {
      return resp.status(400).json({ message: 'Erro ao verificar' });
    }
    if (resultado.length > 0) {
      return resp.status(409).json({ message: 'Usuário existente!' });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      connection.query('INSERT INTO autenticacao(username, password) VALUES (?, ?)', [username, hashedPassword], (err, resultado) => {
        if (err) {
          return resp.status(400).send('Usuário não foi cadastrado.');
        }
        resp.send('Cadastrado')
      });
    } catch (error) {
      return resp.status(500).send('Erro ao criptografar a senha.');
    }
  });
});


const PORT = 3300;


app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});