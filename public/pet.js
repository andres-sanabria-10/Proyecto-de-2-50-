async function createPet() {
    const petData = {
        name: document.getElementById('petName').value,
        photo: document.getElementById('petPhoto').value,
        species: document.getElementById('petSpecies').value,
        breed: document.getElementById('petBreed').value,
        birthdate: document.getElementById('petBirthdate').value,
        gender: document.getElementById('petGender').value,
        weight: document.getElementById('petWeight').value,
        color: document.getElementById('petColor').value,
        allergies: document.getElementById('petAllergies').value,
        dietaryRestrictions: document.getElementById('petDietaryRestrictions').value
    };

    // Validación de campos requeridos
    if (!petData.name || !petData.species) {
        Swal.fire({
            title: 'Error',
            text: 'Nombre y especie son campos obligatorios',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
        return;
    }

    try {
        const response = await fetch('https://veterinaria-5tmd.onrender.com/pet/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(petData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al crear la mascota');
        }

        const result = await response.json();
        
        // Cerrar el modal
        $('#createPetModal').modal('hide');
        
        // Limpiar el formulario
        document.getElementById('createPetForm').reset();
        
        // Mostrar mensaje de éxito
        Swal.fire({
            title: 'Éxito',
            text: result.message || 'Mascota creada exitosamente',
            icon: 'success',
            confirmButtonText: 'Ok'
        });

        // Aquí puedes agregar lógica adicional, como actualizar una lista de mascotas

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