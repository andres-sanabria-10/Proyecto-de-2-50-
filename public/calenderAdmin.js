document.addEventListener('DOMContentLoaded', function () {
    const mainContent = document.getElementById('Principal');
    const calendario = document.getElementById('Calendario');
    const Mobilecalendario = document.getElementById('MobileCalendario');
    const Inicio = document.getElementById('inicioLink');
    const MobileInicio = document.getElementById('MobileinicioLink');




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

    // Mostrar la vista de inicio por defecto
    handleInicioClick();

    function handleGestionCalendarioClick(e) {
        e.preventDefault();
        const gestioncalemdarioHTML = `
        <style>
        .time-slot {
            width: 100px;
            height: 50px;
            margin: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
        }
        .time-slot.selected {
            background-color: #007bff;
            color: white;
        }
        .time-slot.unavailable {
            background-color: #dc3545;
            color: white;
        }
    </style>
        
           
    <div class="container mt-3" style="overflow-y: auto; max-height: 100vh; background-color: #f8f9fa;">
  <div class="row">
    <div class="col-lg-8 col-md-10 col-sm-12 mx-auto">
      <h1 class="mb-4">Programación de horarios veterinarios</h1>

      
      <div class="mb-3">
        <label for="datePicker" class="form-label">Seleccione la fecha:</label>
        <input type="date" class="form-control" id="datePicker">
      </div>
      <button id="confirmDate" class="btn btn-primary mb-3">Confirmar Fecha</button>

      <div id="timeSlots" class="d-none">
        <h2>Seleccione los horarios:</h2>
        <div id="timeSlotsContainer" class="d-flex flex-wrap"></div>
        <button id="saveSchedule" class="btn btn-success mt-3">Guardar Horarios</button>
      </div>

 
      <div id="deleteSection" class="mt-5">
        <h2>Eliminar Horarios</h2>
        <div class="mb-3">
          <label for="deleteDatePicker" class="form-label">Seleccione la fecha:</label>
          <input type="date" class="form-control" id="deleteDatePicker">
        </div>
        <button id="loadTimeSlotsToDelete" class="btn btn-primary mb-3">Cargar Horarios</button>
        <div id="timeSlotsToDelete" class="d-flex flex-wrap"></div>
        <button id="deleteSelectedSlots" class="btn btn-danger mt-3 d-none">Eliminar Seleccionados</button>
      </div>
    </div>
  </div>
</div>
        
        `;
        mainContent.innerHTML = gestioncalemdarioHTML;
        initializeCalendarManagement();
    }

    if (calendario) {
        calendario.addEventListener('click', handleGestionCalendarioClick);
    }
    if (Mobilecalendario) {
        Mobilecalendario.addEventListener('click', handleGestionCalendarioClick);
    }
    function initializeCalendarManagement() {
        const tokenInput = document.getElementById('tokenInput');
        const datePicker = document.getElementById('datePicker');
        const confirmDateBtn = document.getElementById('confirmDate');
        const timeSlots = document.getElementById('timeSlots');
        const timeSlotsContainer = document.getElementById('timeSlotsContainer');
        const saveScheduleBtn = document.getElementById('saveSchedule');
        const deleteDatePicker = document.getElementById('deleteDatePicker');
        const loadTimeSlotsToDeleteBtn = document.getElementById('loadTimeSlotsToDelete');
        const timeSlotsToDelete = document.getElementById('timeSlotsToDelete');
        const deleteSelectedSlotsBtn = document.getElementById('deleteSelectedSlots');

        const today = new Date().toISOString().split('T')[0];
        datePicker.min = today;
        deleteDatePicker.min = today;

        confirmDateBtn.addEventListener('click', handleConfirmDate);
        saveScheduleBtn.addEventListener('click', handleSaveSchedule);
        loadTimeSlotsToDeleteBtn.addEventListener('click', handleLoadTimeSlotsToDelete);
        deleteSelectedSlotsBtn.addEventListener('click', handleDeleteSelectedSlots);
    }



    function fetchWithAuth(url, options = {}) {

        return fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
        });
    }

    function handleConfirmDate() {
        const datePicker = document.getElementById('datePicker');
        const timeSlots = document.getElementById('timeSlots');
        if (datePicker.value) {
            fetchWithAuth(`https://veterinaria-5tmd.onrender.com/veterinarySchedule/all-timeslots?date=${datePicker.value}`)
                .then(response => response.json())
                .then(data => {
                    timeSlots.classList.remove('d-none');
                    generateTimeSlots(data.timeSlots);
                })
                .catch(error => {
                    console.error('Error al cargar los horarios existentes:', error);
                    generateTimeSlots();
                });
        } else {
            Swal.fire({
                title: 'Atención',
                text: 'Por favor, seleccione una fecha.',
                icon: 'warning',
                confirmButtonText: 'Ok'
            });
        }
    }

    function generateTimeSlots() {
        const timeSlotsContainer = document.getElementById('timeSlotsContainer');
        timeSlotsContainer.innerHTML = '';
        for (let hour = 8; hour <= 18; hour++) {
            const timeSlot = document.createElement('div');
            timeSlot.className = 'time-slot btn btn-outline-primary';
            timeSlot.textContent = `${hour}:00`;
            timeSlot.addEventListener('click', function () {
                this.classList.toggle('selected');
            });
            timeSlotsContainer.appendChild(timeSlot);
        }
    }

    function handleSaveSchedule() {
        const datePicker = document.getElementById('datePicker');
        const timeSlots = document.getElementById('timeSlots');
        const selectedDate = datePicker.value;
        const selectedSlots = Array.from(document.querySelectorAll('#timeSlotsContainer .time-slot.selected'))
            .map(slot => slot.textContent);

        if (selectedSlots.length === 0) {
            Swal.fire({
                title: 'Atención',
                text: 'Por favor, seleccione al menos un horario.',
                icon: 'warning',
                confirmButtonText: 'Ok'
            });
            return;
        }

        const scheduleData = {
            date: selectedDate,
            timeSlots: selectedSlots
        };

        fetchWithAuth('https://veterinaria-5tmd.onrender.com/veterinarySchedule', {
            method: 'POST',
            body: JSON.stringify(scheduleData),
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => { throw err; });
                }
                return response.json();
            })
            .then(data => {
                console.log('Success:', data);
                Swal.fire({
                    title: 'Éxito',
                    text: 'Horarios guardados con éxito.',
                    icon: 'success',
                    confirmButtonText: 'Ok'
                });
                datePicker.value = '';
                timeSlots.classList.add('d-none');
            })
            .catch((error) => {
                console.error('Error:', error);
                Swal.fire({
                    title: 'Error',
                    text: `Error al guardar los horarios: ${error.message || 'Por favor, intente de nuevo.'}`,
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });
            });
    }

    function handleLoadTimeSlotsToDelete() {
        const deleteDatePicker = document.getElementById('deleteDatePicker');
        const timeSlotsToDelete = document.getElementById('timeSlotsToDelete');
        const deleteSelectedSlotsBtn = document.getElementById('deleteSelectedSlots');
        const dateToDelete = deleteDatePicker.value;
        if (!dateToDelete) {
            Swal.fire({
                title: 'Atención',
                text: 'Por favor, seleccione una fecha para cargar horarios.',
                icon: 'warning',
                confirmButtonText: 'Ok'
            });
            return;
        }

        fetchWithAuth(`https://veterinaria-5tmd.onrender.com/veterinarySchedule/all-timeslots?date=${dateToDelete}`)
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => { throw err; });
                }
                return response.json();
            })
            .then(data => {
                timeSlotsToDelete.innerHTML = '';
                if (data.schedules && data.schedules.length > 0) {
                    data.schedules.forEach(schedule => {
                        const veterinarianName = document.createElement('h3');
                        veterinarianName.textContent = schedule.veterinarianName;
                        timeSlotsToDelete.appendChild(veterinarianName);

                        schedule.timeSlots.forEach(slot => {
                            const timeSlot = document.createElement('div');
                            timeSlot.className = 'time-slot btn btn-outline-danger';
                            timeSlot.textContent = slot.time;
                            timeSlot.addEventListener('click', function () {
                                this.classList.toggle('selected');
                            });
                            timeSlotsToDelete.appendChild(timeSlot);
                        });
                    });
                    deleteSelectedSlotsBtn.classList.remove('d-none');
                } else {
                    timeSlotsToDelete.innerHTML = '<p>No hay horarios disponibles para esta fecha.</p>';
                    deleteSelectedSlotsBtn.classList.add('d-none');
                }
            })
            .catch(error => {
                console.error('Error al cargar los horarios:', error);
                Swal.fire({
                    title: 'Error',
                    text: `Error al cargar los horarios: ${error.message || 'Por favor, intente de nuevo.'}`,
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });
            });
    }

    function handleDeleteSelectedSlots() {
        const deleteDatePicker = document.getElementById('deleteDatePicker');
        const timeSlotsToDelete = document.getElementById('timeSlotsToDelete');
        const dateToDelete = deleteDatePicker.value;
        const slotsToDelete = Array.from(document.querySelectorAll('#timeSlotsToDelete .time-slot.selected'))
            .map(slot => slot.textContent);

        if (slotsToDelete.length === 0) {
            Swal.fire({
                title: 'Atención',
                text: 'Por favor, seleccione al menos un horario para eliminar.',
                icon: 'warning',
                confirmButtonText: 'Ok'
            });
            return;
        }

        fetchWithAuth('https://veterinaria-5tmd.onrender.com/veterinarySchedule/remove-time-slots', {
            method: 'POST',
            body: JSON.stringify({ date: dateToDelete, timeSlots: slotsToDelete }),
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => { throw err; });
                }
                return response.json();
            })
            .then(data => {
                Swal.fire({
                    title: 'Éxito',
                    text: 'Horarios seleccionados eliminados.',
                    icon: 'success',
                    confirmButtonText: 'Ok'
                });
                handleLoadTimeSlotsToDelete(); // Recargar los horarios
            })
            .catch((error) => {
                console.error('Error al eliminar los horarios:', error);
                Swal.fire({
                    title: 'Error',
                    text: `Error al eliminar los horarios: ${error.message || 'Por favor, intente de nuevo.'}`,
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });
            });
    }

});

