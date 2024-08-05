//editar perfil
document.addEventListener('DOMContentLoaded', function() {
    const configuracionBtn = document.getElementById('configuracionBtn');
    const editProfileModal = new bootstrap.Modal(document.getElementById('editProfileModal'));
    const editProfileForm = document.getElementById('editProfileForm');
    const editNameInput = document.getElementById('editName');
    const editEmailInput = document.getElementById('editEmail');
    let userId;

    configuracionBtn.addEventListener('click', function(e) {
        e.preventDefault();
        cargarDatosUsuario();
    });

    function cargarDatosUsuario() {
        const token = localStorage.getItem('token'); // Asume que el token está almacenado en localStorage
        if (!token) {
            alert('No hay token de autorización. Por favor, inicie sesión nuevamente.');
            return;
        }

        fetch('https://veterinaria-5tmd.onrender.com/user/profile', {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then(user => {
            console.log('Datos de usuario recibidos:', user);
            mostrarDatosEnModal(user);
        })
        .catch(error => {
            console.error('Error al cargar datos:', error);
            alert('No se pudieron cargar los datos del usuario');
        });
    }

    function mostrarDatosEnModal(user) {
        userId = user._id;
        
        editNameInput.value = user.name || '';
        editEmailInput.value = user.mail || '';
        
        console.log('Valores establecidos en el modal:');
        console.log('Nombre:', editNameInput.value);
        console.log('Email:', editEmailInput.value);
        
        editProfileModal.show();
        
        setTimeout(() => {
            console.log('Valores en el modal después de mostrarlo:');
            console.log('Nombre:', editNameInput.value);
            console.log('Email:', editEmailInput.value);
        }, 500);
    }

    editProfileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        actualizarPerfil();
    });

    function actualizarPerfil() {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('No hay token de autorización. Por favor, inicie sesión nuevamente.');
            return;
        }

        const updatedData = {
            name: editNameInput.value,
            mail: editEmailInput.value
        };

        fetch(`https://veterinaria-5tmd.onrender.com/user/profile/${userId}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updatedData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al actualizar el perfil');
            }
            return response.json();
        })
        .then(data => {
            console.log('Perfil actualizado:', data);
            alert('Perfil actualizado con éxito');
            editProfileModal.hide();
        })
        .catch(error => {
            console.error('Error al actualizar perfil:', error);
            alert('No se pudo actualizar el perfil');
        });
    }
});