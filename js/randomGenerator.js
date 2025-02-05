function gerarNumeroAleatorio() {
    // Gera um número aleatório entre 1000000 e 9999999
    return Math.floor(1000000 + Math.random() * 9000000);
}

const numeroAleatorio = gerarNumeroAleatorio();
console.log(numeroAleatorio);
 