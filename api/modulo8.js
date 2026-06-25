export default async function handler(request, response) {
    const { correo } = request.query;

    if (!correo) {
        return response.status(400).json({ error: "Falta el parámetro de correo." });
    }

    try {
        const emailStr = correo.toLowerCase().trim();
        
        // 1. VALIDACIÓN SINTÁCTICA ESTRICTA (Regex)
        // Revisa que tenga caracteres válidos, un @ y un dominio con punto
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const sintaxisValida = regexEmail.test(emailStr);
        
        if (!sintaxisValida) {
            return response.status(200).json({
                email: emailStr,
                sintaxis: false,
                esRol: false,
                esDesechable: false,
                riesgo: "Crítico",
                mensaje: "Operación rechazada: La estructura del correo es totalmente inválida."
            });
        }

        // Extraemos el nombre de usuario y el dominio (ej: "admin" y "impresion3d.com")
        const [usuario, dominio] = emailStr.split("@");

        // 2. VALIDACIÓN DE CORREO DE ROL (Evita que registren cuentas genéricas en tu plataforma)
        const rolesComunes = ["admin", "info", "contacto", "support", "ventas", "webmaster", "postmaster", "test", "hola", "noreply"];
        const esRol = rolesComunes.includes(usuario);

        // 3. VALIDACIÓN EN LISTA NEGRA GLOBAL (Llamada a API externa)
        // Consumimos el repositorio público de dominios desechables en GitHub (Raw data)
        const rawUrl = "https://raw.githubusercontent.com/disposable-email-domains/disposable-email-domains/master/disposable_email_blocklist.conf";
        const resExterno = await fetch(rawUrl);
        const textData = await resExterno.text();
        
        // Convertimos el documento de texto en un arreglo (array) de dominios bloqueados
        const dominiosDesechables = textData.split("\n").map(d => d.trim());
        const esDesechable = dominiosDesechables.includes(dominio);

        // 4. ALGORITMO DE VEREDICTO DE RIESGO
        let riesgo = "Bajo";
        let mensaje = "Correo analizado y verificado. Es seguro proceder con el registro o despacho.";

        if (esDesechable) {
            riesgo = "Alto";
            mensaje = "PELIGRO: Dominio temporal bloqueado. Esto suele ser un intento de fraude o cuenta falsa.";
        } else if (esRol) {
            riesgo = "Medio";
            mensaje = "ATENCIÓN: Es un correo genérico o corporativo. Se recomienda pedir un correo personal para notificaciones críticas.";
        }

        // Devolvemos el JSON de seguridad consolidado
        return response.status(200).json({
            email: emailStr,
            sintaxis: true,
            esRol,
            esDesechable,
            riesgo,
            mensaje
        });

    } catch (error) {
        console.error("Error validando correo anti-spam:", error);
        return response.status(500).json({ error: "Falla interna en los servidores de validación." });
    }
}
