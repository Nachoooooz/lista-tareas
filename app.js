document.getElementById('task-form').addEventListener('submit', (e) => {
    e.preventDefault();

    addTask();
});

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('edit-task')) {
        editTask(e.target.parentElement);
    } else if (e.target.classList.contains('delete-task')) {
        deleteTask(e.target.parentElement);
    } else if (e.target.classList.contains('task-title')) {
        toggleTaskDetails(e.target.nextElementSibling);
    }
});

document.addEventListener('change', (e) => {
    if (e.target.classList.contains('task-completed')) {
        confirmTaskCompletion(e.target);
    }
});

function addTask() {
    const taskTitle = document.getElementById('task-title').value;
    const taskNotes = document.getElementById('task-notes').value;
    const taskDate = document.getElementById('task-date').value;

    const tasksList = document.getElementById('tasks');
    const newTask = document.createElement('li');
    newTask.innerHTML = `
        <input type="checkbox" class="task-completed">
        <span class="task-title" data-notes="${taskNotes}">${taskTitle}</span>
        <button class="edit-task">Editar</button>
        <button class="delete-task">Eliminar</button>
        <div class="task-details">
            <p class="task-notes">${taskNotes}</p>
            <p class="task-date">${taskDate ? 'Fecha: ' + taskDate : 'Sin fecha especificada'}</p>
        </div>
    `;

    tasksList.appendChild(newTask);

    sendNotification('Tarea agregada', {
        body: `Título: ${taskTitle}\nNotas: ${taskNotes}\nFecha: ${taskDate}`,
    });

    document.getElementById('task-form').reset();
}

function editTask(taskElement) {
    const taskTitle = taskElement.querySelector('.task-title').textContent;
    const taskNotes = taskElement.querySelector('.task-notes').textContent;
    const taskDate = taskElement.querySelector('.task-date').textContent;

    document.getElementById('task-title').value = taskTitle;
    document.getElementById('task-notes').value = taskNotes;
    document.getElementById('task-date').value = taskDate;

    taskElement.remove();
}

function deleteTask(taskElement) {
    if (confirm('¿Está seguro de que desea eliminar esta tarea?')) {
        taskElement.remove();
    }
}

function toggleTaskDetails(taskDetailsElement) {
    if (taskDetailsElement.style.display === 'none') {
        taskDetailsElement.style.display = 'block';
    } else {
        taskDetailsElement.style.display = 'none';
    }
}

function confirmTaskCompletion(checkbox) {
    if (checkbox.checked) {
        const confirmMessage = '¿Desea marcar esta tarea como finalizada?';
        if (!confirm(confirmMessage)) {
            checkbox.checked = false;
        }
    }
}

function requestNotificationPermission() {
    if ('Notification' in window) {
        Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
                console.log('Notificaciones permitidas');
            } else {
                console.log('Notificaciones denegadas');
            }
        });
    } else {
        console.log('Las notificaciones no están soportadas en este navegador');
    }
}

requestNotificationPermission();

function sendNotification(title, options) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, options);
    }
}
