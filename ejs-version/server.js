const Products = require(__dirname + '/data/products/Products.js');
const Carts = require(__dirname + '/data/carts/Carts.js');
const express = require('express');

const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');

const app = express();

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname));

const { Router } = express; 
const hostname = 'localhost';
const Port = '8080';
const routerServer = new Router();
const products = new Products(__dirname + '/data/products/products.json');

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

routerServer.get('/', (req, res)=>{
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

routerServer.post('/', (req, res) =>{
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


//Cart

const routerCart = new Router();
const carts = new Carts(__dirname + '/data/carts/carts.json');


app.use('/api/cart', routerCart);

//Crear carrito
routerCart.post('/', (req, res) =>{
    const dataCart = req.body;
    const cartResponse = carts.createCart(dataCart);
    res.header("Content-Type",'application/json');
    res.send(cartResponse);
});

//Agregar producto al carrito
routerCart.post('/:id/products', (req, res) =>{
    const id = req.params.id;
    const dataCart = req.body;
    carts.addToCartById(id, dataCart);
});

//Obtener carritos
routerCart.get("/", (req, res) =>{
    const getCarts = carts.getCarts();
    let cartsParsed = JSON.stringify(getCarts, null, 2);
    
    res.header("Content-Type",'application/json');
    res.send(cartsParsed);
});

//Obtener carrito
routerCart.get("/:id/products", (req, res) =>{
    const id = req.params.id;
    const cartIdResponse = carts.getCart(id);
    res.header("Content-Type",'application/json');
    res.send(cartIdResponse);
});

//Borrar carrito
routerCart.delete("/:id", (req, res) =>{
    const id = req.params.id;
    const cartDeleteByIdResponse = carts.deleteCartById(id);
    res.header("Content-Type",'application/json');
    res.send(cartDeleteByIdResponse);
});

//Borrar producto de carrito
routerCart.delete("/:id/products/:id_product", (req, res) =>{
    const id = req.params.id;
    const idProduct = req.params.id_product;
    carts.deleteById(id, idProduct);
});


const server = httpServer.listen(Port, () => {
    console.log(
        `Server started on PORT http://127.0.0.1:${Port} at ${new Date().toLocaleString()}`
    );
});

server.on('error', error => console.log(`Error en servidor: ${error}`));

app.use('/productos', routerServer);
app.use('/api/cart', routerCart);