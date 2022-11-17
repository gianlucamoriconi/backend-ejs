const socket = io.connect();

const placeForMessage = document.querySelector("#messages");
const inputMessageBox = document.querySelector("#messageInput");
const buttonSend = document.querySelector("#send-message")

buttonSend.addEventListener('click', () =>{
    socket.emit("message", inputMessageBox.value)
});

socket.on('messages', msgs =>{
    const messageHTML = msgs.map( msg => `Usuario: ${msg.socketId} | mensaje: ${msg.message}`).join('<br>');
    placeForMessage.innerHTML = messageHTML;
});