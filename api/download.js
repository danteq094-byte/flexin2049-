export default async function handler(req, res) {
    const { id } = req.query;

    if (!id) return res.status(400).send("No ID provided");

    try {
        // 1. Intentamos obtener el nombre para que el archivo sea profesional
        const infoRes = await fetch(`https://games.roproxy.com/v1/games/multiget-place-details?placeIds=${id}`);
        const infoData = await infoRes.json();
        const gameName = (infoData[0] && infoData[0].name) 
            ? infoData[0].name.replace(/[^a-z0-9]/gi, '_') 
            : `FlexinGame_${id}`;

        // 2. URL de descarga usando Proxy para evitar bloqueos
        const assetUrl = `https://assetdelivery.roproxy.com/v1/asset/?id=${id}`;
        const response = await fetch(assetUrl, {
            headers: { 'User-Agent': 'Roblox/WinInet' }
        });

        if (!response.ok) throw new Error("Roblox Blocked");

        const buffer = await response.arrayBuffer();

        // 3. Forzar descarga como .rbxm
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename="${gameName}.rbxm"`);
        
        return res.send(Buffer.from(buffer));

    } catch (error) {
        // Plan B: Redirigir directamente a Roblox si el proxy falla
        return res.redirect(`https://assetdelivery.roblox.com/v1/asset/?id=${id}`);
    }
}
