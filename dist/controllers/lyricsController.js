"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLyrics = void 0;
const axios_1 = __importDefault(require("axios"));
const getLyrics = async (req, res) => {
    const { artist, title } = req.query;
    console.log(artist);
    if (!artist || !title) {
        res.status(400).json({ error: 'Artist and title are required' });
        return;
    }
    try {
        const response = await axios_1.default.get(`https://api.lyrics.ovh/v1/${artist}/${title}`);
        res.json(response.data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch lyrics' });
    }
};
exports.getLyrics = getLyrics;
