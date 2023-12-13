import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req: Request, res: Response) => {
    res.send('halo');
});

app.get('/multi-isp-status', (req: Request, res: Response) => {
    fs.readFile('./db/data.json', 'utf-8', (error, data) => {
        if (error) {
            res.send("Terjadi kesalahan pada pembacaan file");
            return;
        }
        const IspData = JSON.parse(data) as { id: number; ispData: string[] }[];

        // Mengonversi JSON ke teks
        const text = IspData.map((ispData) => {
          
            return ispData.ispData[0].replace(/\}(\d+)$/, "} $1");
        }).join("\n");

        res.type('text').send(text);
    });
});

app.post('/multi-isp-status', (req, res) => {
    const {  ispData } = req.body;
    
    fs.readFile('./db/data.json', 'utf-8', (error, data) => {
        if (error) {
            res.send("terjadi kesalahan saat baca database");
            return;
        }
        const IspData = JSON.parse(data) as { ispData: string[] }[];
        const newIspData = { ispData };
        IspData.push(newIspData);

        fs.writeFile('./db/data.json', JSON.stringify(IspData, null, 2), (error) => {
            if(error) {
                res.send("terjadi kesalahan saat menulis database");
                return;
            }
            res.type('text').send("IspData Berhasil ditambahkan"); // Set response type to text
        });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
