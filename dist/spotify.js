"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNewReleases = void 0;
// src/spotify.ts
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const SPOTIFY_API_URL = 'https://api.spotify.com/v1/browse/new-releases';
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error('Spotify client credentials are missing.');
}
let accessToken = null;
let tokenExpiry = null;
const fetchAccessToken = async () => {
    try {
        const response = await axios_1.default.post('https://accounts.spotify.com/api/token', new URLSearchParams({
            grant_type: 'client_credentials',
        }), {
            headers: {
                Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
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
const getNewReleases = async (limit = 20, offset = 0) => {
    if (isTokenExpired()) {
        await fetchAccessToken();
    }
    try {
        const response = await axios_1.default.get(SPOTIFY_API_URL, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            params: {
                limit,
                offset,
            },
        });
        return response.data;
    }
    catch (error) {
        // @ts-ignore
        if (error.response?.status === 401) {
            console.log('Access token expired, refreshing...');
            await fetchAccessToken();
            return getNewReleases(limit, offset); // Retry after refreshing token
        }
        console.error('Error fetching new releases:', error);
        throw error;
    }
};
exports.getNewReleases = getNewReleases;
