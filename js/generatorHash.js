const bcrypt = require('bcryptjs');

const password = '123'; // Senha original
const saltRounds = 10; // Número de rounds para o hash

bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
        console.error('Erro ao criptografar a senha:', err);
        return;
    }
    console.log('Senha criptografada:', hash);
});
