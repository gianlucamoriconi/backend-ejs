const Products = require(__dirname + '/data/products/Products.js');
const express = require('express');
const app = express();
const { Router } = express; 
const hostname = 'localhost';
const Port = '8080';
const router = Router();
const products = new Products(__dirname + '/data/products.json');
app.use(express.json());
app.use(express.urlencoded({
    extended: true 
}));


app.set('views', __dirname + '/src/views');
app.set('view engine', 'pug');


app.get('/', (req, res)=>{
    let products_read = products.getAll();
    const layout = "productList";
    const title = "Todos los productos"
    res.render('index', {products_read, title, layout});
});

app.get('/productos', (req, res)=>{
    let products_read = products.getAll();
    const layout = "productList";
    const title = "Todos los productos"
    res.render('index', {products_read, title, layout});
});

app.get('/agregar-producto', (req, res)=>{
    const layout = "addForm";
    const title = "Agregar nuevo producto";
    res.render('index', {layout, title});
});

router.get('/', (req, res)=>{
    let products_read = products.getAll();
    products_read = JSON.stringify(products_read, null, 2);
    
    res.header("Content-Type",'application/json');
    res.send(products_read);

    const layout = "productList";
    const title = "Todos los productos"
    res.render('index', {products_read, title, layout});
});

router.post('/productos', (req, res) =>{
    //Cargamos el producto
    const dataProductToAdd = req.body;
    products.save(dataProductToAdd);

    //Luego de cargarlo, lo llevamos a ver todos los productos
    let products_read = products.getAll();
    const layout = "productList";
    const title = "Todos los productos";
    res.render('index', {products_read, layout, title});
});

const server = app.listen(Port, () => {
    console.log(
        `Server started on PORT http://127.0.0.1:${Port} at ${new Date().toLocaleString()}`
    );
});


app.use('/', router);
app.use(express.static(__dirname + '/public'));


