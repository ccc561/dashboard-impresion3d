document.addEventListener("DOMContentLoaded", () => {
    // Función que actualiza la interfaz (colores y texto) según el resultado real
    const updateStatusUI = (id, isOnline) => {
        const el = document.getElementById(id);
        if (!el) return;

        if (isOnline) {
            el.className = "text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 transition-all duration-500";
            el.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span> ONLINE`;
        } else {
            el.className = "text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 transition-all duration-500";
            el.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></span> OFFLINE`;
        }
    };

    // Función que hace el "Ping" real al servidor
    const checkModuleStatus = async (moduleNumber) => {
        const id = `status-m${moduleNumber}`;
        const url = `modulo${moduleNumber}.html`;

        try {
            // Usamos 'HEAD' para solicitar solo las cabeceras, sin descargar todo el HTML (más rápido)
            const response = await fetch(url, { method: 'HEAD', cache: 'no-store' });
            
            if (response.ok) {
                updateStatusUI(id, true);
            } else {
                updateStatusUI(id, false);
            }
        } catch (error) {
            // Si hay un error de red o de conexión (Ej: no hay internet)
            updateStatusUI(id, false);
        }
    };

    // Ejecutamos la verificación para los 9 módulos
    const totalModules = 9;
    
    for (let i = 1; i <= totalModules; i++) {
        // Agregamos un ligero retraso escalonado (250ms por tarjeta) 
        // para mantener el efecto visual del "Escaneo" en cadena.
        setTimeout(() => {
            checkModuleStatus(i);
        }, i * 250); 
    }
});
