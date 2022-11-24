const addToCart = (item, counter) => {
    if (isInCart(item.id) === true){
      
      cart.map((itemInCart) => {
        if (itemInCart.id === item.id){
          itemInCart.quantity = itemInCart.quantity + counter
          setCart([...cart]); 
        //   itemAddedNotify(item.name, counter);
        }
      });


    } else{
      setCart([...cart, item])
    //   itemAddedNotify(item.name, counter);
      
    }
  }
  
  const removeItem = (id) => {
    setCart([...cart.filter((item) => item.id !== id)])
  }

  const removeAllItems = () => {
    setCart([]);
  }
  
  const isInCart = (id) => {
    return cart.some((item) => item.id === id)
  }

//   function itemAddedNotify(product, counter){
//     toast.success(`Agregaste ${counter} "${product}" al carrito`, {
//       position: "top-right",
//       autoClose: 1000,
//       hideProgressBar: true,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//       progress: undefined,
//       });
//   }

  const totalAmountInCart = () => {
    let totalAmount = 0;
    cart.forEach((itemInCart) => {
      totalAmount = totalAmount + (itemInCart.price * itemInCart.quantity);
    });

    return totalAmount;
  }