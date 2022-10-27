const fs = require('fs');
class Contenedor {

    constructor(nombre){
        this.nombre = nombre;
    }


    //Leer archivo
   async getAll(){ 
        try{
            let getProducts = await fs.promises.readFile(this.nombre + '.txt', 'utf-8');

            if (getProducts.length === 0){
                console.log("El archivo está vacío.");
                return getProducts;
            }
           
            else {
                getProducts = JSON.parse(getProducts);
                console.log("El archivo tiene productos.");
                return getProducts;
            }
        }

        catch (err){
            console.log(`No se pudo leer el archivo: ${err}`);
        }

    }


    //Obtener producto por su ID
    async getById(id){  

        let products = await this.getAll();    
        if (products.length !== 0){

            if (products.some((item) => item.id === id)){
                products.map((it) => {
                    if (it.id === id){
                        console.log(it);
                    }
                });
            } else {
                console.log(`El producto de ID: ${id} no fue encontrado`);
            }
        } else{
            console.log("No se puede buscar por ID porque la lista de productos está vacía.")
        }  

    }    
    

    //Escribir/Sobreescribir archivo
    async save(producto){

        var products_read = await this.getAll();

        if (products_read.length === 0){
            console.log("Está vacío");
            var productoPorAgregar = producto;

            productoPorAgregar.id = 1;
            productoPorAgregar = [productoPorAgregar];
            productoPorAgregar = JSON.stringify(productoPorAgregar, null, 2);
    
            fs.promises.writeFile(this.nombre + '.txt', productoPorAgregar)
            .then(res => {
                console.log(`Guardaste el primer producto de la lista, el id es: 1`)
            })
    
            .catch(error => {
                console.log(`No fue posible guardar el archivo con este único producto: ${error}`);
            })
        }
       
        else {
            var productoPorAgregar = producto;
            let idsArray = [];
    
            productsRead.map((prod) =>{
                if (prod.hasOwnProperty("id")){
                    idsArray.push(prod.id);
                }
            });

            let maxId = idsArray.sort((a,b)=> a-b)[idsArray.length-1];
            let id = maxId + 1;

            productoPorAgregar.id = id;
            productsRead.push(productoPorAgregar); 
            productsRead = JSON.stringify(productsRead, null, 2);

            fs.promises.writeFile(this.nombre + '.txt', productsRead)
            .then(res => {
                console.log(`El producto fue guardado con el id: ${id}`)
            })

            .catch(error => {
                console.log(`No fue posible sumar el producto en el archivo: ${error}`);
            })
        }

    }

    //Borrar producto por ID
    async deleteById(id){
        let products = await this.getAll();

        if (products.length !== 0){
            //Revisamos si existe el producto con ese ID
            if (products.some((item) => item.id === id)){
                
                //Filtramos el producto a eliminar del listado recuperado
                products = products.filter((item) => item.id !== id);
                try{
                    //Escribimos el listado con el producto ya filtrado
                    await fs.promises.writeFile(this.nombre + '.txt', JSON.stringify(products, null, 2))
                    console.log(`El producto con ID ${id} fue borrado`);
                }

                catch (err){
                    console.log(`El producto con ID ${id} no pudo ser borrado: ${err}`);
                }

            }
            
            else {
                console.log(`El producto con id ${id} no existe`);
            } 
        }
        
        else {
            console.log("No se puede eliminar por ID porque la lista de productos está vacía.")
        }
    }

    //Borrar todos los productos
    async deleteAll(){

        let products = await this.getAll();

        if (products.length > 0){
            try{
                await fs.promises.writeFile(this.nombre + '.txt', JSON.stringify([], null, 2))
                console.log('Todos los productos fueron borrados')
            }
    
            catch (err){
                console.log(`No fue posible borrar el contenido del archivo: ${err}`);
            }
        }

        else {
            console.log("No hay productos por borrar, la lista está vacía.")
        }

    }

    async getRandom() {
        try {
            const getProducts = await this.getAll();
            const randomItem = Math.floor(Math.random()*getProducts.length);
            const getRandom = getProducts[randomItem];
            console.log(getRandom);
            return getRandom;
        }
        catch (err) {
            console.log(`No pudo obtenerse el producto random: ${err}`);
        }
    };

}


module.exports = Contenedor;