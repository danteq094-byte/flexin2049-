export default async function handler(req, res) {
    const { id } = req.query;
    if (!id) return res.status(400).send("ID Required");

    try {
        // Usamos una URL de descarga que no requiere sesión si se pide correctamente
        const targetUrl = `https://assetdelivery.roproxy.com/v1/asset/?id=${id}`;
        
        const response = await fetch(targetUrl, {
            headers: {
                'User-Agent': 'Roblox/WinInet', // Esto simula ser el Studio oficial
                'Accept': '*/*'
            }
        });

        if (!response.ok) throw new Error("Security Blocked");

        const buffer = await response.arrayBuffer();

        // Forzamos al navegador a descargar el binario sin abrir pestañas de error
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename="Flexin_Game_${id}.rbxm"`);
        
        return res.send(Buffer.from(buffer));

    } catch (error) {
        // Si todo falla, intentamos una redirección directa como último recurso
        return res.redirect(`https://assetdelivery.roblox.com/v1/asset/?id=${id}`);
    }
}
