"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const port = 3000;
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.static('public'));
app.get('/', (req, res) => {
    res.send('halo');
});
app.get('/about', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, './public/about.html'));
});
app.get('/multi-isp-status', (req, res) => {
    fs_1.default.readFile('./db/data.json', 'utf-8', (error, data) => {
        if (error)
            res.send("terjadi kesalahan pada pembacaan file");
        res.send(JSON.parse(data));
    });
});
// ... [Lanjutan dari kode Anda dengan konversi serupa]
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
