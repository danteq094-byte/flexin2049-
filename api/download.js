// api/download.js
export default async function handler(req, res) {
    const { id } = req.query;
    if (!id) return res.status(400).send("No ID");

    try {
        // Método agresivo: Usamos un Proxy que imita a Roblox Studio
        const downloadUrl = `https://assetdelivery.roproxy.com/v1/asset/?id=${id}`;
        
        const response = await fetch(downloadUrl, {
            headers: {
                'User-Agent': 'Roblox/WinInet',
                'Accept': '*/*'
            }
        });

        if (!response.ok) throw new Error("Blocked");

        const buffer = await response.arrayBuffer();

        // Configuramos para que el navegador descargue el archivo automáticamente
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename="Flexin_Game_${id}.rbxm"`);
        return res.send(Buffer.from(buffer));

    } catch (error) {
        // Si el proxy principal falla, usamos la API de assets oficial como respaldo
        return res.redirect(`https://www.roblox.com/asset-thumbnail/image?assetId=${id}&width=420&height=420&format=png`);
    }
}
