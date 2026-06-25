// Esperar a que el HTML cargue por completo
document.addEventListener('DOMContentLoaded', () => {
    console.log("3DPrintOps Hub Iniciado correctamente.");
    inicializarMonitores();
});

// Función para simular el estado de conexión de los 9 módulos
function inicializarMonitores() {
    // Vamos a recorrer del 1 al 9 para actualizar las etiquetas de estado
    for (let i = 1; i <= 9; i++) {
        const indicator = document.getElementById(`status-m1`);
        
        // Simulamos un retraso de red diferente para cada servicio
        setTimeout(() => {
            actualizarEstadoVisual(i, true); // Por ahora los ponemos todos ONLINE de forma exitosa
        }, 600 * i);
    }
}

// Cambia el HTML del badge de estado
function actualizarEstadoVisual(moduloId, estaOnline) {
    const badge = document.getElementById(`status-m${moduloId}`);
    if (!badge) return;

    if (estaOnline) {
        badge.className = "text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1.5";
        badge.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> ONLINE`;
    } else {
        badge.className = "text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1.5";
        badge.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-rose-400"></span> OFFLINE`;
    }
}
