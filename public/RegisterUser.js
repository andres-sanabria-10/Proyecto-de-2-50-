document.getElementById('verifyEmailBtn').addEventListener('click', async function() {
    const email = document.getElementById('email').value;
    try {
        const response = await fetch('https://veterinaria-5tmd.onrender.com/auth/verify-Email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ mail: email }),
        });
        const data = await response.json();
        if (response.ok) {
            document.getElementById('emailVerificationMessage').textContent = data.message;
            // Move to the next slide (verification code input)
            $('#registerCarousel').carousel('next');
        } else {
            document.getElementById('emailVerificationMessage').textContent = data.error;
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

function verifyCode() {
    const email = document.getElementById('email').value;
    const code = document.getElementById('verificationCode').value;
    fetch('https://veterinaria-5tmd.onrender.com/auth/verify-Code', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mail: email, verificationCode: code }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            document.getElementById('codeVerificationMessage').textContent = data.message;
            // Move to the next slide (user details input)
            $('#registerCarousel').carousel('next');
        } else {
            document.getElementById('codeVerificationMessage').textContent = data.error;
        }
    })
    .catch(error => console.error('Error:', error));
}

function registerUser() {
    const userData = {
        name: document.getElementById('name').value,
        lastName: document.getElementById('lastName').value,
        birthdate: document.getElementById('birthdate').value,
        documentNumber: document.getElementById('docNumber').value,
        mail: document.getElementById('email').value,
        phone: document.getElementById('phoneNumber').value,
        password: document.getElementById('password').value,

        role: "Usuario"
    };

    fetch('https://veterinaria-5tmd.onrender.com/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    })
    .then(response => response.json())
    .then(data => {
        if (data.data) {
            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'Usuario registrado correctamente',
                confirmButtonText: 'OK'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = '/';
                }
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: data.error || 'Ocurrió un error al registrar el usuario',
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al conectar con el servidor',
        });
    });
}