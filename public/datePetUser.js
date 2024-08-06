document.addEventListener('DOMContentLoaded', function () {
    const mainContent = document.getElementById('Principal');
    const SolicitudDeCita = document.getElementById('SolicitudDeCita');
    const MobileCita = document.getElementById('MobileCita');

    function handleUserCalendario(e) {
        e.preventDefault();
        const gestionCalendarchHTML = ` 
        <style>
                #calendario {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    gap: 5px;
                }
                .dia {
                    border: 1px solid #dee2e6;
                    padding: 10px;
                    text-align: center;
                    cursor: pointer;
                }
                .dia:hover {
                    background-color: #f8f9fa;
                }
                .dia.disabled {
                    color: #ccc;
                    cursor: not-allowed;
                }
                .dia.available {
                    background-color: #cce5ff;
                }
                .encabezado {
                    grid-column: 1 / -1;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 10px;
                }
                .nombre-dia {
                    font-weight: bold;
                    background-color: #f8f9fa;
                }
                .horario-checkbox {
                    margin-bottom: 10px;
                }
                .leyenda {
                    display: flex;
                    justify-content: center;
                    margin-top: 20px;
                }
                .leyenda-item {
                    display: flex;
                    align-items: center;
                    margin-right: 20px;
                }
                .leyenda-color {
                    width: 20px;
                    height: 20px;
                    margin-right: 5px;
                }
                .veterinario-horarios {
                    margin-bottom: 20px;
                }
                .veterinario-titulo {
                    font-weight: bold;
                    margin-bottom: 10px;
                }
            </style>
        




           <div class="container mt-5" style="max-height: 80vh; overflow-y: auto">
        <h1 class="text-center mb-4">Calendario de Citas Veterinarias</h1>
        <div id="calendario" class="mb-4"></div>
        <div class="leyenda">
            <div class="leyenda-item">
                <div class="leyenda-color" style="background-color: #cce5ff;"></div>
                <span>Citas disponibles</span>
            </div>
            <div class="leyenda-item">
                <div class="leyenda-color" style="background-color: #fff; border: 1px solid #dee2e6;"></div>
                <span>Sin citas disponibles</span>
            </div>
        </div>
    </div>

    <!-- Modal para mostrar horarios -->
    <div class="modal fade" id="horariosModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Horarios disponibles</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row" id="horariosModalBody">
                        <!-- Los horarios se insertarán aquí -->
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn btn-primary" id="confirmarSeleccion">Confirmar selección</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal para la información de la cita -->
    <div class="modal fade" id="citaModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Información de la Cita</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="citaForm">
                        <div class="mb-3">
                            <label for="fecha" class="form-label">Fecha</label>
                            <input type="date" class="form-control" id="fecha" readonly>
                        </div>
                        <div class="mb-3">
                            <label for="hora" class="form-label">Hora</label>
                            <input type="text" class="form-control" id="hora" readonly>
                        </div>
                        <div class="mb-3">
                            <label for="veterinario" class="form-label">Veterinario</label>
                            <input type="text" class="form-control" id="veterinario" readonly>
                        </div>
                       <div class="mb-3">
                            <label for="mascotaId" class="form-label">ID de la Mascota</label>
                            <select class="form-control" id="mascotaId" required>
                                <option value="">Seleccione una mascota</option>
                                <!-- Opciones de mascotas se agregarán aquí dinámicamente -->
                            </select>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" id="procesoClinico" name="appointmentType" value="Proceso Clínico">
                            <label class="form-check-label" for="procesoClinico">Proceso Clínico</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" id="vacunacion" name="appointmentType" value="Vacunación">
                            <label class="form-check-label" for="vacunacion">Vacunación</label>
                         </div>
                            <br>
                         <!-- Select dinámico para opciones específicas -->
                                <div class="mb-3" id="specificProcessContainer" style="display: none;">
                                <label for="specificProcess">Opciones Específicas</label>
                                
                                <select id="specificProcess" class="form-select">
                                    <!-- Opciones dinámicas se añadirán aquí -->
                                </select>
                                </div>

                                <div class="mb-3">
                            <label for="Observacion" class="form-label">Observacion para  la consulta</label>
                            <textarea class="form-control" id="observacion" rows="3" required></textarea>
                        </div>

                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn btn-primary" id="enviarSolicitud">Enviar Solicitud</button>
                </div>
            </div>
        </div>
    </div>
        
        
        `;
        mainContent.innerHTML = gestionCalendarchHTML;

        const procesoClinicoOptions = [
            "Exámenes Físicos de Rutina",
            "Desparasitaciones",
            "Control y Tratamiento de Enfermedades",
            "Esterilización/Castración",
            "Cuidados Dentales",
            "Análisis de Laboratorio",
            "Radiología y Diagnóstico por Imagen",
            "Nutrición y Control de Peso",
            "Tratamiento de Alergias"
        ];

        const vacunacionOptions = [
            "Rabia",
            "Leptospirosis",
            "Bordetella",
            "Calicivirus",
            "Parainfluenza",
            "Virus del Moquillo",
            "Adenovirus"
        ];

        document.querySelectorAll('input[name="appointmentType"]').forEach(radio => {
            radio.addEventListener('change', function () {
                const specificProcessContainer = document.getElementById('specificProcessContainer');
                const specificProcessSelect = document.getElementById('specificProcess');

                // Limpiar opciones anteriores
                specificProcessSelect.innerHTML = "";

                // Añadir nuevas opciones dependiendo de la selección
                let options;
                if (this.value === "Proceso Clínico") {
                    options = procesoClinicoOptions;
                } else if (this.value === "Vacunación") {
                    options = vacunacionOptions;
                }

                // Añadir opciones al select
                if (options) {
                    options.forEach(option => {
                        const opt = document.createElement('option');
                        opt.value = option;
                        opt.textContent = option;
                        specificProcessSelect.appendChild(opt);
                    });
                    specificProcessContainer.style.display = 'block';
                } else {
                    specificProcessContainer.style.display = 'none';
                }
            });
        });







        function cargarMascotas() {
            const token = localStorage.getItem('token');
            let url = 'https://veterinaria-5tmd.onrender.com/pet/data';

            fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('No se encontraron mascotas');
                    }
                    return response.json();
                })
                .then(data => {
                    const mascotaSelect = document.getElementById('mascotaId');
                    mascotaSelect.innerHTML = '<option value="">Seleccione una mascota</option>';

                    if (data && data.length > 0) {
                        data.forEach(mascota => {
                            const option = document.createElement('option');
                            option.value = mascota._id;
                            option.textContent = mascota.name;
                            mascotaSelect.appendChild(option);
                        });
                    } else {
                        const option = document.createElement('option');
                        option.value = "";
                        option.textContent = "No hay mascotas registradas";
                        mascotaSelect.appendChild(option);
                    }
                })
                .catch(error => {
                    console.error('Error al obtener mascotas:', error);
                    const mascotaSelect = document.getElementById('mascotaId');
                    mascotaSelect.innerHTML = '<option value="">Error al cargar mascotas</option>';
                });
        }



        const calendarioEl = document.getElementById('calendario');
        let mesActual = new Date().getMonth();
        let añoActual = new Date().getFullYear();

        function generarCalendario(año, mes) {
            calendarioEl.innerHTML = '';
            const primerDia = new Date(año, mes, 1);
            const ultimoDia = new Date(año, mes + 1, 0);
            const diasEnMes = ultimoDia.getDate();

            const encabezado = document.createElement('div');
            encabezado.classList.add('encabezado');
            encabezado.innerHTML = `
                <button id="mesAnterior" class="btn btn-outline-primary" ${mes === new Date().getMonth() && año === new Date().getFullYear() ? 'disabled' : ''}>&lt;</button>
                <h2 class="mb-0">${new Date(año, mes).toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
                <button id="mesSiguiente" class="btn btn-outline-primary">&gt;</button>
            `;
            calendarioEl.appendChild(encabezado);

            const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
            diasSemana.forEach(dia => {
                const diaEl = document.createElement('div');
                diaEl.classList.add('dia', 'nombre-dia');
                diaEl.textContent = dia;
                calendarioEl.appendChild(diaEl);
            });

            for (let i = 0; i < primerDia.getDay(); i++) {
                const diaEl = document.createElement('div');
                diaEl.classList.add('dia');
                calendarioEl.appendChild(diaEl);
            }

            const hoy = new Date();
            for (let i = 1; i <= diasEnMes; i++) {
                const diaEl = document.createElement('div');
                diaEl.classList.add('dia');
                diaEl.textContent = i;
                const fechaDia = new Date(año, mes, i);
                if (fechaDia < hoy) {
                    diaEl.classList.add('disabled');
                } else {
                    diaEl.addEventListener('click', () => mostrarHorarios(año, mes, i));
                    verificarDisponibilidad(año, mes, i, diaEl);
                }
                calendarioEl.appendChild(diaEl);
            }

            document.getElementById('mesAnterior').addEventListener('click', () => cambiarMes(-1));
            document.getElementById('mesSiguiente').addEventListener('click', () => cambiarMes(1));
        }

        function verificarDisponibilidad(año, mes, dia, diaEl) {
            const fecha = `${año}-${(mes + 1).toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
            let url = `https://veterinaria-5tmd.onrender.com/veterinarySchedule/time-slots?date=${fecha}`;

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (data.timeSlots && data.timeSlots.some(slot => slot.available)) {
                        diaEl.classList.add('available');
                    } else {
                        diaEl.classList.remove('available');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    diaEl.classList.remove('available');
                });
        }

        function cambiarMes(delta) {
            mesActual += delta;
            if (mesActual > 11) {
                mesActual = 0;
                añoActual++;
            } else if (mesActual < 0) {
                mesActual = 11;
                añoActual--;
            }
            generarCalendario(añoActual, mesActual);
        }

        function mostrarHorarios(año, mes, dia) {
            const fecha = `${año}-${(mes + 1).toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
            let url = `https://veterinaria-5tmd.onrender.com/veterinarySchedule/time-slots?date=${fecha}`;

            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('No se encontraron horarios');
                    }
                    return response.json();
                })
                .then(data => {
                    const horariosModalBody = document.getElementById('horariosModalBody');
                    horariosModalBody.innerHTML = '';

                    if (data.timeSlots && data.timeSlots.length > 0) {
                        const horariosPorVeterinario = {};
                        data.timeSlots.forEach(slot => {
                            if (slot.available) {
                                if (!horariosPorVeterinario[slot.veterinarian]) {
                                    horariosPorVeterinario[slot.veterinarian] = [];
                                }
                                horariosPorVeterinario[slot.veterinarian].push(slot);
                            }
                        });

                        const veterinarios = Object.keys(horariosPorVeterinario);
                        veterinarios.forEach((veterinario, index) => {
                            const columnaClass = veterinarios.length > 1 ? 'col-md-6' : 'col-md-12';
                            const veterinarioEl = document.createElement('div');
                            veterinarioEl.classList.add(columnaClass, 'veterinario-horarios');
                            veterinarioEl.innerHTML = `
                                <h6 class="veterinario-titulo">${veterinario}</h6>
                                ${horariosPorVeterinario[veterinario].map(slot => `
                                    <div class="form-check">
                                        <input class="form-check-input" type="radio" name="horario" id="${veterinario}-${slot.time}" value="${slot.time}" data-veterinarian="${veterinario}" data-veterinarian-id="${slot.veterinarianId}">
                                        <label class="form-check-label" for="${veterinario}-${slot.time}">${slot.time}</label>
                                    </div>
                                `).join('')}
                            `;
                            horariosModalBody.appendChild(veterinarioEl);
                        });
                    } else {
                        horariosModalBody.innerHTML = '<p>No hay citas disponibles para este día.</p>';
                    }

                    const modal = new bootstrap.Modal(document.getElementById('horariosModal'));
                    modal.show();

                    document.getElementById('fecha').value = fecha;
                })
                .catch(error => {
                    console.error('Error al obtener horarios:', error);
                    const horariosModalBody = document.getElementById('horariosModalBody');
                    horariosModalBody.innerHTML = '<p>No hay citas disponibles para este día.</p>';
                    const modal = new bootstrap.Modal(document.getElementById('horariosModal'));
                    modal.show();
                });
        }



        document.getElementById('confirmarSeleccion').addEventListener('click', function () {
            const horarioSeleccionado = document.querySelector('input[name="horario"]:checked');
            if (horarioSeleccionado) {
                document.getElementById('hora').value = horarioSeleccionado.value;
                document.getElementById('veterinario').value = horarioSeleccionado.dataset.veterinarian;
                document.getElementById('veterinario').dataset.id = horarioSeleccionado.dataset.veterinarianId;
                cargarMascotas();
                bootstrap.Modal.getInstance(document.getElementById('horariosModal')).hide();
                const citaModal = new bootstrap.Modal(document.getElementById('citaModal'));
                citaModal.show();
            } else {
                alert('Por favor, selecciona un horario.');
            }
        });
        async function loadPets() {
            try {
                const response = await fetch('/api/getPetsByUser', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Ajusta según cómo almacenas el token
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const pets = await response.json();
                    const selectElement = document.getElementById('mascotaId');

                    pets.forEach(pet => {
                        const option = document.createElement('option');
                        option.value = pet._id; // o el atributo que quieras usar como valor
                        option.text = pet.name; // o el atributo que quieras mostrar como texto
                        selectElement.appendChild(option);
                    });
                } else {
                    console.error('Error al obtener las mascotas:', response.statusText);
                }
            } catch (error) {
                console.error('Error en la solicitud para obtener las mascotas:', error);
            }
        }

        document.getElementById('enviarSolicitud').addEventListener('click', function () {
            const fecha = document.getElementById('fecha').value;
            const hora = document.getElementById('hora').value;
            const veterinarioNombreCompleto = document.getElementById('veterinario').value;

            const mascotaId = document.getElementById('mascotaId').value;
            const appointmentType = document.querySelector('input[name="appointmentType"]:checked')?.value;
            const specificProcess = document.getElementById('specificProcess').value;
            const observacion = document.getElementById('observacion').value;

            if (!appointmentType || !mascotaId) {
                alert('Por favor, completa todos los campos.');
                return;
            }

            fetch('https://veterinaria-5tmd.onrender.com/scheduledAppointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`

                },
                body: JSON.stringify({
                    date: fecha,
                    time: hora,

                    petId: mascotaId,
                    veterinarian: veterinarioNombreCompleto,
                    appointmentType: appointmentType,
                    specificProcess: specificProcess,
                    observacion: observacion,
                    status: "Pendiente"

                }),
            })
                .then(response => response.json())
                .then(data => {
                    Swal.fire({
                        title: 'Éxito',
                        text: 'Solicitud de cita enviada correctamente',
                        icon: 'success',
                        confirmButtonText: 'Ok'
                    }).then(() => {
                        // Cerrar el modal
                        const modal = bootstrap.Modal.getInstance(document.getElementById('citaModal'));
                        if (modal) {
                            modal.hide();
                        }
                    });

                });
        });

        generarCalendario(añoActual, mesActual);


    }

    if (SolicitudDeCita) {
        SolicitudDeCita.addEventListener('click', handleUserCalendario);

    }


    
    if (MobileCita) {
        MobileCita.addEventListener('click', handleUserCalendario);
    }

})
