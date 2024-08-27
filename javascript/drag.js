document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector(".todo-form");
  const input = document.getElementById("todo-input");
  const lanesContainer = document.getElementById("lanes-container");
  const addSwimLaneBtn = document.getElementById('add-swim-lane-btn');
  const colors = ['color-1', 'color-2', 'color-3', 'color-4', 'color-5'];
  let colorIndex = 0;

  // Función para crear y añadir una nueva tarea
  const addTask = (value, lane) => {
    const newTask = document.createElement("div");
    newTask.classList.add("task-container");

    const taskContent = document.createElement("p");
    taskContent.classList.add("task");
    taskContent.setAttribute("draggable", "true");
    taskContent.innerText = value;

    // Asignar un ID único a la tarea para facilitar su identificación
    const taskId = `task-${Date.now()}`;
    newTask.setAttribute("data-task-id", taskId);

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>'; // Ícono de eliminar

    // Función para manejar el clic en el botón de eliminar
    deleteButton.addEventListener("click", () => {
      newTask.parentElement.removeChild(newTask);
      saveTasks(); // Guardar los cambios
    });

    // Añadimos eventos de arrastrar y soltar a la tarea
    taskContent.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", taskId); // Transfiere el ID de la tarea
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
    const lanesData = Array.from(document.querySelectorAll(".swim-lane")).map(lane => {
      return {
        class: lane.className,
        tasks: Array.from(lane.querySelectorAll(".task-container")).map(task => ({
          id: task.getAttribute("data-task-id"),
          text: task.querySelector(".task").innerText
        }))
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
        laneData.tasks.forEach(taskData => addTask(taskData.text, lane));
      }
    });
  };

  // Función para crear y añadir un nuevo swim-lane
  const addNewSwimLane = () => {
    const newSwimLane = document.createElement('div');
    newSwimLane.classList.add('swim-lane');
    newSwimLane.classList.add(colors[colorIndex]);
    newSwimLane.innerHTML = `
      <div class="heading" contenteditable="true">Nueva Actividad</div>
      <button class="remove-swim-lane-btn"><i class="fas fa-trash-alt"></i></button> <!-- Ícono de eliminar -->
    `;
    lanesContainer.appendChild(newSwimLane);

    // Incrementa el índice de color y reinícialo si es necesario
    colorIndex = (colorIndex + 1) % colors.length;

    // Añadir eventos a los botones de eliminar
    newSwimLane.querySelector('.remove-swim-lane-btn').addEventListener('click', () => {
      newSwimLane.remove();
      saveTasks(); // Guardar los cambios
    });

    // Inicializar eventos de arrastrar y soltar
    initializeDraggableTasks();
  };

  // Función para inicializar los eventos de arrastrar y soltar
  const initializeDraggableTasks = () => {
    // Configurar tareas arrastrables
    const draggables = document.querySelectorAll(".task");
    draggables.forEach(task => {
      task.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", task.parentElement.getAttribute("data-task-id")); // Transfiere el ID de la tarea
        task.classList.add("is-dragging");
      });
      task.addEventListener("dragend", () => {
        task.classList.remove("is-dragging");
      });
    });

    // Configurar zonas de destino
    const lanes = document.querySelectorAll(".swim-lane");
    lanes.forEach(lane => {
      lane.addEventListener("dragover", (e) => {
        e.preventDefault(); // Permite el drop
      });

      lane.addEventListener("drop", (e) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData("text/plain");
        const taskToMove = document.querySelector(`[data-task-id="${taskId}"]`);

        if (taskToMove) {
          // Elimina la tarea del carril original
          taskToMove.parentElement.removeChild(taskToMove);

          // Añade la tarea al nuevo carril
          lane.appendChild(taskToMove);

          // Asegúrate de que la tarea mantenga el atributo `data-task-id`
          taskToMove.setAttribute("data-task-id", taskId);

          saveTasks(); // Guardar los cambios
        }
      });
    });

    // Inicializar los botones de eliminar
    document.querySelectorAll('.remove-swim-lane-btn').forEach(button => {
      button.addEventListener('click', () => {
        button.parentElement.remove();
        saveTasks(); // Guardar los cambios
      });
    });

    // Inicializar los botones de eliminar en las tareas
    document.querySelectorAll('.delete-button').forEach(button => {
      button.addEventListener('click', () => {
        button.parentElement.remove();
        saveTasks(); // Guardar los cambios
      });
    });
  };

  // Añadir un evento al formulario para manejar el envío
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = input.value.trim();
    if (!value) return;

    const firstLane = document.querySelector(".swim-lane");
    if (firstLane) addTask(value, firstLane);

    input.value = "";
  });

  // Añadir un evento al botón para agregar nuevos swim-lanes
  addSwimLaneBtn.addEventListener('click', addNewSwimLane);

  // Inicializar los eventos para las tareas existentes y los swim-lanes existentes
  initializeDraggableTasks();
  loadTasks();
});
document.addEventListener('DOMContentLoaded', function () {
  const menuBtn = document.getElementById('menu-btn');
  const dropdownMenu = document.getElementById('dropdown-menu');
  const createNewPageBtn = document.getElementById('create-new-page');
  const pagesContainer = document.getElementById('pages-container');

  document.addEventListener('DOMContentLoaded', function () {
    const menuBtn = document.getElementById('menu-btn');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const createNewPageBtn = document.getElementById('create-new-page');
    const addSwimLaneBtn = document.getElementById('add-swim-lane');
    const clearAllTasksBtn = document.getElementById('clear-all-tasks');
    const lanesContainer = document.getElementById('lanes-container');
  
    // Mostrar/ocultar el menú desplegable
    menuBtn.addEventListener('click', () => {
      dropdownMenu.classList.toggle('hidden');
    });
  
    // Crear una nueva página
    createNewPageBtn.addEventListener('click', () => {
      const newPage = document.createElement('div');
      newPage.classList.add('page');
      newPage.innerHTML = `
        <div class="heading" contenteditable="true">Nombre del Tablero</div>
        <div class="tasks-container">
          <!-- Aquí se agregarán las tareas -->
        </div>
      `;
  
      pagesContainer.appendChild(newPage);
  
      // Hacer que el nombre del tablero sea editable
      newPage.querySelector('.heading').addEventListener('click', function () {
        this.contentEditable = 'true';
        this.focus();
      });
  
      // Ocultar el menú desplegable después de agregar una nueva página
      dropdownMenu.classList.add('hidden');
    });
  
    // Agregar una nueva Swim-Lane
    addSwimLaneBtn.addEventListener('click', () => {
      const newSwimLane = document.createElement('div');
      newSwimLane.classList.add('swim-lane');
      newSwimLane.innerHTML = `
        <div class="heading" contenteditable="true">Nueva Actividad</div>
        <button class="remove-swim-lane-btn"><i class="fas fa-trash-alt"></i></button>
      `;
      lanesContainer.appendChild(newSwimLane);
  
      // Añadir eventos al botón de eliminar swim-lane
      newSwimLane.querySelector('.remove-swim-lane-btn').addEventListener('click', () => {
        newSwimLane.remove();
        saveTasks(); // Guardar los cambios
      });
  
      initializeDraggableTasks(); // Inicializar arrastrar y soltar
    });
  
    // Limpiar todas las tareas
    clearAllTasksBtn.addEventListener('click', () => {
      lanesContainer.innerHTML = ''; // Limpiar todas las swim-lanes
      saveTasks(); // Guardar los cambios
    });
  
    // Función para guardar las tareas en el almacenamiento local
    const saveTasks = () => {
      const lanesData = Array.from(document.querySelectorAll(".swim-lane")).map(lane => {
        return {
          class: lane.className,
          tasks: Array.from(lane.querySelectorAll(".task-container")).map(task => ({
            id: task.getAttribute("data-task-id"),
            text: task.querySelector(".task").innerText
          }))
        };
      });
  
      localStorage.setItem('lanesData', JSON.stringify(lanesData));
    };
  
    // Función para inicializar los eventos de arrastrar y soltar
    const initializeDraggableTasks = () => {
      const draggables = document.querySelectorAll(".task");
      draggables.forEach(task => {
        task.addEventListener("dragstart", (e) => {
          e.dataTransfer.setData("text/plain", task.parentElement.getAttribute("data-task-id"));
          task.classList.add("is-dragging");
        });
        task.addEventListener("dragend", () => {
          task.classList.remove("is-dragging");
        });
      });
  
      const lanes = document.querySelectorAll(".swim-lane");
      lanes.forEach(lane => {
        lane.addEventListener("dragover", (e) => {
          e.preventDefault();
        });
  
        lane.addEventListener("drop", (e) => {
          e.preventDefault();
          const taskId = e.dataTransfer.getData("text/plain");
          const taskToMove = document.querySelector(`[data-task-id="${taskId}"]`);
  
          if (taskToMove) {
            taskToMove.parentElement.removeChild(taskToMove);
            lane.appendChild(taskToMove);
            taskToMove.setAttribute("data-task-id", taskId);
            saveTasks(); // Guardar los cambios
          }
        });
      });
  
      document.querySelectorAll('.remove-swim-lane-btn').forEach(button => {
        button.addEventListener('click', () => {
          button.parentElement.remove();
          saveTasks(); // Guardar los cambios
        });
      });
  
      document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', () => {
          button.parentElement.remove();
          saveTasks(); // Guardar los cambios
        });
      });
    };
  
    // Función para manejar el clic fuera del menú desplegable para cerrarlo
    document.addEventListener('click', (e) => {
      if (!menuBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
        dropdownMenu.classList.add('hidden');
      }
    });
  
    // Inicializar eventos para tareas existentes y swim-lanes existentes
    initializeDraggableTasks();
    loadTasks();
  });
  
});

