const Products = require('./products/Products.js');
const express = require('express');
const app = express();
const { Router } = express;
app.use(express.json());
app.use(express.urlencoded({
    extended: true 
}));


const hostname = 'localhost';
const Port = '8080';
const router = Router();
const products = new Products(__dirname + '/data/products.json')

router.get('/', (req, res)=>{
    let products_read = products.getAll();
    products_read = JSON.stringify(products_read, null, 2);
    
    res.header("Content-Type",'application/json');
    res.send(products_read);
});


router.get('/:id', (req, res)=>{
    const id = req.params.id;
    let get_by_id = products.getById(id);
    get_by_id = JSON.stringify(get_by_id, null, 2);

    res.header("Content-Type",'application/json');
    res.send(get_by_id);
});


router.post('/', (req, res) =>{
    const dataProductToAdd = req.body;
    const adding_product = products.save(dataProductToAdd);
    res.send({"message": adding_product, "Información del producto creado": dataProductToAdd});
});

router.put('/:id', (req, res) =>{
    const id = req.params.id;
    const updateData = req.body
    let updating_product = products.update(id, updateData);
    res.send({"message": updating_product, "Información del producto actualizado": updateData});
});

router.delete('/:id', (req, res)=>{
    const id = req.params.id;
    let delete_by_id = products.deleteById(id);
    res.send(delete_by_id);
});


app.use('/api/productos', router)
app.use(express.static('./public'))
app.listen(8080);


