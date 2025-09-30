const form = document.getElementById('loginForm');
const message = document.getElementById('message');
const data = await response.json();

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3000/login', {  
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        if (response.ok) {
            message.style.color = 'green';
            message.textContent = '¡Login exitoso!';
            
        } else {
            message.style.color = 'red';
            message.textContent = data.message || 'Error en login';
        }
    } catch (error) {
        message.style.color = 'red';
        message.textContent = 'No se pudo conectar al servidor';
        console.error(error);
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('userId', data.user.id);    
    localStorage.setItem('email', data.user.email); 

    fetch('/security/login-check', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: data.user.id,
    email: data.user.email
  })
}).catch(() => {});
    
});

