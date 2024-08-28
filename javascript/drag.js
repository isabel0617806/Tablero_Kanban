document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector(".todo-form");
  const input = document.getElementById("todo-input");
  const lanesContainer = document.getElementById("lanes-container");
  const addSwimLaneBtn = document.getElementById('add-swim-lane-btn');
  const colors = ['color-1', 'color-2', 'color-3', 'color-4', 'color-5'];
  let colorIndex = 0;

  const addTask = (value, tasksContainer) => {
    const newTask = document.createElement("div");
    newTask.classList.add("task-container");

    const taskContent = document.createElement("p");
    taskContent.classList.add("task");
    taskContent.setAttribute("draggable", "true");
    taskContent.innerText = value;

    const taskId = `task-${Date.now()}`;
    newTask.setAttribute("data-task-id", taskId);

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';

    deleteButton.addEventListener("click", () => {
      newTask.parentElement.removeChild(newTask);
      saveTasks();
    });

    taskContent.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", taskId);
      taskContent.classList.add("is-dragging");
    });

    taskContent.addEventListener("dragend", () => {
      taskContent.classList.remove("is-dragging");
    });

    taskContent.addEventListener("click", () => {
      if (taskContent.isContentEditable) {
        taskContent.contentEditable = "false";
        taskContent.style.border = "none";
        taskContent.style.background = "none";
        saveTasks();
      } else {
        taskContent.contentEditable = "true";
        taskContent.style.border = "1px solid #ccc";
        taskContent.style.background = "#f9f9f9";
        taskContent.focus();
      }
    });

    newTask.appendChild(taskContent);
    newTask.appendChild(deleteButton);
    tasksContainer.appendChild(newTask);
    saveTasks();
  };

  const saveTasks = () => {
    const lanesData = Array.from(document.querySelectorAll(".swim-lane")).map(lane => ({
      class: lane.className,
      tasks: Array.from(lane.querySelectorAll(".task-container")).map(task => ({
        id: task.getAttribute("data-task-id"),
        text: task.querySelector(".task").innerText
      }))
    }));
    localStorage.setItem('lanesData', JSON.stringify(lanesData));
  };

  const loadTasks = () => {
    const lanesData = JSON.parse(localStorage.getItem('lanesData')) || [];
    lanesData.forEach(laneData => {
      const lane = document.querySelector(`.${laneData.class}`);
      if (lane) {
        laneData.tasks.forEach(taskData => addTask(taskData.text, lane.querySelector('.tasks-container')));
      }
    });
  };

  const addNewSwimLane = () => {
    const newSwimLane = document.createElement('div');
    newSwimLane.classList.add('swim-lane');
    newSwimLane.classList.add(colors[colorIndex]);
    newSwimLane.innerHTML = `
      <div class="heading" contenteditable="true">Nueva Actividad</div>
      <button class="remove-swim-lane-btn"><i class="fas fa-trash-alt"></i></button>
      <div class="tasks-container"></div>
      <input type="text" class="task-input" placeholder="Nueva Tarea">
    `;
    lanesContainer.appendChild(newSwimLane);

    colorIndex = (colorIndex + 1) % colors.length;

    newSwimLane.querySelector('.remove-swim-lane-btn').addEventListener('click', () => {
      newSwimLane.remove();
      saveTasks();
    });

    newSwimLane.querySelector('.task-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const taskInput = e.target;
        const taskValue = taskInput.value.trim();
        if (taskValue) {
          addTask(taskValue, newSwimLane.querySelector('.tasks-container'));
          taskInput.value = '';
        }
      }
    });

    initializeDraggableTasks();
  };

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
          lane.querySelector('.tasks-container').appendChild(taskToMove);
          taskToMove.setAttribute("data-task-id", taskId);
          saveTasks();
        }
      });
    });

    document.querySelectorAll('.remove-swim-lane-btn').forEach(button => {
      button.addEventListener('click', () => {
        button.parentElement.remove();
        saveTasks();
      });
    });

    document.querySelectorAll('.delete-button').forEach(button => {
      button.addEventListener('click', () => {
        button.parentElement.remove();
        saveTasks();
      });
    });
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = input.value.trim();
    if (!value) return;

    const firstLane = document.querySelector(".swim-lane");
    if (firstLane) addTask(value, firstLane.querySelector('.tasks-container'));

    input.value = "";
  });

  addSwimLaneBtn.addEventListener('click', addNewSwimLane);

  initializeDraggableTasks();
  loadTasks();
});
document.addEventListener('DOMContentLoaded', function() {
  const sidebar = document.querySelector('.sidebar');
  const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');
  const sidebarCloseBtn = document.querySelector('.sidebar-close-btn');

  sidebarToggleBtn.addEventListener('click', function() {
    sidebar.classList.toggle('active');
  });

  sidebarCloseBtn.addEventListener('click', function() {
    sidebar.classList.remove('active');
  });
});

