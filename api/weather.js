export default async function main(req, res) {

    const { city } = req.query;
    const apiKey = process.env.API_KEY;

    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);

    if(!response.ok)
        return res.status(response.status).json({ error: "Failed to fetch weather data" });
    
    const data = await response.json();
    res.status(200).json(data);
}

export default async function main(req, res) {

    const { city } = req.query;
    const apiKey = process.env.API_KEY;
    
    try {

        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
        
        if(!response.ok) 
            return res.status(response.status).json({ error: "Failed to fetch weather" });

        const data = await response.json();
        return res.status(200).json(data);

    } catch (error) {
        console.error('Serverless function error: ', error);
        return res.status(500).json({ error: error.message });
    }
}