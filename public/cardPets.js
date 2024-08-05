async function getPetsByUser() {
    try {
        const token = localStorage.getItem('token');
        console.log('Token:', token); // Imprime el token
        const response = await fetch('https://veterinaria-5tmd.onrender.com/pet/data', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al obtener las mascotas');
        }

        const pets = await response.json();
        displayPets(pets);
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

function displayPets(pets) {
    const container = document.getElementById('petCardsContainer');
    const template = document.getElementById('petCardTemplate');
    
    container.innerHTML = ''; // Clear existing content

    pets.forEach(pet => {
        const clone = template.content.cloneNode(true);
        
        clone.querySelector('.pet-photo').src = pet.photo || 'path/to/default/image.jpg';
        clone.querySelector('.pet-name').textContent = pet.name;
        clone.querySelector('.pet-species').textContent = `Especie: ${pet.species}`;
        clone.querySelector('.pet-breed').textContent = `Raza: ${pet.breed || 'No especificada'}`;

        clone.querySelector('.edit-pet').addEventListener('click', () => editPet(pet._id));
        clone.querySelector('.delete-pet').addEventListener('click', () => deletePet(pet._id));

        container.appendChild(clone);
    });
}

function editPet(petId) {
    // Implement edit functionality
    console.log('Editar mascota:', petId);
}

function deletePet(petId) {
    // Implement delete functionality
    console.log('Eliminar mascota:', petId);
}

// Call this function when the page loads or when you need to refresh the pet list
getPetsByUser();