document.addEventListener('DOMContentLoaded', function () {
    const mainContent = document.getElementById('Principal');
    const Buscar = document.getElementById('SearchForDocUser');
    const MobileBuscar = document.getElementById('MobileBuscar');
    function handleSearchAdmin(e) {
        e.preventDefault();
        const gestionSearchHTML = `
        <div class="container px-5 my-5 text-center" id="probaractualizar" style="background-color: aquamarine; max-height: 90vh; overflow-y: auto">
                <div class="mt-3">
                    <label for="documentInput" class="form-label">Ingrese el documento de identidad:</label>
                    <input type="text" id="documentInput" class="form-control" placeholder="Número de documento">
                    <button id="searchButton" class="btn btn-primary mt-2">Buscar Mascotas</button>
                </div>
                <div id="searchResults" class="mt-3"></div>
            </div>                
        </div>
        
        `;
        mainContent.innerHTML = gestionSearchHTML;
        initializeSearchFunctionality();
    }

    if (Buscar) {
        Buscar.addEventListener('click', handleSearchAdmin);
    }
       if (MobileBuscar) {
           MobileBuscar.addEventListener('click', handleSearchAdmin);
       }
   




})


function initializeSearchFunctionality() {
    const searchButton = document.getElementById('searchButton');
    const documentInput = document.getElementById('documentInput');
    const searchResults = document.getElementById('searchResults');

    searchButton.addEventListener('click', function () {
        const documentNumber = documentInput.value.trim();
        if (documentNumber) {
            searchPetsByDocument(documentNumber);
        } else {
            searchResults.innerHTML = '<p class="text-danger">Por favor, ingrese un número de documento válido.</p>';
        }
    });
}

async function searchPetsByDocument(documentNumber) {
    try {
        const response = await fetch(`https://veterinaria-5tmd.onrender.com/pet/${documentNumber}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Añade aquí cualquier otro encabezado que puedas necesitar
            }
        });

        if (!response.ok) {
            if (response.status === 404) {
                searchResults.innerHTML = '<p class="text-warning">No se encontraron mascotas para este usuario.</p>';
                return;
            }
            throw new Error('Error en la respuesta del servidor');
        }

        const pets = await response.json();
        displaySearchResults(pets);
    } catch (error) {
        console.error('Error al buscar mascotas:', error);
        searchResults.innerHTML = '<p class="text-danger">Error al buscar mascotas. Por favor, intente nuevamente.</p>';
    }
}

function displaySearchResults(pets) {
    const searchResults = document.getElementById('searchResults');

    if (pets.length === 0) {
        searchResults.innerHTML = '<p class="text-center">No se encontraron mascotas para este usuario.</p>';
    } else {
        let resultsHTML = '<div class="row">';
        pets.forEach(pet => {
            resultsHTML += `
                <div class="col-md-4 mb-3" id="probaractualizar">
                    <div class="card">
                        <img src="${pet.photo || 'path/to/default/image.jpg'}" class="card-img-top" alt="${pet.name}" style="height: 50vh;">
                        <div class="card-body">
                            <h5 class="card-title">${pet.name}</h5>
                            <p class="card-text">Especie: ${pet.species}</p>
                            <div class="d-flex justify-content-between">
                                <button class="btn btn-primary btn-sm" onclick="editPet('${pet._id}')">Editar</button>
                                <button class="btn btn-danger btn-sm" onclick="deletePet(${pet._id})">Historial</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        resultsHTML += '</div>';
        searchResults.innerHTML = resultsHTML;
    }
}
function editPet(petId) {
    // Obtener la información de la mascota
    fetch(`https://veterinaria-5tmd.onrender.com/pet/info/${petId}`)
        .then(response => response.json())
        .then(pet => {
            // Crear el modal dinámicamente
            const modalHTML = `
                <div class="modal fade" id="editPetModal" tabindex="-1" role="dialog" aria-labelledby="editPetModalLabel" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="editPetModalLabel">Editar Mascota</h5>
                                 <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>

                            </div>
                            <div class="modal-body">
                                <form id="editPetForm">
                                    <input type="hidden" id="editPetId" value="${pet._id}">
                                    <div class="form-group">
                                        <label for="editPetName">Nombre</label>
                                        <input type="text" class="form-control" id="editPetName" value="${pet.name}" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="editPetEspecie">Especie</label>
                                        <input type="text" class="form-control" id="editPetEspecie" value="${pet.species}" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="editPetBreed">Raza</label>
                                        <input type="text" class="form-control" id="editPetBreed" value="${pet.breed}" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="editPetGender">Género</label>
                                        <input type="text" class="form-control" id="editPetGender" value="${pet.gender}" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="editPetweight">Peso</label>
                                        <input type="number" class="form-control" id="editPetweight" value="${pet.weight}" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="editPetallergies">Alergias</label>
                                        <input type="text" class="form-control" id="editPetallergies" value="${pet.allergies}" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="editPetdietaryRestrictions">Dieta</label>
                                        <input type="text" class="form-control" id="editPetdietaryRestrictions" value="${pet.dietaryRestrictions}" required>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"aria-label="Close">Cerrar</button>
                                <button type="button" class="btn btn-primary" onclick="updatePet()">Actualizar</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Agregar el modal al body
            document.body.insertAdjacentHTML('beforeend', modalHTML);

            // Mostrar el modal
            $('#editPetModal').modal('show');

            // Eliminar el modal del DOM cuando se cierre
            $('#editPetModal').on('hidden.bs.modal', function (e) {
                $(this).remove();
            });
        })
        .catch(error => console.error('Error:', error));
}


function updatePet() {
    const petId = document.getElementById('editPetId').value;
    const updatedPet = {
        name: document.getElementById('editPetName').value,
        species: document.getElementById('editPetEspecie').value,
        breed: document.getElementById('editPetBreed').value,
        gender: document.getElementById('editPetGender').value,
        weight: document.getElementById('editPetweight').value,
        allergies: document.getElementById('editPetallergies').value,
        dietaryRestrictions: document.getElementById('editPetdietaryRestrictions').value
    };

    fetch(`https://veterinaria-5tmd.onrender.com/pet/${petId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPet)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Mascota actualizada:', data);
            // Cerrar el modal
            $('#editPetModal').modal('hide');

            // Mostrar SweetAlert2
            Swal.fire({
                title: 'Éxito',
                text: 'Mascota actualizada exitosamente.',
                icon: 'success',
                confirmButtonText: 'Ok'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Recargar las tarjetas de las mascotas
                    reloadPetCards();
                    
                }
            });
        })
        .catch((error) => {
            console.error('Error:', error);
            Swal.fire({
                title: 'Error',
                text: 'Hubo un error al actualizar la mascota. Por favor, intenta de nuevo.',
                icon: 'error',
                confirmButtonText: 'Ok'
            });
        });
}

function reloadPetCards() {
    const documentInput = document.getElementById('documentInput');
    if (documentInput) {
        const documentNumber = documentInput.value.trim();
        if (documentNumber) {
            searchPetsByDocument(documentNumber);
        }
    }
}