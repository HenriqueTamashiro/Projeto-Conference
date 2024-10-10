const bcrypt = require('bcryptjs');

const password = '0d6a5da0c'; // A senha fornecida
const hash = '$2a$10$NC1akxMsGOcyh6Ri0N5KheN2bPKRChOuau45/IdV91sn6bNIrlpxu'; // O hash armazenado

bcrypt.compare(password, hash, (err, isMatch) => {
    if (err) {
        console.error('Erro na comparação:', err);
        return;
    }
    console.log('A senha é válida?', isMatch); // Deve retornar true
});
