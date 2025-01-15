document.addEventListener('DOMContentLoaded', async () => {
    const responseAcess = await fetch('/pages/responseTable.html');
    const Acess = await responseAcess.text();
    document.getElementById('response-placeholder').innerHTML = Acess;
})