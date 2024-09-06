import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js';

// Reemplaza con tu URL y clave de Supabase
const SUPABASE_URL = 'https://hlkkxgasvzokzdwehkjj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhsa2t4Z2Fzdnpva3pkd2Voa2pqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQ5NjYwMDEsImV4cCI6MjA0MDU0MjAwMX0.CC2aONtzpwO8DvLl0HOLVCBfnflfATjXEtGnX8M9X3c';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM content loaded'); // Verifica que el DOM esté completamente cargado
    const connectDBBtn = document.getElementById('connectDB');
    
    if (connectDBBtn) {
        connectDBBtn.addEventListener('click', async () => {
            console.log('Button clicked'); // Verifica que el botón se haya clickeado
            try {
                // Probar una consulta simple para verificar la conexión
                const { error, data } = await supabase
                    .from('boards') // Reemplaza 'boards' con el nombre de tu tabla real
                    .select('*')
                    .limit(1);

                if (error) {
                    console.error('Error al conectar a Supabase:', error);
                    alert(`Error al conectar a Supabase: ${error.message}`);
                } else {
                    console.log('Datos obtenidos:', data);
                    alert("Conexión a Supabase exitosa.");
                }
            } catch (networkError) {
                console.error('Error de red:', networkError);
                alert(`Error de red al conectar a Supabase: ${networkError.message}`);
            }
        });
    } else {
        console.error('Elemento #connectDB no encontrado');
    }
});
