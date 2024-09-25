const bcrypt = require('bcryptjs');

const password = '123'; // A senha fornecida
const hash = '$2a$10$pqaOOtBSqD6CY1.i.yGjlO63fV9D..95onDK0so7wIu0xS9tz40bC'; // O hash armazenado

bcrypt.compare(password, hash, (err, isMatch) => {
    if (err) {
        console.error('Erro na comparação:', err);
        return;
    }
    console.log('A senha é válida?', isMatch); // Deve retornar true
});
