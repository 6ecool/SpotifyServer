"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.proxySpotify = exports.searchSpotify = void 0;
const axios_1 = __importDefault(require("axios"));
let accessToken = null;
let tokenExpiry = null;
const fetchAccessToken = async () => {
    try {
        const response = await axios_1.default.post('https://accounts.spotify.com/api/token', new URLSearchParams({
            grant_type: 'client_credentials',
        }), {
            headers: {
                Authorization: `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        accessToken = response.data.access_token;
        tokenExpiry = Date.now() + response.data.expires_in * 1000;
        console.log('Access token fetched successfully');
    }
    catch (error) {
        console.error('Error fetching access token:', error);
    }
};
const isTokenExpired = () => {
    return !accessToken || Date.now() >= tokenExpiry;
};
const searchSpotify = async (req, res) => {
    const { query, limit = 10, offset = 0 } = req.query; // Query params from frontend
    if (!query) {
        res.status(400).json({ error: 'Query is required' });
        return;
    }
    if (isTokenExpired()) {
        await fetchAccessToken();
    }
    try {
        const response = await axios_1.default.get('https://api.spotify.com/v1/search', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            params: {
                q: query,
                type: 'album,playlist,track', // Search for albums, playlists, and tracks
                limit,
                offset,
            },
        });
        res.json(response.data);
    }
    catch (error) {
        console.error('Error searching Spotify:', error);
        res.status(500).json({ error: 'Failed to search Spotify' });
    }
};
exports.searchSpotify = searchSpotify;
const proxySpotify = async (req, res) => {
    const { query } = req.query; // Query params from frontend
    if (!query) {
        res.status(400).json({ error: 'Query is required' });
        return;
    }
    if (isTokenExpired()) {
        await fetchAccessToken();
    }
    console.log(`Proxying request to Spotify API: ${query}`);
    try {
        const response = await axios_1.default.get(`https://api.spotify.com/v1/${query}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        res.json(response.data);
    }
    catch (error) {
        console.error('Error searching Spotify:', error);
        res.status(500).json({ error: 'Failed to search Spotify' });
    }
};
exports.proxySpotify = proxySpotify;
