document.addEventListener('DOMContentLoaded', function () {
    const mainContent = document.getElementById('Principal');
    const Procesos = document.getElementById('Procesos');
    const MobileProcesos = document.getElementById('MobileProcesos');

    function handleProcesos(e) {
        e.preventDefault();
        const gestionCalendarchHTML = ` 
         <div class="container mt-5" >
        <h1 class="mb-4">Citas Veterinarias</h1>
        
        
        
        <div class="mb-3">
            <label for="appointmentType" class="form-label">Tipo de Cita:</label>
            <select class="form-select" id="appointmentType">
                <option value="ClinicalProcess">Proceso Clínico</option>
                <option value="Vaccination">Vacunación</option>
            </select>
        </div>
        
        <button class="btn btn-primary" onclick="fetchAppointments()">Buscar Citas</button>
        
        <div class="mt-4" style="max-width: 80vw; max-height: 50vh; overflow-y: auto; overflow-x: auto">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th>Tipo</th>
                        <th>Proceso Específico</th>
                        <th>Dueño</th>
                        <th>Mascota</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody id="appointmentsTableBody">
                    <!-- Los datos de las citas se insertarán aquí -->
                </tbody>
            </table>
        </div>

        <!-- Modal para Historial Médico -->
        <div class="modal fade" id="medicalHistoryModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Guardar Historial Médico</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="medicalHistoryForm">
                            <input type="hidden" id="medicalHistoryPetId" name="petId">
                            <input type="hidden" id="medicalHistoryAppointmentId" name="appointmentId">
                            <div class="mb-3">
                                <label for="reason" class="form-label">Razón</label>
                                <input type="text" class="form-control" id="reason" name="reason" required>
                            </div>
                            <div class="mb-3">
                                <label for="diagnosis" class="form-label">Diagnóstico</label>
                                <input type="text" class="form-control" id="diagnosis" name="diagnosis">
                            </div>
                            <div class="mb-3">
                                <label for="treatment" class="form-label">Tratamiento</label>
                                <input type="text" class="form-control" id="treatment" name="treatment">
                            </div>
                            <div class="mb-3">
                                <label for="notes" class="form-label">Notas</label>
                                <textarea class="form-control" id="notes" name="notes"></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        <button type="button" class="btn btn-primary" onclick="saveMedicalHistory()">Guardar</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal para Vacuna -->
        <div class="modal fade" id="vaccineModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Registrar Vacuna</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="vaccineForm">
                            <input type="hidden" id="vaccinePetId" name="petId">
                            <input type="hidden" id="vaccineAppointmentId" name="appointmentId">
                            <div class="mb-3">
                                <label for="vaccineType" class="form-label">Tipo de Vacuna</label>
                                <input type="text" class="form-control" id="vaccineType" name="vaccineType" required>
                            </div>
                            <div class="mb-3">
                                <label for="nextDueDate" class="form-label">Próxima Fecha</label>
                                <input type="date" class="form-control" id="nextDueDate" name="nextDueDate">
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        <button type="button" class="btn btn-primary" onclick="saveVaccine()">Guardar</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
        
        
        `;
        mainContent.innerHTML = gestionCalendarchHTML;

       
       


      

        function deleteAppointment(appointmentId) {
    const token = document.getElementById('tokenInput').value;
    
    if (confirm('¿Estás seguro de que quieres eliminar esta cita?')) {
        fetch(`https://veterinaria-5tmd.onrender.com/scheduledAppointments/${appointmentId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`, // Ajusta según cómo almacenas el token
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then(data => {
            alert(data.message || 'Cita eliminada con éxito');
            fetchAppointments();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al eliminar la cita: ' + error.message);
        });
    }
}

    




    }

    if (Procesos) {
        Procesos.addEventListener('click', handleProcesos);

    }


    
    if (MobileProcesos) {
        MobileProcesos.addEventListener('click', handleProcesos);
    }

})


function fetchAppointments() {
    const appointmentType = document.getElementById('appointmentType').value;
    const tableBody = document.getElementById('appointmentsTableBody');
    
    tableBody.innerHTML = '';

    const apiUrl = `https://veterinaria-5tmd.onrender.com/scheduledAppointments/${appointmentType}`;

    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // Ajusta según cómo almacenas el token

            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }
        return response.json();
    })
    .then(data => {
        if (data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="8" class="text-center">No se encontraron citas</td></tr>';
            return;
        }
        data.forEach(appointment => {
            const row = tableBody.insertRow();
            row.innerHTML = `
                <td>${new Date(appointment.date).toLocaleDateString()}</td>
                <td>${appointment.time}</td>
                <td>${appointment.appointmentType}</td>
                <td>${appointment.specificProcess}</td>
                <td>${appointment.owner?.name || 'N/A'}</td>
                <td>${appointment.pet?.name || 'N/A'}</td>
                <td>${appointment.status}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="openHistoryModal('${appointment.pet._id}', '${appointment.appointmentType}', '${appointment._id}')">Guardar Historial</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteAppointment('${appointment._id}')">Eliminar</button>
                </td>
            `;
        });
    })
    .catch(error => {
        console.error('Error:', error);
        tableBody.innerHTML = `<tr><td colspan="8" class="text-center">Error al cargar las citas: ${error.message}</td></tr>`;
    });
}


function saveMedicalHistory() {
    const token = document.getElementById('tokenInput').value;
    const form = document.getElementById('medicalHistoryForm');
    const formData = new FormData(form);
    
    fetch('https://veterinaria-5tmd.onrender.com/medicalHistory', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // Ajusta según cómo almacenas el token

            'Content-Type': 'application/json'
        },
        body: JSON.stringify(Object.fromEntries(formData))
    })
    .then(response => response.json())
    .then(data => {
        alert('Historial médico guardado con éxito');
        bootstrap.Modal.getInstance(document.getElementById('medicalHistoryModal')).hide();
        fetchAppointments();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al guardar el historial médico');
    });
}

function saveVaccine() {
    const token = document.getElementById('tokenInput').value;
    const form = document.getElementById('vaccineForm');
    const formData = new FormData(form);
    
    fetch('https://veterinaria-5tmd.onrender.com/vaccinations', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // Ajusta según cómo almacenas el token

            'Content-Type': 'application/json'
        },
        body: JSON.stringify(Object.fromEntries(formData))
    })
    .then(response => response.json())
    .then(data => {
        alert('Vacuna registrada con éxito');
        bootstrap.Modal.getInstance(document.getElementById('vaccineModal')).hide();
        fetchAppointments();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al registrar la vacuna');
    });
}


function openHistoryModal(petId, appointmentType, appointmentId) {
    console.log('Opening modal for:', appointmentType);
    if (appointmentType === 'Proceso Clínico') {
        document.getElementById('medicalHistoryPetId').value = petId;
        document.getElementById('medicalHistoryAppointmentId').value = appointmentId;
        new bootstrap.Modal(document.getElementById('medicalHistoryModal')).show();
    } else if (appointmentType === 'Vacunación') {
        document.getElementById('vaccinePetId').value = petId;
        document.getElementById('vaccineAppointmentId').value = appointmentId;
        new bootstrap.Modal(document.getElementById('vaccineModal')).show();
    }
}