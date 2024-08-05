async function loadPets() {
    try {
        // Primero, obtén los IDs de las mascotas del usuario
        const responseIds = await fetch(`https://veterinaria-5tmd.onrender.com/pet/user/${userId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!responseIds.ok) {
            throw new Error('Error al obtener los IDs de las mascotas');
        }

        const petIds = await responseIds.json();

        const container = document.getElementById('petCardsContainer');
        const template = document.getElementById('petCardTemplate');

        container.innerHTML = ''; // Limpiar el contenedor

        // Para cada ID de mascota, obtén los detalles y crea una tarjeta
        for (const petId of petIds) {
            const response = await fetch(`https://veterinaria-5tmd.onrender.com/pet/${petId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                console.error(`Error al obtener la mascota con ID ${petId}`);
                continue;
            }

            const pet = await response.json();
            const card = template.content.cloneNode(true);
            
            card.querySelector('.pet-photo').src = pet.photo || 'ruta/a/imagen/por/defecto.jpg';
            card.querySelector('.pet-name').textContent = pet.name;
            card.querySelector('.pet-species').textContent = `Especie: ${pet.species}`;
            card.querySelector('.pet-breed').textContent = `Raza: ${pet.breed || 'No especificada'}`;

            container.appendChild(card);
        }
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            title: 'Error',
            text: error.message,
            icon: 'error',
            confirmButtonText: 'Ok'
        });
    }
}

// Cargar las mascotas cuando la página se cargue
document.addEventListener('DOMContentLoaded', loadPets);