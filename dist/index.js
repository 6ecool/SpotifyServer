"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const spotifyRouter_1 = __importDefault(require("./routes/spotifyRouter"));
const cors_1 = __importDefault(require("cors"));
const lyricsController_1 = require("./controllers/lyricsController");
const axios_1 = __importDefault(require("axios"));
require('dotenv').config();
const app = (0, express_1.default)();
const port = 3000;
app.use((0, cors_1.default)());
app.use('/api/spotify', spotifyRouter_1.default);
app.use('/api/lyrics', lyricsController_1.getLyrics);
const NEWS_API_KEY = '6b29d81fe7844657afe47877f0e1551b';
// Endpoint to fetch music-related news
app.get('/api/music-news', async (req, res) => {
    const { page = 1, pageSize = 20 } = req.query; // Default page is 1 and pageSize is 5
    try {
        const response = await axios_1.default.get('https://newsapi.org/v2/everything', {
            params: {
                q: 'music',
                apiKey: NEWS_API_KEY,
                language: 'en',
                sortBy: 'publishedAt',
                pageSize,
                page, // Use page from query parameters
            },
        });
        res.json(response.data);
    }
    catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ error: 'Failed to fetch news' });
    }
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
