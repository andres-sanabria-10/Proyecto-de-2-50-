document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const email = document.getElementById('floatingInput').value;
        const password = document.getElementById('floatingPassword').value;

        fetch('https://veterinaria-5tmd.onrender.com/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ mail: email, password: password })
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => { throw err; });
                }
                return response.json();
            })
            .then(data => {
                console.log('Respuesta completa del servidor:', data);

                if (data.error) {
                    throw new Error(data.error);
                }

                console.log('Inicio de sesión exitoso:', data);
                localStorage.setItem('token', data.tokenSession);

                // Cierra el modal
                var modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
                modal.hide();
                console.log(data.data.role + "adsadasdasdssad")
                // Redirige basado en el rol del usuario
                if (data.data && data.data.role) {
                    switch (data.data.role) {
                        case 'Admin':
                            window.location.href = '/Admin';
                            break;
                        case 'Usuario':
                            window.location.href = '/User';
                            break;
                        default:
                            console.log('Rol no reconocido:', data.data.role);
                            Swal.fire({
                                title: 'Advertencia',
                                text: 'Inicio de sesión exitoso, pero el rol no está definido correctamente',
                                icon: 'warning',
                                confirmButtonText: 'Ok'
                            });
                    }
                } else {
                    console.log('Información de rol no encontrada en la respuesta:', data);
                    Swal.fire({
                        title: 'Advertencia',
                        text: 'Inicio de sesión exitoso, pero no se pudo determinar el rol del usuario',
                        icon: 'warning',
                        confirmButtonText: 'Ok'
                    });
                }
            })
            .catch(error => {
                console.error('Error de inicio de sesión:', error);
                Swal.fire({
                    title: 'Error',
                    text: error.message || error.error || 'Ocurrió un error al intentar iniciar sesión',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });
            });
    });
});