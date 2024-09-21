const profileButton = document.getElementById('dashboard');
const dropdownMenu = document.getElementById('dropdownMenu');


profileButton.addEventListener('mouseenter', () => {
    profileButton.classList.add('hover');
    dropdownMenu.style.display = dropdownMenu.style.display === 'none' ? 'block' : 'none';
});

// Fecha o dropdown se clicar fora dele
window.addEventListener('mouseleave', (event) => {
    if (!profileButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
        dropdownMenu.style.display = 'none';
    }
});

// Evento de clique para deslogar
document.getElementById('logoutButton').addEventListener('click', () => {
    fetch('/logout', {
        method: 'POST',
        credentials: 'include'
    })
    .then(response => {
        if (response.ok) {
            window.location.href = '/login';
        } else {
            console.error('Erro ao deslogar');
        }
    })
    .catch(error => console.error('Erro:', error));
});
