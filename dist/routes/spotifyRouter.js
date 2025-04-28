"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/spotifyRoutes.ts
const express_1 = require("express");
const spotifyController_1 = require("../controllers/spotifyController");
const router = (0, express_1.Router)();
router.get('/search', spotifyController_1.searchSpotify); // Route to handle search query
router.get('/proxy', spotifyController_1.proxySpotify); // Route to handle search query
exports.default = router;
