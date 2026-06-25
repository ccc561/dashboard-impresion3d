export default async function handler(request, response) {
    const { ciudad } = request.query;

    if (!ciudad) {
        return response.status(400).json({ error: "Debes ingresar una ciudad válida." });
    }

    try {
        // PASO 1: Geocodificación (Convertir "Santiago" en Lat y Lon)
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(ciudad)}&count=1&language=es&format=json`;
        const geoRes = await fetch(geoUrl);
        const geoData = await geoRes.json();

        if (!geoData.results || geoData.results.length === 0) {
            return response.status(404).json({ error: "Ciudad no encontrada en el radar global." });
        }

        const location = geoData.results[0];
        const lat = location.latitude;
        const lon = location.longitude;
        const nombreOficial = `${location.name}, ${location.country}`;

        // PASO 2: Obtener Clima en tiempo real (Temp y Condiciones)
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
        const weatherRes = await fetch(weatherUrl);
        const weatherData = await weatherRes.json();

        const temp = weatherData.current_weather.temperature;
        const weathercode = weatherData.current_weather.weathercode;

        // PASO 3: IA Logística (Reglas físicas de los materiales 3D)
        let plaStatus = "✅ Seguro (Temp. Estándar)";
        let resinaStatus = "✅ Seguro (Flexibilidad Normal)";
        let alertaGeneral = "Condiciones atmosféricas óptimas. Se autoriza despacho en embalaje estándar.";
        let riesgo = "Bajo";

        // Análisis térmico para PLA (El PLA se ablanda a >50°C, pero en un furgón a 30°C exteriores ya hay peligro)
        if (temp >= 35) {
            plaStatus = "🚨 Peligro de Deformación (Warping)";
            alertaGeneral = "ALERTA TÉRMICA: Temperatura exterior excesiva. El interior de los vehículos de despacho puede superar los 60°C. Las piezas de PLA colapsarán. Retrasar envío o usar camión refrigerado.";
            riesgo = "Alto";
        } else if (temp >= 28) {
            plaStatus = "⚠️ Precaución (Calor Moderado)";
            alertaGeneral = "Temperatura elevada. Evitar cajas de color negro y minimizar exposición solar directa durante el trayecto.";
            riesgo = "Medio";
        }

        // Análisis térmico para Resina UV (Con mucho frío se cristaliza y se vuelve quebradiza)
        if (temp <= 5) {
            resinaStatus = "⚠️ Riesgo de Fractura";
            alertaGeneral = "ALERTA DE CONGELACIÓN: Bajas temperaturas pueden cristalizar la Resina UV haciéndola extremadamente frágil a los golpes. Reforzar el acolchado plástico (Plástico de burbujas triple).";
            riesgo = "Medio";
        }

        // Análisis de Lluvia (Weathercode > 50 significa lluvia/nieve)
        if (weathercode >= 50) {
            alertaGeneral += " | 🌧️ PRECAUCIÓN: Lluvia detectada en ruta. Utilizar bolsas herméticas tipo Ziploc para proteger piezas y evitar absorción de humedad en materiales higroscópicos (PETG, TPU).";
            if (riesgo === "Bajo") riesgo = "Medio";
        }

        // Responder al Frontend
        return response.status(200).json({
            ciudad: nombreOficial,
            temperatura: temp,
            riesgo,
            alertas: alertaGeneral,
            materiales: { pla: plaStatus, resina: resinaStatus }
        });

    } catch (error) {
        console.error("Error en radar meteorológico:", error);
        return response.status(500).json({ error: "Los satélites meteorológicos no responden." });
    }
}
