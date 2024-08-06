document.addEventListener('DOMContentLoaded', function () {
    const mainContent = document.getElementById('Principal');
    const Mascotas = document.getElementById('Mascotas');
    const MobileMascotas = document.getElementById('MobileMascotas');
    const Inicio = document.getElementById('Inicio');
    const MobileInicio = document.getElementById('MobileInicio');

    const contenidoInicial = `
    <div class="container px-5 my-5 text-center">
              <img src="/img/fondo.jpg" class="img-fluid" alt="">
          </div>
`;

    function handleInicioClick(e) {
        if (e) e.preventDefault();
        mainContent.innerHTML = contenidoInicial;
    }

    if (Inicio) {
        Inicio.addEventListener('click', handleInicioClick);
    }
    if (MobileInicio) {
        MobileInicio.addEventListener('click', handleInicioClick);
    }


    function handleUserMascotas(e) {
        e.preventDefault();
        const gestionSearchHTML = `
       <div class="container w-76 mt-5">
                    <button type="button" class="btn btn-primary" data-bs-toggle="modal"
                        data-bs-target="#createPetModal">
                        Crear Mascota
                    </button>
                </div>

                <div class="modal fade" id="createPetModal" tabindex="-1" aria-labelledby="createPetModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="createPetModalLabel">Crear Nueva Mascota</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                                    <span class="visually-hidden">Cerrar</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <form id="createPetForm">
                                    <div class="mb-3">
                                        <label for="petName" class="form-label">Nombre*</label>
                                        <input type="text" class="form-control" id="petName" required>
                                    </div>
                                    <div class="mb-3">
                                        <label for="petPhoto" class="form-label">Foto URL</label>
                                        <input type="url" class="form-control" id="petPhoto">
                                    </div>
                                    <div class="mb-3">
                                        <label for="petSpecies" class="form-label">Especie*</label>
                                        <select class="form-control" id="petSpecies" required>
                                            <option value="" disabled selected>Selecciona una especie</option>
                                            <option value="perro">Perro</option>
                                            <option value="gato">Gato</option>
                                            <option value="vaca">Vaca</option>
                                            <option value="caballo">Caballo</option>
                                            <option value="ave">Ave</option>
                                        </select>
                                    </div>
                                    <div class="mb-3">
                                        <label for="petBreed" class="form-label">Raza</label>
                                        <input type="text" class="form-control" id="petBreed">
                                    </div>
                                    <div class="mb-3">
                                        <label for="petBirthdate" class="form-label">Fecha de nacimiento</label>
                                        <input type="date" class="form-control" id="petBirthdate">
                                    </div>
                                    <div class="mb-3">
                                        <label for="petGender" class="form-label">Género</label>
                                        <select class="form-select" id="petGender">
                                            <option value="">Seleccionar</option>
                                            <option value="Macho">Macho</option>
                                            <option value="Hembra">Hembra</option>
                                        </select>
                                    </div>
                                    <div class="mb-3">
                                        <label for="petWeight" class="form-label">Peso (kg)</label>
                                        <input type="number" class="form-control" id="petWeight" step="0.1">
                                    </div>
                                    <div class="mb-3">
                                        <label for="petColor" class="form-label">Color</label>
                                        <input type="text" class="form-control" id="petColor">
                                    </div>
                                    <div class="mb-3">
                                        <label for="petAllergies" class="form-label">Alergias</label>
                                        <textarea class="form-control" id="petAllergies"></textarea>
                                    </div>
                                    <div class="mb-3">
                                        <label for="petDietaryRestrictions" class="form-label">Restricciones
                                            dietéticas</label>
                                        <textarea class="form-control" id="petDietaryRestrictions"></textarea>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                                <button type="button" class="btn btn-primary" onclick="createPet()">Guardar</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="container  px-5 my-2 " style="background-color: aqua; width:85% ">
                    <div class="row row-cols-1 row-cols-md-3 g-4" id="petCardsContainer">
                        <!-- Las tarjetas de mascotas se insertarán aquí dinámicamente -->
                    </div>
                </div>

                <!-- Template para la tarjeta de mascota -->
                <template id="petCardTemplate">
                    <div class="col">
                        <div class="card h-100">
                            <img src="" class="card-img-top pet-photo" alt="Foto de la mascota" style="height: 50%;">
                            <div class="card-body">
                                <h5 class="card-title pet-name"></h5>
                                <p class="card-text pet-species"></p>
                                <p class="card-text pet-breed"></p>
                            </div>
                            <div class="card-footer">
                                <button class="btn btn-primary btn-sm me-2 edit-pet">Vacunas</button>
                                <button class="btn btn-danger btn-sm delete-pet">Historial</button>
                            </div>
                        </div>
                    </div>
                </template>
        
        `;
        mainContent.innerHTML = gestionSearchHTML;
        getPetsByUser();
    }

    if (Mascotas) {
        Mascotas.addEventListener('click', handleUserMascotas);

    }
    if (MobileMascotas) {
        MobileMascotas.addEventListener('click', handleUserMascotas);
    }
})

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
        await getPetsByUser();

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


