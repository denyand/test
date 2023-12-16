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

interface IspEntry {
  id: string;
  ispData: string[];
}

app.post('/multi-isp-status', (req, res) => {
  const newIspData: IspEntry = req.body;

  fs.readFile('./db/data.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send("Error reading from database");
      return;
    }

    let IspData: IspEntry[] = JSON.parse(data);

    // Cari entri berdasarkan ID
    const existingIspIndex = IspData.findIndex(isp => isp.id === newIspData.id);

    if (existingIspIndex !== -1) {
      // Perbarui data yang ada dengan ID yang sama
      IspData[existingIspIndex] = newIspData;
    } else {
      // Tambahkan data baru jika ID tidak ditemukan
      IspData.push(newIspData);
    }

    fs.writeFile('./db/data.json', JSON.stringify(IspData, null, 2), (writeErr) => {
      if (writeErr) {
        res.status(500).send("Error writing to database");
        return;
      }

      res.send(`Data ISP berhasil ${existingIspIndex !== -1 ? 'diperbarui' : 'ditambahkan'}.`);
    });
  });
});



app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
