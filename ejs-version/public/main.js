const socket = io.connect();
const formatterAR = new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const placeForMessage = document.getElementById("messages");
const inputMessageBox = document.getElementById("messageInput");
const buttonSend = document.getElementById("send-message");
const placeForProducts = document.getElementById("product-list");

buttonSend.addEventListener('click', () =>{
    const date = new Date();
    //Calculamos la hora argentina restandole 3 a UTC
    var dateHour = date.getUTCHours() - 3;
    var dateMinutes = date.getUTCMinutes();

    const numberTwoDigits = (num, places) => String(num).padStart(places, '0');

    if (dateHour < 0) {
        var dateHour = dateHour + 24;
    } 

    const message = {
        user: document.getElementById("username").value,
        text: document.getElementById("messageInput").value,
        dateHour: numberTwoDigits(dateHour, 2),
        dateMinutes: numberTwoDigits(dateMinutes, 2)
    };

    socket.emit('new-message', message);
});



function renderMessage(data){

    const html = data.map((msg, i) =>{
        return (`<div class="message bg-dark d-flex mb-2">
            <div class="col-10">
                <span class="author fw-bold text-light">${msg.user}:</span>
                <p class="message-text mb-0 text-light">
                    ${msg.text}
                </p>
            </div>
            <div class="col-2 align-self-end">
            <p class="m-0 date text-light text-end">${msg.dateHour}:${msg.dateMinutes}</p>
            </div>
        </div>`)
    }).join(" ");
    placeForMessage.innerHTML = html;

}


function renderProducts(data){

    const html = data.map((item) =>{
        return (`<div id="${item.id}" class="item p-2 col-12 col-md-3 col-lg-4 bg-body rounded">
        <div class="item-image">
            <img class="rounded" src="${item.thumbnail}" alt="product">
        </div>
        <div class="item-info p-3">
            <div class="item-info">
                <h4 class="item-name">${item.title}</h4>
            </div>
            <div class="item-price-container mb-4">
                <span class="fw-bold item-price">$${formatterAR.format(item.price)}</span>
            </div>
        </div>
    </div>`)
    }).join(" ");
    placeForProducts.innerHTML = html;

}


socket.on('messages', function(data){
    renderMessage(data);
});

socket.on('products', function(data){
    renderProducts(data);
});