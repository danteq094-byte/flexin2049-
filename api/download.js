export default async function handler(req, res) {
    const { id } = req.query;
    if (!id) return res.status(400).send("ID Required");

    try {
        // Usamos la API de entrega de assets que usan los servidores internos
        const targetUrl = `https://assetdelivery.roproxy.com/v1/asset/?id=${id}`;
        
        const response = await fetch(targetUrl, {
            method: 'GET',
            headers: {
                // Cabeceras profesionales para saltar la seguridad
                'User-Agent': 'Roblox/WinInet', 
                'Accept': '*/*',
                'Roblox-Place-Id': id,
                'X-Proxy-Bypass': 'true'
            }
        });

        if (!response.ok) throw new Error("Security Blocked");

        const buffer = await response.arrayBuffer();

        // Enviamos el archivo directamente al navegador como una descarga forzada
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename="Flexin_Bypass_${id}.rbxm"`);
        
        return res.send(Buffer.from(buffer));

    } catch (error) {
        // Si el bypass falla, intentamos el método de redirección camuflada
        return res.redirect(`https://assetdelivery.roblox.com/v1/asset/?id=${id}`);
    }
}
