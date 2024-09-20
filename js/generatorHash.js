const bcrypt = require('bcryptjs');

const senha = '1704';
bcrypt.hash(senha, 10, (err, hash) => {
  if (err) {
    console.error(err);
  } else {
    console.log('SENHA CRIPTOGRAFADA:', hash);
    // Insira o valor do hash no banco de dados diretamente
  }
});
