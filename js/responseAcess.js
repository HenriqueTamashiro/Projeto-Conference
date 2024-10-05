document.addEventListener('DOMContentLoaded', async () => {
    const responseAcess = await fetch('/pages/tableRegister.html');
    const Acess = await responseAcess.text();
    document.getElementById('response-placeholder').innerHTML = Acess;
})