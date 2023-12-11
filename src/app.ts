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

app.get('/about', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.get('/multi-isp-status', (req: Request, res: Response) => {
    fs.readFile('./db/data.json', 'utf-8', (error, data) => {
        if (error) {
            res.send("terjadi kesalahan pada pembacaan file");
            return;
        }
        res.send(JSON.parse(data));
    });
});

app.get('/multi-isp-status/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    
    fs.readFile('./db/data.json', 'utf-8', (error, data) => {
        if (error) {
            res.send('gagal dalam baca database');
            return;
        }
        
        const multiIspStatus = JSON.parse(data) as { id: number; ispData: string[] }[];
        const IspStatus = multiIspStatus.find(status => status.id === Number(id));
        if (!IspStatus) {
            res.send('ISP status dengan ID tersebut tidak ditemukan');
            return;
        }
        res.send(IspStatus);
    });
});

app.post('/multi-isp-post', (req, res) => {
    const { id, ispData } = req.body;
    
    fs.readFile('./db/data.json', 'utf-8', (error, data) => {
        if (error) {
            res.send("terjadi kesalahan saat baca database");
            return;
        }
        const IspData = JSON.parse(data) as { id: number; ispData: string[] }[];
        const newIspData = { id: Number(id), ispData };
        IspData.push(newIspData);

        fs.writeFile('./db/data.json', JSON.stringify(IspData, null, 2), (error) => {
            if(error) {
                res.send("terjadi kesalahan saat menulis database");
                return;
            }
            res.send("IspData Berhasil ditambahkan");
        });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
