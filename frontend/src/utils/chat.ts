import { io, Socket } from 'socket.io-client';
import MessageResponse from '../../response/chat.response'
import { Status } from '../../response/chat.response';
import { parseStatus } from '../../response/chat.response';


const socket: Socket = io('http://localhost:3000', { transports: ['websocket'] });

const send = document.getElementById('send-button') || new HTMLDivElement();
const menu = document.getElementById('menu-button') || new HTMLDivElement();
const modal = document.getElementById("menu-modal") || new HTMLDivElement();
const back = document.getElementById("back-button") || new HTMLDivElement();
const token = "Bearer " + localStorage.getItem('token') as string;

send.addEventListener('click', async function handleClick(event) {
    const messageBody = {
        userId: Number(localStorage.getItem('id')),
        content: (document.getElementById('input') as HTMLInputElement).value,
    }
    console.log(messageBody);

    const res = await fetch('http://localhost:3000/api/messages', {
        method: 'POST',
        headers: {
            "authorization": token,
            "Content-type": "application/json"
        },
        body: JSON.stringify(messageBody)
    }).then(response => {
        console.log(messageBody.userId);
        return response.json();
    })
    console.log(res);
});

menu.addEventListener('click', async function handleClick(event) {
    modal.style.display = "block"
    back.onclick = function () {
        modal.style.display = "none";
    };
});

socket.on('connect', () => {
    socket.on('public message', (msg: MessageResponse) => {
        console.log('message from server:', msg);
        displayMessage(msg.username, msg.status, msg.content, msg.time);
    });

});


const messageBackgroundClass = 'class="grid bg-gray-300 rounded-lg dark:bg-grey-100 w-4/5 h-auto ml-auto mr-auto mt-4 text-xs"';
const messageUsernameClass = 'class="float-left ml-1 mt-1"';
const messageTimeClass = 'class="float-right mr-1 mt-1"';
const messageContentClass = 'class="ml-1 mb-1"';

function displayMessage(username: string, status: Status, message: string, time: string) {
    const div = document.createElement("div");
    div.innerHTML = `<div ${messageBackgroundClass}>
    <p>
        <span ${messageUsernameClass}>${username}
        <span>${parseStatus(status)}</span></span>
        <span ${messageTimeClass}>${time}</span>
    </p>
    <p ${messageContentClass}>${message}</p> </div>`;
    document.querySelector('#history')?.appendChild(div);
}

async function getHistory() {
    const res = await fetch('http://localhost:3000/api/messages', {
        method: 'GET',
        headers: {
            "authorization": token,
            "Content-type": "application/json"
        },
    }).then(response => {
        return response.json();
    })
    res.forEach(msg => {
       displayMessage(msg.user.username, msg.user.status, msg.content, msg.time);
        console.log(msg);
    });
}

getHistory();