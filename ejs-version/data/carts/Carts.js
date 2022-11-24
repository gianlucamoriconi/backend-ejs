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
                dateMonth = numberTwoDigits(dateMonth, 2);

                let dateDay = date.getUTCDay();
                dateDay = numberTwoDigits(dateDay, 2);


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
                        timestamp: `${dateDay}/${dateMonth} ${dateHour}:${dateMinutes}:${dateSeconds}`,
                        products: dataCart,
                    };
                    cart.push(newCart);
                    fs.writeFileSync(this.db, JSON.stringify(cart, null, 2));
                    return `New cart created. ID:${newCart.id}`;
                } else {
                    const lastCartId = cart[cart.length - 1].id;
                    const newCartId = lastCartId + 1;
                    const newCart = {
                        id: newCartId,
                        timestamp: `${dateDay}/${dateMonth} ${dateHour}: ${dateMinutes} : ${dateSeconds}`,
                        products: dataCart,
                    };
                    cart.push(newCart);
                    fs.writeFileSync(this.db, JSON.stringify(cart, null, 2));

                    return `New cart created. ID:${newCart.id}`;
                }
            } else {
                const cart = [];
                const newCart = req.body;
                newCart.id = 1;
                cart.push(newCart);
                fs.writeFileSync(this.db, JSON.stringify(cart, null, 2));
                return `New cart created. ID:${newCart.id}`;
            }
        }

        catch (err) {
            console.log(`An error ocurred in create cart method: ${err}`);
            return `An error ocurred in create cart method: ${err}`;
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


    deleteCartById(id){
        id = Number(id);
        let carts = this.getCarts();

        if (carts !== "El archivo está vacío."){

            if (carts.some((item) => item.id === id)){

                carts = carts.filter((item) => item.id !== id);

                try{
                    fs.writeFileSync(this.db, JSON.stringify(carts, null, 2))
                    console.log(`El carrito con ID ${id} fue borrado`);
                    return `El carrito con ID ${id} fue borrado`;
                }

                catch (err){
                    console.log(`El carrito con ID ${id} no pudo ser borrado: ${err}`);
                    return `El carrito con ID ${id} no pudo ser borrado: ${err}`;
                }

            }
            
            else {
                console.log(`El carrito con id ${id} no existe`);
                return `El carrito con id ${id} no existe`
            } 
        }
        
        else {
            console.log("No se puede eliminar por ID porque la lista de carritos está vacía.");
            return "No se puede eliminar por ID porque la lista de carritos está vacía.";
        }
    }


    addToCartById(id, dataProduct) {
        try {
            if (fs.existsSync(this.db)) {
                id = Number(id);
                var carts = this.getCarts();

                var result = [];

                if (typeof dataProduct !== 'object'){
                    result = 'El contenido que enviaste no es un objeto. Por favor, envía el producto a agregar como un objeto, ya que se incorporará en un arreglo.'
                }

                else if (carts.some( (cart) => cart.id === id)) {
                    console.log("Existe el producto con ese ID");

                    carts.map((cart) => {
                        console.log("Maping carts");
                        if (cart.id === id){
                            console.log("El cart ID existe");

                            if (carts.some( (cart) => cart.id === id)) {
                                cart.products.map((product) => {
                                    if (product.id === dataProduct.id) {
                                        let productsInCart = cart.products.filter((prod) => prod.id !== dataProduct.id);
                                        console.log(productsInCart);
                                        productsInCart = [productsInCart, dataProduct];
                                        fs.writeFileSync(this.db, JSON.stringify(productsInCart, null, 2));
                                        console.log("El producto en el carrito existe");
                                        result = `El producto que agregaste ya existía y fue actualizado.`;
                                    }
                                });
                            }

                            else{
                                console.log("El producto en el carrito no existe");
                                cart.products.push(dataProduct);
                                fs.writeFileSync(this.db, JSON.stringify(carts, null, 2));
                                result = `La información del carrito ${id} fue actualizada.`
                            }
                        }
                    });
                }
        
                else{
                    result = `No existe ningún carrito con el id ${id}. Antes de actualizar o editar un carrito, es necesario que lo crees.`;
                }

                return result;

            } else {
                return(`No cart file provided. Please add one.`);
            }
        }
        catch (err) {
            return(`An error ocurred in add cart by id method: ${err}`);
        }
    }

    deleteFromCartById(id) {
        try {
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