document.addEventListener('DOMContentLoaded', function() {
    const editableTitle = document.getElementById('editable-title');

    // Variable para mantener el estado de la voz
    let isSpeechEnabled = true;
    let currentUtterance = null; // Para controlar la repetición

    // Función para convertir texto en voz
    function speakText(text) {
        if (isSpeechEnabled && 'speechSynthesis' in window) {
            // Detener la síntesis de voz actual si hay una en curso
            if (currentUtterance) {
                window.speechSynthesis.cancel();
            }
            
            currentUtterance = new SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(currentUtterance);
            
            // Resetea el utterance actual después de que termine de hablar
            currentUtterance.onend = () => {
                currentUtterance = null;
            };
        }
    }

    // Función para manejar el evento mouseover
    function handleMouseOver(event) {
        if (!isSpeechEnabled) return; // No hacer nada si el modo de lectura está desactivado

        const text = event.target.innerText || event.target.textContent;
        if (text) {
            const trimmedText = text.trim();
            if (!currentUtterance || currentUtterance.text !== trimmedText) {
                speakText(trimmedText);
                // Añadir clase para marcar el texto como leído
                event.target.classList.add('spoken');
            }
        }
    }

    // Función para manejar el evento mouseout
    function handleMouseOut(event) {
        // Quitar la clase que marca el texto como leído
        event.target.classList.remove('spoken');
    }

    // Función para añadir eventos mouseover y mouseout a un selector específico
    function addMouseOverEventListener(selector) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            element.addEventListener('mouseover', handleMouseOver);
            element.addEventListener('mouseout', handleMouseOut);
        });
    }

    // Añadir eventos a botones y textos editables
    addMouseOverEventListener('button');
    addMouseOverEventListener('[contenteditable="true"]');
    addMouseOverEventListener('.task');
    addMouseOverEventListener('.heading');
    addMouseOverEventListener('.task-input');
    addMouseOverEventListener('.delete-button');

    // Añadir eventos a los elementos del menú desplegable
    addMouseOverEventListener('.dropdown-content');
    addMouseOverEventListener('.dropdown-content button');
    addMouseOverEventListener('.dropdown-content h2');

    // Añadir eventos específicos para los botones
    document.getElementById('add-board-btn').addEventListener('mouseover', function() {
        if (isSpeechEnabled) speakText('Agregar nueva página');
    });

    document.getElementById('save-board-btn').addEventListener('mouseover', function() {
        if (isSpeechEnabled) speakText('Guardar tablero');
    });

    document.getElementById('toggle-speech-btn').addEventListener('mouseover', function() {
        speakText(isSpeechEnabled ? 'Desactivar voz' : 'Activar voz');
    });

    // Función para activar o desactivar la síntesis de voz
    function toggleSpeech() {
        isSpeechEnabled = !isSpeechEnabled;
        const button = document.getElementById('toggle-speech-btn');
        button.textContent = isSpeechEnabled ? 'Desactivar Voz' : 'Activar Voz';
        
        // Informar al usuario sobre el estado actual del modo de lectura
        if (isSpeechEnabled) {
            speakText('Modo de lectura activado');
        } else {
            speakText('Modo de lectura desactivado');
        }
    }

    // Añadir evento para el botón de activar/desactivar voz
    document.getElementById('toggle-speech-btn').addEventListener('click', toggleSpeech);

    // Función para agregar una nueva página
    function addBoard() {
        // Limpiar el contenido del tablero
        const boardContainer = document.getElementById('lanes-container');
        if (boardContainer) {
            boardContainer.innerHTML = ''; // Limpiar el contenido del contenedor del tablero
        }
        
        // Mostrar un mensaje para indicar que se ha creado una nueva página
        alert('Nueva página creada');
    }

    // Función para eliminar un tablero
    function deleteBoard() {
        const boardContainer = document.getElementById('lanes-container');
        if (boardContainer) {
            boardContainer.innerHTML = ''; // Limpiar el contenido del contenedor del tablero
            // No se muestra ninguna alerta posterior
        }
    }

    // Función para guardar el tablero
    function saveBoard() {
        // Mostrar un mensaje de error ya que no hay una base conectada
        alert('Error: No hay base de datos conectada para guardar el tablero.');
    }

    // Asignar las funciones a los botones
    const addBoardBtn = document.getElementById('add-board-btn');
    const deleteBoardBtn = document.getElementById('delete-board-btn');
    const saveBoardBtn = document.getElementById('save-board-btn');

    if (addBoardBtn) {
        addBoardBtn.addEventListener('click', addBoard);
    }
    
    if (deleteBoardBtn) {
        deleteBoardBtn.addEventListener('click', deleteBoard);
    }
    
    if (saveBoardBtn) {
        saveBoardBtn.addEventListener('click', saveBoard);
    }
});
