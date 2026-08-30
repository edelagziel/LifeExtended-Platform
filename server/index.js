import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/api/papers", async (req, res) => {
    try 
    {
        const currentYear = new Date().getFullYear();
        const fromYear = currentYear - 3;

        const url = `https://api.semanticscholar.org/graph/v1/paper/search?query=aging OR longevity OR "metabolic health" OR senescence&year=${fromYear}-${currentYear}&limit=10&fields=title,abstract,year,venue,authors,url`;

        const response = await fetch(url);
        const data = await response.json();

        res.json(data);
    } 
    catch (error)
    {
        console.error("Error fetching papers:", error);
        res.status(500).json({ error: "Server Error" });
    }
});

app.listen(3001, () => {
    console.log("Server running on http://localhost:3001");
});
