const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ADMIN_PIN = process.env.ADMIN_PIN;

function json(res, status, body) {
    res.status(status).setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(body));
}

async function supabaseRequest(path, options = {}) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
        ...options,
        headers: {
            apikey: SUPABASE_SERVICE_ROLE_KEY,
            Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            "Content-Type": "application/json",
            Prefer: "return=representation",
            ...(options.headers || {})
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
        throw new Error(data?.message || data?.error || "Error en Supabase");
    }

    return data;
}

function normalizeCarta(carta = {}) {
    return {
        id: carta.id,
        titulo: carta.titulo,
        slug: carta.slug,
        fecha: carta.fecha,
        resumen: carta.resumen || "",
        contenido: carta.contenido,
        orden: Number(carta.orden || 0),
        publicada: Boolean(carta.publicada)
    };
}

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return json(res, 405, { error: "Método no permitido" });
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !ADMIN_PIN) {
        return json(res, 500, {
            error: "Faltan variables de entorno: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_PIN"
        });
    }

    const { pin, action, carta, id } = req.body || {};
    if (pin !== ADMIN_PIN) {
        return json(res, 401, { error: "PIN incorrecto" });
    }

    try {
        if (action === "list") {
            const cartas = await supabaseRequest("cartas?select=*&order=orden.asc,fecha.desc");
            return json(res, 200, { cartas });
        }

        if (action === "save") {
            const payload = normalizeCarta(carta);
            if (!payload.titulo || !payload.slug || !payload.contenido) {
                return json(res, 400, { error: "Título, slug y contenido son obligatorios" });
            }

            const body = payload.id ? payload : { ...payload };
            const saved = await supabaseRequest("cartas?on_conflict=slug", {
                method: "POST",
                body: JSON.stringify([body]),
                headers: {
                    Prefer: "resolution=merge-duplicates,return=representation"
                }
            });

            return json(res, 200, { carta: Array.isArray(saved) ? saved[0] : saved });
        }

        if (action === "delete") {
            if (!id) {
                return json(res, 400, { error: "Falta el id de la carta" });
            }

            await supabaseRequest(`cartas?id=eq.${encodeURIComponent(id)}`, {
                method: "DELETE",
                headers: {
                    Prefer: "return=minimal"
                }
            });

            return json(res, 200, { ok: true });
        }

        return json(res, 400, { error: "Acción no soportada" });
    } catch (error) {
        return json(res, 500, { error: error.message || "No pude completar la operación" });
    }
}
