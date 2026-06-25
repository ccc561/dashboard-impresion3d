export default async function handler(request, response) {
    const { fecha, costo } = request.query;

    if (!fecha || !costo) {
        return response.status(400).json({ error: "Faltan parámetros de fecha o costo." });
    }

    try {
        // 1. Llamada a la API Financiera (para el costo del despacho)
        const urlFinanciera = `https://open.er-api.com/v6/latest/CLP`;
        const resFinanciera = await fetch(urlFinanciera).then(res => res.json());
        
        const tasaUsd = resFinanciera.rates ? resFinanciera.rates.USD : 0.0011;
        const costoUsd = (parseFloat(costo) * tasaUsd).toFixed(2);

        // 2. Lógica de Calendario (Fines de semana y feriados)
        // Convertimos el string de fecha a objeto Date asegurando la zona horaria UTC para no desfasar días
        const dateObj = new Date(`${fecha}T12:00:00Z`); 
        const dayOfWeek = dateObj.getUTCDay(); // 0 es Domingo, 6 es Sábado
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

        // Simulador de Feriados Internacionales (Días bloqueados logísticamente)
        const month = dateObj.getUTCMonth() + 1;
        const day = dateObj.getUTCDate();
        
        // Ejemplos de feriados fijos: 1 Enero (Año Nuevo), 1 Mayo (Día Trabajo), 25 Diciembre (Navidad)
        const isHoliday = 
            (month === 1 && day === 1) || 
            (month === 5 && day === 1) || 
            (month === 12 && day === 25);

        // 3. Procesar las reglas de negocio
        let mensajeLogistico = "Día hábil válido. Despacho programado a tiempo.";
        let retraso = false;

        if (isWeekend) {
            mensajeLogistico = "Retraso: Fin de semana detectado. El envío de la pieza 3D se pospondrá al próximo lunes.";
            retraso = true;
        } else if (isHoliday) {
            mensajeLogistico = "Retraso: Día feriado detectado. Los transportistas no operan. Envío pospuesto al siguiente día hábil.";
            retraso = true;
        }

        // Devolver todo el consolidado
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
