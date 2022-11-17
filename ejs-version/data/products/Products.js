const fs = require('fs');
class Products {

    constructor(fileName='products.json'){
        this.fileName = fileName;
        this.getAll();
    }


    getAll(){
        try{
            let getProducts = fs.readFileSync(this.fileName);

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
    

    // Obtener producto por su ID
    getById(id){
        id = Number(id);
        let products = this.getAll();
        
        var result = [];

        if (products.length !== 0){

            if (products.some((item) => item.id === id)){
                products.map((it) => {
                    if (it.id === id){
                        console.log(it);
                        result = it;
                    }
                });
            } else {
                console.log(`El producto de ID: ${id} no fue encontrado`);
                result = `El producto de ID: ${id} no fue encontrado`;
            }

            return result;

        } else{
            console.log("No se puede buscar por ID porque la lista de productos está vacía.");
            return "No se puede buscar por ID porque la lista de productos está vacía.";
        }  

    }    

    //Escribir/Sobreescribir archivo
    save(product){
        var productsRead = this.getAll();
        console.log(productsRead);

        if (productsRead.length === 0){
            console.log("Está vacío");
            var productToAdd = product;

            productToAdd.id = 1;
            productToAdd = [productToAdd];
            productToAdd = JSON.stringify(productToAdd, null, 2);
    
            fs.writeFile(this.fileName, productToAdd)
            .then(res => {
                console.log(`Guardaste el primer producto de la lista, el id es: 1`)
                return "Guardaste el primer producto de la lista, el id es: 1";
            })
    
            .catch(error => {
                console.log(`No fue posible guardar el archivo con este único producto: ${error}`);
            })
        }
       
        else {
            var productToAdd = product;
            let idsArray = [];
    
            productsRead.map((prod) =>{
                if (prod.hasOwnProperty("id")){
                    idsArray.push(prod.id);
                }
            });

            let maxId = idsArray.sort((a,b)=> a-b)[idsArray.length-1];
            let id = maxId + 1;

            productToAdd.id = id;
            let productsUpdate = productsRead.push(productToAdd); 
            productsUpdate = JSON.stringify(productsRead, null, 2);

            try{
                fs.promises.writeFile(this.fileName, productsUpdate);
                return `El producto fue creado bajo el id ${id}`;
            }
    
            catch (error){
                console.log(`No fue posible sumar el producto en el archivo: ${error}`);
                return error;
            }
        }
    }


    update(idParam, product){
        idParam = Number(idParam);
        var productsRead = this.getAll();
        var updateData = product;
        //Nos aseguramos que al actualizar, el ID se mantenga y no se modifique con el id que podría estar en
        //el cuerpo del body
        updateData.id = idParam;

        if (productsRead.some( (item) => item.id === idParam)) {
            console.log("Existe el producto con ese ID");
            let productUpdate = productsRead.filter(prod => prod.id !== updateData.id);
            productUpdate.push(updateData);
            fs.promises.writeFile(this.fileName, JSON.stringify(productUpdate, null, 2))
            console.log(productUpdate);
            return `La información del producto ${idParam} fue actualizada.`
        }

        else{
            return `No existe ningún producto con el id ${idParam}. Antes de actualizar o editar un producto, es necesario que lo crees.`;
        }
    }


      //Borrar producto por ID
    deleteById(id){
        id = Number(id);
        let products = this.getAll();

        if (products.length !== 0){
            //Revisamos si existe el producto con ese ID
            if (products.some((item) => item.id === id)){
                
                //Filtramos el producto a eliminar del listado recuperado
                products = products.filter((item) => item.id !== id);
                try{
                    //Escribimos el listado con el producto ya filtrado
                    fs.promises.writeFile(this.fileName, JSON.stringify(products, null, 2))
                    console.log(`El producto con ID ${id} fue borrado`);
                    return `El producto con ID ${id} fue borrado`;
                }

                catch (err){
                    console.log(`El producto con ID ${id} no pudo ser borrado: ${err}`);
                    return `El producto con ID ${id} no pudo ser borrado: ${err}`;
                }

            }
            
            else {
                console.log(`El producto con id ${id} no existe`);
                return `El producto con id ${id} no existe`
            } 
        }
        
        else {
            console.log("No se puede eliminar por ID porque la lista de productos está vacía.");
            return "No se puede eliminar por ID porque la lista de productos está vacía.";
        }
    }

    //Borrar todos los productos
    deleteAll(){

        let products = this.getAll();

        if (products.length > 0){
            try{
                fs.promises.writeFile(this.fileName, JSON.stringify([], null, 2))
                console.log('Todos los productos fueron borrados');
            }
    
            catch (err){
                console.log(`No fue posible borrar el contenido del archivo: ${err}`);
            }
        }

        else {
            console.log("No hay productos por borrar, la lista está vacía.")
        }

    }

}


module.exports = Products;