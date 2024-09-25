const bcrypt = require('bcryptjs');

const password = '123'; // A senha fornecida
const hash = '$2a$10$8brsT9FoHgHbMudWk87WG.rDJxNMthgyDQ8jAY4E9gC2WyIobmi3q'; // O hash armazenado

bcrypt.compare(password, hash, (err, isMatch) => {
    if (err) {
        console.error('Erro na comparação:', err);
        return;
    }
    console.log('A senha é válida?', isMatch); // Deve retornar true
});
