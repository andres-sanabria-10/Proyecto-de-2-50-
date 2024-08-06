document.addEventListener('DOMContentLoaded', function () {
    const mainContent = document.getElementById('Principal');
    const Buscar = document.getElementById('SearchForDocUser');
    function handleSearchAdmin(e) {
        e.preventDefault();
        const gestionSearchHTML = `
        <div class="container px-5 my-5 text-center" style="background-color: aquamarine; max-height: 90vh; overflow-y: auto">
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
    /*   if (Mobilecalendario) {
           Mobilecalendario.addEventListener('click', handleGestionCalendarioClick);
       }
   */


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
                    <div class="col-md-4 mb-3">
                        <div class="card">
                            <img src="${pet.photo || 'path/to/default/image.jpg'}" class="card-img-top" alt="${pet.name}">
                            <div class="card-body">
                                <h5 class="card-title">${pet.name}</h5>
                                <p class="card-text">Especie: ${pet.species}</p>
                                <div class="d-flex justify-content-between">
                                    <button class="btn btn-primary btn-sm" onclick="editPet(${pet._id})">Editar</button>
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
    
    // Funciones para manejar los clics de los botones
    function editPet(petId) {
        console.log(`Editar mascota con ID: ${petId}`);
        // Aquí puedes agregar la lógica para editar la mascota
    }
    
    function deletePet(petId) {
        console.log(`Eliminar mascota con ID: ${petId}`);
        // Aquí puedes agregar la lógica para eliminar la mascota
    }

})