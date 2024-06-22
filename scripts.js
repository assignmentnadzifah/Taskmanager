// Wait until the DOM is fully loaded before running the functions
document.addEventListener("DOMContentLoaded", () => {
    // Load settings and tasks from local storage
    loadSettingsFromStorage();
    loadTasksFromStorage();
    // Render tasks and completed tasks
    renderTasks();
    renderCompletedTasks();
    
    // Add event listener to the task form to handle task submission
    document.getElementById("task-form").addEventListener("submit", addTask);
    // Add event listener to the settings form to apply settings
    document.getElementById("settings-form").addEventListener("submit", applySettings);
});

// Arrays to store tasks and completed tasks
let tasks = [];
let completedTasks = [];

// Function to show a specific page and hide others
function showPage(pageId) {
    const pages = document.querySelectorAll(".page");
    pages.forEach(page => page.style.display = "none"); // Hide all pages
    document.getElementById(pageId).style.display = "block"; // Show the selected page
}

// Function to add a new task
function addTask(event) {
    event.preventDefault(); // Prevent form submission

    // Get task details from form inputs
    const priority = document.getElementById("priority").value;
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const dueDate = document.getElementById("due-date").value;

    // Create a task object
    const task = { priority, title, description, dueDate };
    tasks.push(task); // Add the task to the tasks array
    saveTasks(); // Save tasks to local storage
    renderTasks(); // Render the updated task list
    showPopupMessage("Task added successfully!"); // Show a success message

    // Reset the task form
    document.getElementById("task-form").reset();
}

// Function to render the list of tasks
function renderTasks() {
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = ""; // Clear the current task list

    // Loop through each task and create a row in the table
    tasks.forEach((task, index) => {
        const taskRow = document.createElement("tr");
        const priorityImage = getPriorityImage(task.priority); // Get the priority icon
        taskRow.innerHTML = `
            <td><img src="${priorityImage}" alt="${task.priority} Priority"></td>
            <td>${task.title}</td>
            <td>${task.description}</td>
            <td>${task.dueDate}</td>
            <td class="actions">
                <button class="edit" onclick="editTask(${index})">Edit</button>
                <button class="complete" onclick="completeTask(${index})">Complete</button>
                <button class="delete" onclick="deleteTask(${index})">Delete</button>
            </td>
        `;
        taskList.appendChild(taskRow); // Add the row to the table
    });
}

// Function to edit a task
window.editTask = function(index) {
    const task = tasks[index];
    // Populate the form with the task details
    document.getElementById('priority').value = task.priority;
    document.getElementById('title').value = task.title;
    document.getElementById('description').value = task.description;
    document.getElementById('due-date').value = task.dueDate;

    tasks.splice(index, 1); // Remove the task from the array
    saveTasks(); // Save the updated tasks to local storage
    renderTasks(); // Render the updated task list
    showPage('create-task'); // Show the task creation page
}

// Function to mark a task as complete
window.completeTask = function(index) {
    const completedTask = tasks.splice(index, 1)[0]; // Remove the task from the tasks array
    completedTasks.push(completedTask); // Add the task to the completed tasks array
    saveTasks(); // Save tasks to local storage
    renderTasks(); // Render the updated task list
    renderCompletedTasks(); // Render the updated completed task list
    showPopupMessage('Task marked as complete!'); // Show a success message
}

// Function to delete a task
window.deleteTask = function(index) {
    tasks.splice(index, 1); // Remove the task from the array
    saveTasks(); // Save the updated tasks to local storage
    renderTasks(); // Render the updated task list
    showPopupMessage('Task deleted successfully!'); // Show a success message
}

// Function to render the list of completed tasks
function renderCompletedTasks() {
    const completedTaskList = document.getElementById("completed-task-list");
    completedTaskList.innerHTML = ""; // Clear the current completed task list

    // Loop through each completed task and create a row in the table
    completedTasks.forEach((task, index) => {
        const taskItem = document.createElement("tr");
        const priorityImage = getPriorityImage(task.priority); // Get the priority icon
        taskItem.innerHTML = `
            <td><img src="${priorityImage}" alt="${task.priority} Priority"></td>
            <td>${task.title}</td>
            <td>${task.description}</td>
            <td>${task.dueDate}</td>
            <td class="actions">
                <button class="undo" onclick="undoTask(${index})">Undo</button>
                <button class="delete" onclick="deleteCompletedTask(${index})">Delete</button>
            </td>
        `;
        completedTaskList.appendChild(taskItem); // Add the row to the table
    });
}

// Function to move a completed task back to the active tasks list
window.undoTask = function(index) {
    const taskToUndo = completedTasks.splice(index, 1)[0]; // Remove the task from the completed tasks array
    tasks.push(taskToUndo); // Add the task back to the tasks array
    saveTasks(); // Save tasks to local storage
    renderTasks(); // Render the updated task list
    renderCompletedTasks(); // Render the updated completed task list
    showPopupMessage('Task moved back to active tasks!'); // Show a success message
}

// Function to delete a completed task
window.deleteCompletedTask = function(index) {
    completedTasks.splice(index, 1); // Remove the task from the array
    saveTasks(); // Save the updated tasks to local storage
    renderCompletedTasks(); // Render the updated completed task list
    showPopupMessage('Completed task deleted successfully!'); // Show a success message
}

// Function to sort tasks by a given criteria
window.sortTasks = function(criteria) {
    if (criteria === 'date') {
        tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)); // Sort tasks by due date
    }
    saveTasks(); // Save the sorted tasks to local storage
    renderTasks(); // Render the updated task list
    showPopupMessage('Tasks sorted by date!'); // Show a success message
}

// Function to show priority buttons for filtering tasks
window.showPriorityButtons = function() {
    const priorityButtons = document.getElementById('priority-buttons');
    priorityButtons.style.display = priorityButtons.style.display === 'none' ? 'block' : 'none'; // Toggle display
}

// Function to filter tasks by priority
window.filterTasks = function(priority) {
    const filteredTasks = tasks.filter(task => task.priority === priority); // Filter tasks by priority
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = ""; // Clear the current task list

    // Loop through each filtered task and create a row in the table
    filteredTasks.forEach((task, index) => {
        const taskRow = document.createElement('tr');
        const priorityImage = getPriorityImage(task.priority); // Get the priority icon
        taskRow.innerHTML = `
            <td><img src="${priorityImage}" alt="${task.priority} Priority"></td>
            <td>${task.title}</td>
            <td>${task.description}</td>
            <td>${task.dueDate}</td>
            <td class="actions">
                <button class="edit" onclick="editTask(${index})">Edit</button>
                <button class="complete" onclick="completeTask(${index})">Complete</button>
                <button class="delete" onclick="deleteTask(${index})">Delete</button>
            </td>
        `;
        taskList.appendChild(taskRow); // Add the row to the table
    });
}

// Function to get the priority icon based on the priority level
function getPriorityImage(priority) {
    switch (priority) {
        case 'low':
            return 'lowpriority.png';
        case 'medium':
            return 'mediumpriority.png';
        case 'high':
            return 'highpriority.png';
        default:
            return '';
    }
}

// Variables to store selected font and theme
let selectedFont = '';
let selectedTheme = '';

// Function to preview the selected font
function previewFont(font) {
    document.body.style.fontFamily = font; // Apply the font to the body
    selectedFont = font; // Store the selected font
    document.getElementById("font-select").value = font; // Set the hidden input value
}

// Function to preview the selected theme
function previewTheme(theme) {
    document.body.className = theme; // Apply the theme to the body
    selectedTheme = theme; // Store the selected theme
    document.getElementById("theme-select").value = theme; // Set the hidden input value
}

// Function to apply settings
function applySettings(event) {
    event.preventDefault(); // Prevent form submission
    const font = document.getElementById("font-select").value;
    const theme = document.getElementById("theme-select").value;

    // Apply the font and theme to the body
    document.body.style.fontFamily = font;
    document.body.className = theme;

    saveSettingsToStorage(font, theme); // Save settings to local storage
    showPopupMessage("Settings applied successfully!"); // Show a success message
}

// Function to save settings to local storage
function saveSettingsToStorage(font, theme) {
    localStorage.setItem("settings", JSON.stringify({ font, theme }));
}

// Function to load settings from local storage
function loadSettingsFromStorage() {
    const settings = JSON.parse(localStorage.getItem("settings"));
    if (settings) {
        // Apply the saved font and theme
        document.body.style.fontFamily = settings.font;
        document.body.className = settings.theme;
        document.getElementById("font-select").value = settings.font;
        document.getElementById("theme-select").value = settings.theme;
    }
}

// Function to save tasks to local storage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
}

// Function to load tasks from local storage
function loadTasksFromStorage() {
    const storedTasks = JSON.parse(localStorage.getItem("tasks"));
    const storedCompletedTasks = JSON.parse(localStorage.getItem("completedTasks"));
    tasks = storedTasks ? storedTasks : [];
    completedTasks = storedCompletedTasks ? storedCompletedTasks : [];
}

// Function to show a popup message
function showPopupMessage(message) {
    const popupBar = document.getElementById("popup-bar");
    popupBar.textContent = message; // Set the message text
    popupBar.style.display = "block"; // Show the popup bar
    setTimeout(() => {
        popupBar.style.display = "none"; // Hide the popup bar after 3 seconds
    }, 3000);
}
