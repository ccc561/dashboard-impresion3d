document.addEventListener("DOMContentLoaded", () => {
    // Función que actualiza la interfaz visual
    const updateStatusUI = (id, isOnline) => {
        const el = document.getElementById(id);
        if (!el) return;

        if (isOnline) {
            el.className = "text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 transition-all duration-300";
            el.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span> ONLINE`;
        } else {
            el.className = "text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 transition-all duration-300";
            el.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></span> OFFLINE`;
        }
    };

    // Función que hace el "Ping" de forma asíncrona
    const checkModuleStatus = async (moduleNumber) => {
        const id = `status-m${moduleNumber}`;
        const url = `modulo${moduleNumber}.html`;

        try {
            // Petición HEAD super ligera
            const response = await fetch(url, { method: 'HEAD', cache: 'no-store' });
            
            // Actualiza la UI inmediatamente cuando ESTA petición termina
            updateStatusUI(id, response.ok);
        } catch (error) {
            updateStatusUI(id, false);
        }
    };

    // Disparamos TODAS las peticiones simultáneamente (Concurrencia pura)
    const totalModules = 9;
    for (let i = 1; i <= totalModules; i++) {
        checkModuleStatus(i); 
    }
});
