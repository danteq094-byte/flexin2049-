export default async function handler(req, res) {
    const { id } = req.query;
    if (!id) return res.status(400).send("No ID");

    try {
        // Proxy para obtener el archivo directamente
        const assetUrl = `https://assetdelivery.roproxy.com/v1/asset/?id=${id}`;
        
        const response = await fetch(assetUrl, {
            method: 'GET',
            headers: {
                'User-Agent': 'Roblox/WinInet',
                'Accept': '*/*',
            }
        });

        if (!response.ok) throw new Error("Blocked");

        const buffer = await response.arrayBuffer();

        // Esto fuerza la descarga del archivo rbxm
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename="FlexinGame_${id}.rbxm"`);
        return res.send(Buffer.from(buffer));

    } catch (error) {
        // Si falla, intentamos el método de redirección forzada
        return res.redirect(`https://assetdelivery.roblox.com/v1/asset/?id=${id}`);
    }
}
