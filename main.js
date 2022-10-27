const Contenedor = require('./container.js');
const express = require('express');
const app = express();
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));


const hostname = 'localhost';
const Port = '8080';



app.get('/productos', async (req, res)=>{
    try {
        const contenedor = new Contenedor("productos");
        let products_read = await contenedor.getAll();
        products_read = JSON.stringify(products_read, null, 2);
        
        res.header("Content-Type",'application/json');
        res.send(products_read);
    }
    catch (err) {
        console.log(err);
    };
});

app.get('/productoRandom', async (req, res)=>{
    try {
        const contenedor = new Contenedor("productos");
        const getRandomProduct = await contenedor.getRandom();
        const randomProduct = JSON.stringify(getRandomProduct, null, 2);

        res.header("Content-Type",'application/json');
        res.send(randomProduct);
    }
    catch (err) {
        console.log(err);
    }
});


const server = app.listen(Port, () => {
    console.log(`El servidor se está ejecutando en http://${hostname}:${Port}/`);
});


server.on('error', (err) => console.log(`Error: ${err}`));
