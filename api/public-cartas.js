const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function json(res, status, body) {
    res.status(status).setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(body));
}

async function supabaseRequest(path) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
        method: "GET",
        headers: {
            apikey: SUPABASE_SERVICE_ROLE_KEY,
            Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            "Content-Type": "application/json"
        }
    });

    const text = await response.text();
    let data = null;

    try {
        data = text ? JSON.parse(text) : null;
    } catch {
        data = text;
    }

    if (!response.ok) {
        throw new Error(data?.message || data?.error || "Error al leer Supabase");
    }

    return data;
}

export default async function handler(req, res) {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
        return json(res, 500, {
            error: "Faltan variables de entorno: SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY"
        });
    }

    try {
        const cartas = await supabaseRequest(
            "cartas?select=id,slug,titulo,resumen,contenido,fecha,orden&publicada=eq.true&order=orden.asc,fecha.desc"
        );

        return json(res, 200, {
            cartas: Array.isArray(cartas) ? cartas : []
        });
    } catch (error) {
        return json(res, 500, {
            error: error.message || "No pude cargar las cartas públicas"
        });
    }
}
