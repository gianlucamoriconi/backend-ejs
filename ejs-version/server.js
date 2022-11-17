const Products = require(__dirname + '/data/products/Products.js');
const express = require('express');

const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');

const app = express();

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname));

const { Router } = express; 
const hostname = 'localhost';
const Port = '8080';
const router = Router();
const products = new Products(__dirname + '/data/products.json');
app.use(express.json());
app.use(express.urlencoded({
    extended: true 
}));

const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

const messages = [];
const productsS = [];

io.on('connection', socket => {
    console.log('Nuevo cliente conectado.');
    socket.emit('messages', messages);

    socket.on('new-message', data => {
        messages.push(data);
        io.sockets.emit('messages', messages);
    });
});



app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', (req, res)=>{
    let products_read = products.getAll();
    const layout = "productList";
    const title = "Todos los productos"
    res.render('pages/index', {products_read, title, layout});
});

app.get('/agregar-producto', (req, res)=>{
    const layout = "addForm";
    const title = "Agregar nuevo producto";
    res.render('pages/index', {layout, title});
});

router.get('/', (req, res)=>{
    let products_read = products.getAll();
    let products_read_parsed = JSON.stringify(products_read, null, 2);
    
    res.header("Content-Type",'application/json');
    res.send(products_read_parsed);

    const layout = "productList";
    const title = "Todos los productos"
    res.render('pages/index', {products_read_parsed, title, layout});

    io.on('connection', socket => {
        let products_read = products.getAll();
        socket.emit('products', products_read);
    
        socket.on('new-products', data => {
            productsS.push(data);
            io.sockets.emit('products', products_read);
        });
    });
});

router.post('/', (req, res) =>{
    //Cargamos el producto
    const dataProductToAdd = req.body;
    products.save(dataProductToAdd);

    //Luego de cargarlo, lo llevamos a ver todos los productos
    let products_read = products.getAll();
    const layout = "productList";
    const title = "Todos los productos";
    res.render('pages/index', {products_read, layout, title});

    io.on('connection', socket => {
        socket.emit('products', products_read);
        console.log('Producto nuevo cargado');
    });

});

const server = httpServer.listen(Port, () => {
    console.log(
        `Server started on PORT http://127.0.0.1:${Port} at ${new Date().toLocaleString()}`
    );
});

server.on('error', error => console.log(`Error en servidor: ${error}`));

app.use('/productos', router);


