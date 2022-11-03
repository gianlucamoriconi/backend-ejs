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
    try {
        let products_read = products.getAll();
        products_read = JSON.stringify(products_read, null, 2);
        
        res.header("Content-Type",'application/json');
        res.send(products_read);
    }
    catch (err) {
        console.log(err);
    };
});


router.get('/:id', (req, res)=>{
    try {
        const id = req.params.id;
        let get_by_id = products.getById(id);
        get_by_id = JSON.stringify(get_by_id, null, 2);

        res.header("Content-Type",'application/json');
        res.send(get_by_id);
         
    }
    catch (err) {
        console.log(err);
    };
});


router.post('/', (req, res) =>{
    // const { productToAdd } = req.body;
    adding_product = products.save(req.body);
    res.header("Content-Type",'application/json');
    res.send(adding_product);
})


app.use('/api/productos', router)
app.use(express.static('./public'))
app.listen(8080);


