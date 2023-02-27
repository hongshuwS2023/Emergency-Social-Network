import { io, Socket } from 'socket.io-client';
import MessageResponse from '../../response/chat.response';

const id = localStorage.getItem('id') || '';
const socket: Socket = io(`http://localhost:3000/?userid=${id}`, { transports: ['websocket'] });
const formattedToken = "Bearer " + localStorage.getItem('token') as string;
const join = document.getElementById('join-button') || new HTMLDivElement;
const history = document.getElementById('chat-history') || new HTMLDivElement;
const header = document.getElementById('chat-history')?.innerHTML || '';

async function getLatestHistory() {
    const url = new URL('http://localhost:3000/api/messages');
    url.searchParams.set('roomName', 'public');
    const res = await fetch(url.toString(), {
        method: 'GET',
        headers: {
            "authorization": formattedToken,
            "Content-type": "application/json"
        },
    }).then(response => {
        return response.json();
    })
    if (res.length > 0) {
        const msg = res.slice(-1)[0];
        document.querySelector('#chat-history')?.append(displayMessage(msg.user.username, msg.content));
    }
}

socket.on('connect', () => {
    socket.on('public message', (msg: MessageResponse) => {
        history.innerHTML = header;
        document.querySelector('#chat-history')?.append(displayMessage(msg.username, msg.content));
    });
});

function formatHistory(username: string, content: string) {
    const history = `${username}: ${content}`;
    if (history.length >= 20) {
        return `${history.substring(0, 20)}...`;
    }
    else {
        return history;
    }
}

join.addEventListener('click', () => {
    window.location.href = 'chat.html';
})

function displayMessage(username: string, content: string){
    const div = document.createElement("div");
        div.innerHTML = `
        <div class="text-xs">
            ${formatHistory(username, content)}
        </div>`;
    return div;
}

getLatestHistory();