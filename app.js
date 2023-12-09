const { error } = require('console');
const express = require('express');
const app = express();
const port = 3000;
const fs= require('fs')

//middleware
app.use(express.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.send('halo')
})

app.get('/about', (req, res )=>{
    console.log (__dirname)
    res.sendFile('./public/about.html', {root:__dirname})
})
app.get('/multi-isp-status', (req, res)=>{
fs.readFile('./db/data.json', 'utf-8', (error, data) => {
    if (error) res.send ("terjadi kesalahan pada pembacaan file")

    res.send (JSON.parse(data))
})
})

app.get('/multi-isp-status/:id', (req, res)=> {
    console.log(req.params);
    
    const{ id, ispData}= req.params;
    console.log(id, ispData, 'id dan nama isp')
    fs.readFile('./db/data.json', 'utf-8', (error, data) => {
        if (error) 
            res.send('gagal dalam baca database');
        
        const multiIspStatus = JSON.parse(data);
        console.log(multiIspStatus);
        

        //filter dari database
        const IspStatus = multiIspStatus.find(IspStatus => IspStatus.id === Number(id));
        if (!IspStatus) res.send('ISP status dengan ID tersebut tidak ditemukan')
    res.send(IspStatus)
    })
})

app.post('/multi-isp-post', (req, res)=> {
    const{ id, ispData}= req.body;
    
    fs.readFile ('./db/data.json',(error, data) => {
        if (error) res.send ("terjadi kesalahan saat baca database")
        const IspData = JSON.parse(data)
    const newIspData = {
            id:Number(id),
            ispData
        }
        IspData.push(newIspData)

        fs.writeFile('./db/data.json', JSON.stringify
        (IspData, null, 2), (error) =>{
            if(error) res.send("terjadi kesalahan saat menulis database")
            res.send("IspData Berhasil ditambahkan")
        })
    })
})

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});