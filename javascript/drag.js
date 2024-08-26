const form = document.querySelector(".todo-form");
const input = document.getElementById("todo-input");
const todoLanes = document.querySelectorAll(".swim-lane");

// Función para crear y añadir una nueva tarea
const addTask = (value, lane) => {
  const newTask = document.createElement("div");
  newTask.classList.add("task-container");

  const taskContent = document.createElement("p");
  taskContent.classList.add("task");
  taskContent.setAttribute("draggable", "true");
  taskContent.innerText = value;

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete-button");
  deleteButton.innerText = "Eliminar";

  // Función para manejar el clic en el botón de eliminar
  deleteButton.addEventListener("click", () => {
    lane.removeChild(newTask);
    saveTasks(); // Guardar los cambios
  });

  // Añadimos eventos de arrastrar y soltar a la tarea
  taskContent.addEventListener("dragstart", () => {
    taskContent.classList.add("is-dragging");
  });

  taskContent.addEventListener("dragend", () => {
    taskContent.classList.remove("is-dragging");
  });

  // Funcionalidad para editar el contenido de la tarea
  taskContent.addEventListener("click", () => {
    if (taskContent.isContentEditable) {
      taskContent.contentEditable = "false";
      taskContent.style.border = "none";
      taskContent.style.background = "none";
      saveTasks(); // Guardar los cambios
    } else {
      taskContent.contentEditable = "true";
      taskContent.style.border = "1px solid #ccc";
      taskContent.style.background = "#f9f9f9";
      taskContent.focus();
    }
  });

  newTask.appendChild(taskContent);
  newTask.appendChild(deleteButton);

  lane.appendChild(newTask);
  saveTasks(); // Guardar las tareas
};

// Función para guardar las tareas en el almacenamiento local
const saveTasks = () => {
  const lanesData = Array.from(todoLanes).map(lane => {
    return {
      class: lane.className,
      tasks: Array.from(lane.querySelectorAll(".task-container")).map(task => task.querySelector(".task").innerText)
    };
  });

  localStorage.setItem('lanesData', JSON.stringify(lanesData));
};

// Función para cargar las tareas desde el almacenamiento local
const loadTasks = () => {
  const lanesData = JSON.parse(localStorage.getItem('lanesData')) || [];

  lanesData.forEach(laneData => {
    const lane = document.querySelector(`.${laneData.class}`);
    if (lane) {
      laneData.tasks.forEach(taskText => addTask(taskText, lane));
    }
  });
};

// Añadimos un evento de escucha al formulario para manejar el envío
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const value = input.value.trim();

  if (!value) return;

  const todoLane1 = document.querySelector(".swim-lane1");
  addTask(value, todoLane1);

  input.value = "";
});

// Función para insertar la tarea en la posición correcta dentro de una columna
const insertAboveTask = (zone, mouseY) => {
  const els = zone.querySelectorAll(".task-container:not(.is-dragging)");

  let closestTask = null;
  let closestOffset = Number.NEGATIVE_INFINITY;

  els.forEach((task) => {
    const { top } = task.getBoundingClientRect();
    const offset = mouseY - top;

    if (offset < 0 && offset > closestOffset) {
      closestOffset = offset;
      closestTask = task;
    }
  });

  return closestTask;
};

// Añadimos eventos de arrastrar sobre las zonas donde se pueden soltar las tareas
todoLanes.forEach((zone) => {
  zone.addEventListener("dragover", (e) => {
    e.preventDefault();

    const bottomTask = insertAboveTask(zone, e.clientY);
    const curTask = document.querySelector(".is-dragging");

    if (!bottomTask) {
      zone.appendChild(curTask.parentElement);
    } else {
      zone.insertBefore(curTask.parentElement, bottomTask);
    }
    saveTasks(); // Guardar los cambios
  });
});

// Inicializamos los eventos para todas las tareas
const initializeDraggableTasks = () => {
  const draggables = document.querySelectorAll(".task");
  draggables.forEach(task => {
    task.addEventListener("dragstart", () => {
      task.classList.add("is-dragging");
    });
    task.addEventListener("dragend", () => {
      task.classList.remove("is-dragging");
    });
  });
};

// Inicializamos los eventos para las tareas ya existentes
initializeDraggableTasks();

// Añadimos la funcionalidad de arrastre a las tareas nuevas
const handleNewTaskDragEvents = () => {
  const newTasks = document.querySelectorAll(".task");
  newTasks.forEach(task => {
    task.addEventListener("dragstart", () => {
      task.classList.add("is-dragging");
    });
    task.addEventListener("dragend", () => {
      task.classList.remove("is-dragging");
    });
  });
};

// Cada vez que se agregue una nueva tarea, actualizamos los eventos
form.addEventListener("submit", () => {
  handleNewTaskDragEvents();
});

// Funcionalidad para editar las cabeceras de swim-lanes
document.addEventListener("DOMContentLoaded", () => {
  const editButtons = document.querySelectorAll(".edit-button");

  editButtons.forEach(button => {
    button.addEventListener("click", () => {
      const heading = button.parentElement;
      const editInput = document.createElement("input");
      editInput.classList.add("edit-input");
      editInput.value = heading.textContent.replace("Editar", "").trim();
      
      // Remover el botón de editar
      button.style.display = "none";
      
      // Añadir el campo de entrada
      heading.appendChild(editInput);
      editInput.style.display = "inline-block";
      
      // Crear y añadir el botón de guardar
      const saveButton = document.createElement("button");
      saveButton.classList.add("edit-button");
      saveButton.textContent = "Guardar";
      
      heading.appendChild(saveButton);
      
      saveButton.addEventListener("click", () => {
        heading.firstChild.textContent = editInput.value + " ";
        
        // Ocultar el campo de entrada y el botón de guardar
        editInput.remove();
        saveButton.remove();
        
        // Mostrar de nuevo el botón de editar
        button.style.display = "inline";
      });
    });
  });

  // Cargar las tareas al cargar la página
  loadTasks();  
});

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.todo-form');
  const input = document.querySelector('#todo-input');
  const lanes = document.querySelectorAll('.swim-lane');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const taskText = input.value.trim();

    if (taskText === '') return;

    // Crear una nueva tarea
    const task = document.createElement('div');
    task.className = 'task';
    task.innerHTML = `
      <span>${taskText}</span>
      <button class="delete-button">Eliminar</button> `
  
    // Agregar la tarea a la primera columna (Por hacer)
    lanes[0].appendChild(task);

    // Limpiar el campo de entrada
    input.value = '';

    // Agregar funcionalidad para eliminar la tarea
    task.querySelector('.delete-button').addEventListener('click', () => {
      task.remove();
// Función para agregar un nuevo swim-lane2
function addNewSwimLane() {
    // Crear el nuevo div con la clase "swim-lane swim-lane2"
    const newSwimLane = document.createElement('div');
    newSwimLane.className = 'swim-lane swim-lane2';
    newSwimLane.innerHTML = '<h3 class="heading">En ejecución</h3>';
    input.newSwimLane

    // Agregar el nuevo swim-lane2 al contenedor
    document.getElementById('lanes-container').appendChild(newSwimLane);
}

// Agregar un event listener al botón que llama a la función
document.getElementById('add-swim-lane-btn').addEventListener('click', addNewSwimLane);
document.addEventListener('DOMContentLoaded', function() {
  function addNewSwimLane() {
      const newSwimLane = document.createElement('div');
      newSwimLane.className = 'swim-lane';
      
      // Crear el input para el título
      const titleInput = document.createElement('input');
      titleInput.type = 'text';
      titleInput.className = 'heading';
      titleInput.value = 'Nuevo título'; // Valor predeterminado para nuevos swim lanes

      // Añadir el input al swim lane
      newSwimLane.appendChild(titleInput);

      // Agregar el swim lane al contenedor
      document.getElementById('lanes-container').appendChild(newSwimLane);
  }

  // Asignar el evento al botón
  document.getElementById('add-swim-lane-btn').addEventListener('click', addNewSwimLane);
});

      
    });
  });
});

