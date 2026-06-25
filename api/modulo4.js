// Base de datos simulada en memoria en caso de no detectar variables de entorno de Supabase
let simuladorDB = [
    { id: 101, cliente: "Andrés Silva", pieza: "Engranaje_Extrusor.stl", material: "PETG", estado: "En Cola" },
    { id: 102, cliente: "Bárbara Opazo", pieza: "Figura_Coleccionable.stl", material: "Resina UV", estado: "Imprimiendo" },
    { id: 103, cliente: "Estudio Arquitectura", pieza: "Maqueta_Escala_150.stl", material: "PLA Pro", estado: "Terminado" }
];

export default async function handler(request, response) {
    const { method } = request;

    // Detectamos si existen credenciales reales en Vercel
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;
    const usarSupabaseReal = SUPABASE_URL && SUPABASE_KEY;

    // CONFIGURACIÓN DE CABECERAS PARA SUPABASE REST API
    const headersSupabase = {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    };

    try {
        // --- MÉTODO GET: LISTAR ÓRDENES (READ) ---
        if (method === "GET") {
            if (usarSupabaseReal) {
                const res = await fetch(`${SUPABASE_URL}/rest/v1/ordenes?select=*&order=id.asc`, { headers: headersSupabase });
                const ordenes = await res.json();
                return response.status(200).json({ origen: "Supabase Cloud", ordenes });
            } else {
                return response.status(200).json({ origen: "Simulación Local", ordenes: simuladorDB });
            }
        }

        // --- MÉTODO POST: CREAR ORDEN (CREATE) ---
        if (method === "POST") {
            const { cliente, pieza, material } = request.body;
            
            if (usarSupabaseReal) {
                await fetch(`${SUPABASE_URL}/rest/v1/ordenes`, {
                    method: "POST",
                    headers: headersSupabase,
                    body: JSON.stringify({ cliente, pieza, material, estado: "En Cola" })
                });
            } else {
                const nuevaOrden = {
                    id: Date.now(), // Generamos ID único temporal
                    cliente,
                    pieza,
                    material,
                    estado: "En Cola"
                };
                simuladorDB.push(nuevaOrden);
            }
            return response.status(201).json({ mensaje: "Orden ingresada exitosamente." });
        }

        // --- MÉTODO PUT: ACTUALIZAR ESTADO (UPDATE) ---
        if (method === "PUT") {
            const { id, estado } = request.body;

            if (usarSupabaseReal) {
                await fetch(`${SUPABASE_URL}/rest/v1/ordenes?id=eq.${id}`, {
                    method: "PATCH", // Supabase usa PATCH para actualizaciones parciales
                    headers: headersSupabase,
                    body: JSON.stringify({ estado })
                });
            } else {
                simuladorDB = simuladorDB.map(o => o.id === parseInt(id) ? { ...o, estado } : o);
            }
            return response.status(200).json({ mensaje: "Estado de manufactura modificado." });
        }

        // --- MÉTODO DELETE: ELIMINAR ORDEN (DELETE) ---
        if (method === "DELETE") {
            const { id } = request.body;

            if (usarSupabaseReal) {
                await fetch(`${SUPABASE_URL}/rest/v1/ordenes?id=eq.${id}`, {
                    method: "DELETE",
                    headers: headersSupabase
                });
            } else {
                simuladorDB = simuladorDB.filter(o => o.id !== parseInt(id));
            }
            return response.status(200).json({ mensaje: "Orden removida del sistema." });
        }

        // Si mandan otro método no soportado
        return response.status(405).json({ error: "Método no permitido." });

    } catch (error) {
        console.error("Error en flujo CRUD:", error);
        return response.status(500).json({ error: "Falla crítica en el controlador de la cola de impresión." });
    }
}
