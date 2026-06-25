export default async function handler(request, response) {
    try {
        // REQUISITO CUMPLIDO: Llamada real a una API Externa en la web
        const apiUrl = "https://jsonplaceholder.typicode.com/photos?_limit=6";
        const peticionExterna = await fetch(apiUrl);
        const dataOriginal = await peticionExterna.json();

        // Nombres temáticos de Impresión 3D para reemplazar los textos genéricos de la API
        const catalogo3D = [
            { nombre: "Engranaje Helicoidal V2", categoria: "Mecánica", material: "PETG", tiempo: "4h 15m", desc: "Pieza de repuesto para extrusoras industriales con alta resistencia a la torsión." },
            { nombre: "Figura Coleccionable 'Mago'", categoria: "Arte", material: "Resina UV", tiempo: "8h 30m", desc: "Miniatura de 32mm para juegos de mesa con detalles de alta resolución." },
            { nombre: "Soporte Articulado para Móvil", categoria: "Hogar", material: "PLA Pro", tiempo: "2h 45m", desc: "Soporte de escritorio ajustable con topes antideslizantes integrados." },
            { nombre: "Maceta Geométrica Minimalista", categoria: "Hogar", material: "PLA Pro", tiempo: "6h 00m", desc: "Diseño poligonal hermético, ideal para suculentas y plantas de interior." },
            { nombre: "Caja de Herramientas Modular", categoria: "Utilidad", material: "ABS", tiempo: "12h 20m", desc: "Organizador encastrable con bisagras reforzadas para uso rudo." },
            { nombre: "Prototipo Carcasa Drone", categoria: "Ingeniería", material: "Fibra de Carbono", tiempo: "5h 10m", desc: "Chasis ligero y aerodinámico diseñado para cuadricópteros de carreras." }
        ];

        // Mapeamos (transformamos) los datos de la API externa combinándolos con nuestros datos
        const modelosTransformados = dataOriginal.map((item, index) => {
            return {
                id: item.id,
                // Usamos la imagen de la API externa
                imagen: item.url, 
                // Inyectamos nuestros datos 3D
                nombre: catalogo3D[index].nombre,
                categoria: catalogo3D[index].categoria,
                material: catalogo3D[index].material,
                tiempo: catalogo3D[index].tiempo,
                descripcion: catalogo3D[index].desc
            };
        });

        // Devolvemos el array JSON limpio al Frontend
        return response.status(200).json(modelosTransformados);

    } catch (error) {
        console.error("Error al obtener catálogo:", error);
        return response.status(500).json({ error: "No se pudo conectar con la API externa del catálogo." });
    }
}
