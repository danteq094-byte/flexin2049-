export default async function handler(req, res) {
    const { id } = req.query;
    if (!id) return res.status(400).send("ID Required");

    try {
        // Usamos una URL de descarga que no requiere login si se envía el User-Agent correcto
        const targetUrl = `https://assetdelivery.roproxy.com/v1/asset/?id=${id}`;
        
        const response = await fetch(targetUrl, {
            method: 'GET',
            headers: {
                'User-Agent': 'Roblox/WinInet', // Esto simula que eres Roblox Studio
                'Accept': '*/*'
            }
        });

        if (!response.ok) throw new Error("Security Block");

        const buffer = await response.arrayBuffer();

        // Forzamos la descarga directa del modelo/juego
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename="Game_Model_${id}.rbxm"`);
        
        return res.send(Buffer.from(buffer));

    } catch (error) {
        // Método de emergencia si el primero falla
        return res.redirect(`https://assetdelivery.roblox.com/v1/asset/?id=${id}`);
    }
}
