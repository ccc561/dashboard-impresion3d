export default async function handler(request, response) {
    try {
        // Simulamos un retraso de red de procesamiento (latencia de simulación)
        const msLatencia = Math.floor(Math.random() * (280 - 45 + 1)) + 45; 
        
        // Generamos un factor aleatorio para simular fallas intermitentes del bot (90% de éxito, 10% de caída)
        const simularFalla = Math.random() < 0.10; 

        // Endpoint ficticio de Make que se estaría auditando internamente
        const urlWebhookMake = "https://hook.us1.make.com/v1/mail-sender-bot/3d-print";

        if (simularFalla) {
            return response.status(200).json({
                online: false,
                mensaje: "Servicio no disponible temporalmente.",
                endpoint: urlWebhookMake,
                latencia: `${msLatencia}ms`,
                statusHttp: 503,
                resultado: "❌ CRITICAL_ERR_TIMEOUT"
            });
        }

        // Caso exitoso standard
        return response.status(200).json({
            online: true,
            mensaje: "Operando de forma óptima.",
            endpoint: urlWebhookMake,
            latencia: `${msLatencia}ms`,
            statusHttp: 200,
            resultado: "✅ OK_READY"
        });

    } catch (error) {
        console.error("Falla en el monitor:", error);
        return response.status(500).json({ error: "Falla crítica interna en el script de monitorización." });
    }
}
