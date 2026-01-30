export default async function handler(req, res) {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "Missing ID" });

    try {
        // Método agresivo: Asset Delivery via Proxy
        const proxyUrl = `https://assetdelivery.roproxy.com/v1/asset/?id=${id}`;
        
        const response = await fetch(proxyUrl, {
            headers: { 'User-Agent': 'Roblox/WinInet' }
        });

        if (!response.ok) throw new Error("Unauthorized");

        const data = await response.arrayBuffer();

        // Forzamos al navegador a descargar el archivo sin abrir páginas de error
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename="Flexin_Game_${id}.rbxm"`);
        return res.send(Buffer.from(data));

    } catch (e) {
        // Si el proxy falla, redirigimos al último recurso de Roblox
        return res.redirect(`https://assetdelivery.roblox.com/v1/asset/?id=${id}`);
    }
}
