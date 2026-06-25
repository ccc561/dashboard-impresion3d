export default async function handler(request, response) {
    const { fecha, costo } = request.query;

    if (!fecha || !costo) {
        return response.status(400).json({ error: "Faltan parámetros de fecha o costo." });
    }

    try {
        // 1. API Financiera (para la conversión a dólares)
        const urlFinanciera = `https://open.er-api.com/v6/latest/CLP`;
        
        // Extraemos el año de la fecha que ingresó el usuario para buscar los feriados correctos
        const dateObj = new Date(`${fecha}T12:00:00Z`);
        const year = dateObj.getUTCFullYear();
        
        // 2. API REAL DE FERIADOS (Filtramos por el país: Chile 'CL')
        const urlFeriados = `https://date.nager.at/api/v3/PublicHolidays/${year}/CL`;

        // Ejecutamos ambas peticiones al mismo tiempo para no hacer esperar al usuario
        const [resFinanciera, feriadosChile] = await Promise.all([
            fetch(urlFinanciera).then(res => res.json()),
            fetch(urlFeriados).then(res => res.json()).catch(() => []) // Si la API de feriados falla, usamos array vacío
        ]);
        
        // --- Procesar Costo USD ---
        const tasaUsd = resFinanciera.rates ? resFinanciera.rates.USD : 0.0011;
        const costoUsd = (parseFloat(costo) * tasaUsd).toFixed(2);

        // --- Procesar Fines de Semana ---
        const dayOfWeek = dateObj.getUTCDay(); // 0 es Domingo, 6 es Sábado
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

        // --- Procesar Feriados Reales ---
        // La fecha del input ya viene como "YYYY-MM-DD", buscamos si coincide con algún feriado de la API
        const feriadoEncontrado = feriadosChile.find(feriado => feriado.date === fecha);

        // --- Reglas de negocio para el mensaje final ---
        let mensajeLogistico = "Día hábil válido. Despacho programado a tiempo.";
        let retraso = false;

        // Le damos prioridad al aviso de feriado para que el usuario sepa EXACTAMENTE qué se celebra
        if (feriadoEncontrado) {
            mensajeLogistico = `Retraso: Feriado detectado en Chile (${feriadoEncontrado.localName}). Envío pospuesto al siguiente día hábil.`;
            retraso = true;
        } else if (isWeekend) {
            mensajeLogistico = "Retraso: Fin de semana detectado. El envío de la pieza 3D se pospondrá al próximo lunes.";
            retraso = true;
        }

        // Enviamos la respuesta limpia al Frontend
        return response.status(200).json({
            costoUsd,
            mensajeLogistico,
            retraso
        });

    } catch (error) {
        console.error("Error en módulo de despacho:", error);
        return response.status(500).json({ error: "Falla en los servicios logísticos." });
    }
}
