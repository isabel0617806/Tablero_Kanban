// JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const editableTitle = document.getElementById('editable-title');
  
    // Agregar un evento para detectar cambios cuando el usuario haga clic fuera del título
    editableTitle.addEventListener('blur', function() {
      // Aquí podrías guardar el título en una base de datos o almacenamiento local si es necesario
      console.log('Nuevo título guardado: ', editableTitle.textContent.trim());
    });
  
    // Agregar un evento para asegurar que el título se pueda editar con el teclado (por ejemplo, presionando Enter)
    editableTitle.addEventListener('keydown', function(event) {
      if (event.key === 'Enter') {
        event.preventDefault(); // Evita el salto de línea
        editableTitle.blur(); // Simula el clic fuera del título
      }
    });
  });
  
// Función para eliminar el tablero (limpiar el contenido actual)
function deleteBoard() {
    if (confirm('¿Estás seguro de que deseas eliminar el contenido actual?')) {
        const boardContainer = document.getElementById('lanes-container');
        boardContainer.innerHTML = ''; // Limpiar el contenido del contenedor del tablero
    }
}

// Asignar la función de eliminar al botón después de que la página haya cargado
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('delete-board-btn').addEventListener('click', deleteBoard);
});
document.addEventListener('DOMContentLoaded', (event) => {
    // Selecciona el botón usando su ID
    const addBoardBtn = document.getElementById('add-board-btn');

    // Asegúrate de que el botón existe antes de agregar el listener
    if (addBoardBtn) {
        addBoardBtn.addEventListener('click', () => {
            // Recargar la página
            location.reload();
        });
    }
});
document.addEventListener('DOMContentLoaded', (event) => {
    const saveBoardBtn = document.getElementById('save-board-btn');

    if (saveBoardBtn) {
        saveBoardBtn.addEventListener('click', async () => {
            try {
                const boardData = getBoardData();
                const response = await fetch('/save-board', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(boardData)
                });

                if (!response.ok) {
                    throw new Error('Error al guardar el tablero');
                }

                alert('Tablero guardado exitosamente');
            } catch (error) {
                console.error('Error:', error);
                alert('Error al guardar el tablero');
            }
        });
    }
});
