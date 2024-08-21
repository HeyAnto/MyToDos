document.addEventListener('DOMContentLoaded', () => {

    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task');
    const taskList = document.getElementById('task-list');
    const taskCount = document.getElementById('task-count');
    const deleteAllBtn = document.getElementById('delete-all');
    const filterCompleteBtn = document.getElementById('filter-complete');
    const filterIncompleteBtn = document.getElementById('filter-incomplete');

    // Charger les tâches depuis le localStorage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Sauvegarder les tâches dans le localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Activer/Désactiver le bouton Add
    taskInput.addEventListener('input', () => {
        addTaskBtn.disabled = taskInput.value.trim().length === 0;
    });

    // Ajouter une tâche
    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText) {
            const newTask = { text: taskText, completed: false };
            tasks.push(newTask);
            taskInput.value = '';
            addTaskBtn.disabled = true;
            renderTasks();
            saveTasks();
        }
    }

    addTaskBtn.addEventListener('click', addTask);

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // Supprimer toutes les tâches
    deleteAllBtn.addEventListener('click', () => {
        tasks = [];
        renderTasks();
        saveTasks();
    });

    // Filtrer les tâches
    filterCompleteBtn.addEventListener('click', () => {
        filterCompleteBtn.classList.toggle('active');
        filterIncompleteBtn.classList.remove('active');
        renderTasks();
    });

    filterIncompleteBtn.addEventListener('click', () => {
        filterIncompleteBtn.classList.toggle('active');
        filterCompleteBtn.classList.remove('active');
        renderTasks();
    });

    // Rendre une tâche complète ou incomplète
    taskList.addEventListener('click', (e) => {
        if (e.target.closest('.check-btn')) {
            const index = e.target.closest('.task').dataset.index;
            tasks[index].completed = !tasks[index].completed;
            renderTasks();
            saveTasks();
        } else if (e.target.closest('.delete-btn')) {
            const index = e.target.closest('.task').dataset.index;
            tasks.splice(index, 1);
            renderTasks();
            saveTasks();
        } else if (e.target.closest('.task')) {
            const index = e.target.closest('.task').dataset.index;
            tasks[index].completed = !tasks[index].completed;
            renderTasks();
            saveTasks()
        }
    });

    // Affichage des tâches
    function renderTasks() {
        taskList.innerHTML = '';

        const filteredTasks = tasks.filter(task => {
            if (filterCompleteBtn.classList.contains('active')) {
                return task.completed;
            }
            if (filterIncompleteBtn.classList.contains('active')) {
                return !task.completed;
            }
            return true;
        });

        filteredTasks.forEach((task, index) => {
            const taskDiv = document.createElement('div');
            taskDiv.classList.add('task');
            if (task.completed) {
                taskDiv.classList.add('completed');
            }
            taskDiv.dataset.index = index;

            const checkBtn = document.createElement('button');
            checkBtn.classList.add('check-btn');
            checkBtn.innerHTML = `
                <svg id="Calque_1" data-name="Calque 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11.22 8"><defs><style>.cls-1{fill-rule:evenodd;}</style></defs><path class="cls-1" d="M11.75.86a1.15,1.15,0,0,0-1.67,0L5.31,5.63,2.92,3.25a1.15,1.15,0,0,0-1.67,0,1.15,1.15,0,0,0,0,1.67L4.47,8.14a1.09,1.09,0,0,0,.84.36,1.08,1.08,0,0,0,.83-.36l5.61-5.61A1.15,1.15,0,0,0,11.75.86Z" transform="translate(-0.89 -0.5)"/></svg>`;
            taskDiv.appendChild(checkBtn);

            const taskText = document.createElement('p');
            taskText.classList.add('task-text');
            taskText.textContent = task.text;
            taskDiv.appendChild(taskText);

            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('delete-btn');
            deleteBtn.innerHTML = `
                <svg id="Calque_1" data-name="Calque 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 11"><defs><style>.cls-1{fill-rule:evenodd;}</style></defs><path class="cls-1" d="M5.48,4.13,9.33.29a1,1,0,0,1,1.38,0,1,1,0,0,1,0,1.38L6.87,5.52l3.84,3.84a1,1,0,0,1-1.35,1.35L5.52,6.87,1.67,10.71a1,1,0,0,1-1.38,0,1,1,0,0,1,0-1.38L4.13,5.48.29,1.64A.94.94,0,0,1,.29.29a.94.94,0,0,1,1.35,0Z" transform="translate(0 0)"/></svg>`;
            taskDiv.appendChild(deleteBtn);

            taskList.appendChild(taskDiv);
        });

        updateTaskCount();
    }

    // Nombre de tâches restantes
    function updateTaskCount() {
        const remainingTasks = tasks.filter(task => !task.completed).length;
        taskCount.textContent = `You have ${remainingTasks} task(s) to complete`;
    }

    renderTasks();
});