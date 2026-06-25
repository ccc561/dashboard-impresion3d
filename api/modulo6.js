export default async function handler(request, response) {
    const { peso, horas, material } = request.query;

    if (!peso || !horas || !material) {
        return response.status(400).json({ error: "Faltan parámetros de cálculo." });
    }

    try {
        // --- CONFIGURACIÓN DEL ALGORITMO DE COSTOS (Valores CLP) ---
        const PRECIOS_POR_GRAMO = {
            pla: 35,     // $35 por gramo
            abs: 45,     // $45 por gramo
            petg: 50,    // $50 por gramo
            resina: 120  // $120 por gramo (más cara por detalle)
        };

        const COSTO_HORA_MAQUINA = 800; // Energía + Desgaste + Mantenimiento por hora

        // --- CÁLCULO DINÁMICO ---
        const g = parseFloat(peso);
        const h = parseFloat(horas);
        
        const costoMaterial = g * (PRECIOS_POR_GRAMO[material] || 35);
        const costoEnergia = h * COSTO_HORA_MAQUINA;
        
        // Sumamos costos + 20% de margen de ganancia operativa
        const totalCLP = (costoMaterial + costoEnergia) * 1.20;

        // --- CONVERSIÓN A USD (API FINANCIERA) ---
        const resFinanciera = await fetch(`https://open.er-api.com/v6/latest/CLP`).then(res => res.json());
        const tasaUsd = resFinanciera.rates ? resFinanciera.rates.USD : 0.0011;
        const totalUSD = (totalCLP * tasaUsd).toFixed(2);

        // Respuesta consolidada
        return response.status(200).json({
            totalCLP: Math.round(totalCLP),
            totalUSD,
            costoMaterial: Math.round(costoMaterial),
            costoEnergia: Math.round(costoEnergia),
            materialUsado: material.toUpperCase()
        });

    } catch (error) {
        console.error("Error en algoritmo de cotización:", error);
        return response.status(500).json({ error: "Falla en el motor de cálculo." });
    }
}
