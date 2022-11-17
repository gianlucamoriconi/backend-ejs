const socket = io.connect();

const placeForMessage = document.getElementById("messages");
const inputMessageBox = document.getElementById("messageInput");
const buttonSend = document.getElementById("send-message")

buttonSend.addEventListener('click', () =>{
    const date = new Date();
    //Calculamos la hora argentina restandole 3 a UTC
    var dateHour = date.getUTCHours() - 3;
    var dateMinutes = date.getUTCMinutes();

    if (dateHour < 0) {
        var dateHour = dateHour + 24;
    } 

    const message = {
        user: document.getElementById("username").value,
        text: document.getElementById("messageInput").value,
        dateHour: dateHour,
        dateMinutes: dateMinutes
    };

    socket.emit('new-message', message);
});



function render(data){

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

function addMessage(e){

    return false;
}

socket.on('messages', function(data){
    // const messageHTML = msgs.map( msg => `Usuario: ${msg.socketId} | mensaje: ${msg.message}`).join('<br>');
    render(data);
});