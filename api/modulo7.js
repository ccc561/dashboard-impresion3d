// Data simulada histórica por si Supabase está apagado
const historialSimulado = [
    { id: 901, cliente: "Ignacio Torres", pieza: "Engranaje_Reductor.stl", material: "ABS", estado: "Terminado" },
    { id: 902, cliente: "Loreto Cárcamo", pieza: "Prototipo_Carcasa_Drone.stl", material: "PETG", estado: "Terminado" },
    { id: 903, cliente: "Clínica Dental San Lucas", pieza: "Guia_Quirurgica_V4.stl", material: "Resina UV", estado: "Terminado" },
    { id: 904, cliente: "Matías Fuentealba", pieza: "Soporte_Audifonos.stl", material: "PLA Pro", estado: "Terminado" }
];

export default async function handler(request, response) {
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;
    const usarSupabaseReal = SUPABASE_URL && SUPABASE_KEY;

    const headersSupabase = {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json"
    };

    try {
        if (usarSupabaseReal) {
            // Hacemos un filtro estricto por URL: solo traer registros donde estado sea 'Terminado' o 'Entregado'
            // En la API REST de Supabase, esto se logra usando el operador 'eq' o 'in'
            const urlFiltro = `${SUPABASE_URL}/rest/v1/ordenes?estado=eq.Terminado&order=id.desc`;
            
            const res = await fetch(urlFiltro, { headers: headersSupabase });
            const ordenes = await res.json();

            return response.status(200).json({ origen: "Supabase Cloud", ordenes });
        } else {
            return response.status(200).json({ origen: "Simulación Local", ordenes: historialSimulado });
        }
    } catch (error) {
        console.error("Error en módulo historial:", error);
        return response.status(500).json({ error: "Falla al leer el archivo histórico." });
    }
}
