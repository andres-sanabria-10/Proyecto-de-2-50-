document.getElementById('sendVerificationCodeBtn').addEventListener('click', async function() {
    const email = document.getElementById('resetEmail').value;
    try {
        const response = await fetch('https://veterinaria-5tmd.onrender.com/auth/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ mail: email }),
        });
        const data = await response.json();
        if (response.ok) {
            document.getElementById('emailVerificationMessage').textContent = data.message;
            // Mover al siguiente paso (ingresar código de verificación)
            $('#passwordResetCarousel').carousel('next');
        } else {
            document.getElementById('emailVerificationMessage').textContent = data.message || 'Error en el envío del código';
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('emailVerificationMessage').textContent = 'Error en el servidor';
    }
});


document.getElementById('verifyResetCodeBtn').addEventListener('click', async function() {
    const email = document.getElementById('resetEmail').value;
    const resetCode = document.getElementById('resetVerificationCode').value;
    try {
        const response = await fetch('https://veterinaria-5tmd.onrender.com/auth/verify-ResetCode', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ mail: email, resetCode: resetCode }),
        });
        const data = await response.json();
        if (response.ok) {
            document.getElementById('codeVerificationMessage').textContent = data.message;
            $('#passwordResetCarousel').carousel('next');
        } else {
            document.getElementById('codeVerificationMessage').textContent = data.message || 'Código inválido o expirado';
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('codeVerificationMessage').textContent = 'Error en el servidor';
    }
});


document.getElementById('resetPasswordBtn').addEventListener('click', async function() {
    const email = document.getElementById('resetEmail').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (newPassword !== confirmPassword) {
        document.getElementById('resetPasswordMessage').textContent = 'Las contraseñas no coinciden';
        return;
    }

    try {
        const response = await fetch('https://veterinaria-5tmd.onrender.com/auth/change-Password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ mail: email, newPassword: newPassword }),
        });
        const data = await response.json();
        if (response.ok) {
            document.getElementById('resetPasswordMessage').textContent = data.message;
            alert('¡Contraseña cambiada exitosamente!');
            // Aquí puedes cerrar el modal si es necesario
            $('#PasswordResetModal').modal('hide');
        } else {
            document.getElementById('resetPasswordMessage').textContent = data.message || 'Error al restablecer la contraseña';
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('resetPasswordMessage').textContent = 'Error en el servidor';
    }
});
