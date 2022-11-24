const fs = require("fs");

class Carts {
    constructor(db='carts.json'){
        this.db = db;
        this.getCarts();
    }

    createCart(dataCart) {
        try {
            if (fs.existsSync(this.db)) {

                const date = new Date();
                const numberTwoDigits = (num, places) => String(num).padStart(places, '0');
                
                let dateMonth = date.getUTCMonth();
                let dateDay = date.getUTCDay();

                //Calculamos la hora argentina restandole 3 a UTC
                var dateHour = date.getUTCHours() - 3;
                if (dateHour < 0) {
                    dateHour = dateHour + 24;
                } 
                dateHour = numberTwoDigits(dateHour, 2);

                let dateMinutes = date.getUTCMinutes();
                dateMinutes = numberTwoDigits(dateMinutes, 2);

                let dateSeconds = date.getUTCSeconds();
                dateSeconds = numberTwoDigits(dateSeconds, 2);

                const cart = JSON.parse(fs.readFileSync(this.db, 'utf-8'));

                if (cart.length === 0) {
                    const newCart = {
                        id: 1,
                        timestamp: `${dateDay}/${dateMonth} ${dateHour}: ${dateMinutes} : ${dateSeconds}`,
                        products: products,
                    };
                    cart.push(newCart);
                    fs.writeFileSync(this.db, JSON.stringify(cart, null, 4), 'utf-8')
                    res.status(201).send(`New cart created. ID:${newCart.id}`);
                } else {
                    const lastCartId = cart[cart.length - 1].id;
                    const newCartId = lastCartId + 1;
                    const newCart = {
                        id: newCartId,
                        timestamp: `${dateDay}/${dateMonth} ${dateHour}: ${dateMinutes} : ${dateSeconds}`,
                        products: products,
                    };
                    cart.push(newCart);
                    fs.writeFileSync(this.db, JSON.stringify(cart, null, 4), 'utf-8')
                    res.status(201).send(`New cart created. ID:${newCart.id}`);
                }
            } else {
                const cart = [];
                const newCart = req.body;
                newCart.id = 1;
                cart.push(newCart);
                fs.writeFileSync(this.db, JSON.stringify(cart, null, 4), 'utf-8');
            }
        }

        catch (err) {
            console.log(`An error ocurred in create cart method: ${err}`);
        }
    }

    getCarts() {
        try {

            if (fs.existsSync(this.db)) {
                let getCarts = fs.readFileSync(this.db);

                if (getCarts.length === 0){
                    console.log("El archivo está vacío.");
                    return "El archivo está vacío.";
                }

                else {
                    getCarts = JSON.parse(getCarts);
                    console.log("El archivo tiene carritos.");
                    return getCarts;
                }
            }
            
            else {
                return "There's nothing here!";
            }
        }
        catch (err) {
            return `An error ocurred in get cart method: ${err}`;
        }
    }


    getCart(id) {

        id = Number(id);
        let carts = this.getCarts();
        
        var result = [];

        if (carts !== "El archivo está vacío."){

            if (carts.some((item) => item.id === id)){
                carts.map((it) => {
                    if (it.id === id){
                        console.log(it);
                        result = it;
                    }
                });
            } else {
                console.log(`El carrito de ID: ${id} no fue encontrado`);
                result = `El carrito de ID: ${id} no fue encontrado`;
            }

            return result;

        } else{
            console.log("No se puede buscar por ID porque la lista de carritos está vacía.");
            return "No se puede buscar por ID porque la lista de carritos está vacía.";
        }  

    }

    async deleteById(id) {
        try {
            let admin = true;
            if (fs.existsSync(this.db)) {
                const idParams = req.params.id;
                const getCart = await JSON.parse(fs.readFileSync(this.db, 'utf-8'));
                const filterProducts = getCart.filter( item => item.id !== Number(idParams));
                fs.writeFileSync(this.db, JSON.stringify(filterProducts, null, 4));
                filterProducts.length == getCart.length ? res.send(`No cart matches ID:${idParams}`) : res.send(filterProducts);
            }
        }
        catch (err) {
            res.send(`An error ocurred in delete by id cart method: ${err}`);
        }
    }

    addToCartById(id) {
        try {
            let admin = true;
            if (fs.existsSync(this.db)) {
                const idParams = req.params.id;
                const getProducts = JSON.parse(fs.readFileSync('./products.json', 'utf-8'));
                const getCart = JSON.parse(fs.readFileSync(this.db, 'utf-8'));
                const findCart = getCart.find( item => item.id === Number(idParams));
                if (findCart !== undefined) {
                    const arrayFromFindProducts = findCart.products;
                    const arrayForPush = arrayFromFindProducts.concat(getProducts);
                    findCart.products = arrayForPush;
                    fs.writeFileSync(this.db, JSON.stringify(getCart, null, 4));
                    res.send(`Product added to cart with ID:${idParams} successfully!`);
                } else {
                    res.send(`No cart with ID:${idParams}`);
                };
            } else {
                res.send(`No cart file provided. Please add one.`);
            }
        }
        catch (err) {
            res.send(`An error ocurred in add cart by id method: ${err}`);
        }
    }

    deleteFromCartById(id) {
        try {
            let admin = true;
            if (fs.existsSync(this.db)) {
                const idCartParams = Number(req.params.id);
                const idProductParams = Number(req.params.id_product);
                const getCart = JSON.parse(fs.readFileSync(this.db, 'utf-8'));
                const getProducts = JSON.parse(fs.readFileSync('./products.json', 'utf-8'));
                const filterProduct = getProducts.filter( product => product.id !== idProductParams);
                const filterCart = getCart.filter( cart => cart.id !== idCartParams);

                filterProduct.length == getProducts.length ? 
                    console.log(`No product matches ID:${idProductParams}`) :
                    console.log(`Product with ID:${idProductParams} deleted successfully!`);
                fs.writeFileSync('./products.json', JSON.stringify(filterProduct, null, 4));

                filterCart.length == getCart.length ? 
                    console.log(`No cart matches ID:${idCartParams}`) :
                    console.log(`Cart with ID:${idCartParams} deleted successfully!`);
                fs.writeFileSync(this.db, JSON.stringify(filterCart, null, 4));

                res.send(`Some changes may have occured. Please checkout products and cart arrays.`);

            } else {
                res.send(`No cart file provided. Please add a new one.`);
            }
        }
        catch (err) {
            res.send(`An error ocurred in delete product by id in cart method: ${err}`);
        }
    }
}

module.exports = Carts;