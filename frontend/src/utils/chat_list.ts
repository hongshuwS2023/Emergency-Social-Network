import { io, Socket } from 'socket.io-client';
import MessageResponse from '../../response/chat.response';
const id = localStorage.getItem('id') || '';
const socket: Socket = io(`http://localhost:3000/?userid=${id}`, { transports: ['websocket'] });
const formattedToken = "Bearer " + localStorage.getItem('token') as string;
const history = document.getElementById('chat-history') || new HTMLDivElement;
const header = document.getElementById('chat-history')?.innerHTML || '';
async function getRooms() {
    const userUrl = new URL(`http://localhost:3000/api/users/${encodeURIComponent(id)}`);
    const res = await fetch(userUrl.toString(), {
        method: 'GET',
        headers: {
            "authorization": formattedToken,
            "Content-type": "application/json"
        },
    }).then(response => {
        return response.json();
    });
    const rooms: string[] = res.rooms || [];
    displayRooms(rooms);
}
function displayRooms(rooms: string[]) {
    rooms.forEach(room => {
        const div = document.createElement("div");
        const html =
            `<div class="flex flex-col bg-[#D9D9D9] h-full max-h-[60vh] w-full rounded-lg dark:bg-grey-100 overflow-auto"
                id="room-list">
                <div class="mt-4"></div>
                <div class="flex justify-center mb-4">
                    <span class="ml-[10%] mr-auto" id="chat-history">
                        <div class="text-2xl" id="${room}">
                        ${room}
                        </div>
                    </span>
                    <span class="mr-[10%] w-20 h-10 bg-[#C41230] rounded-lg ml-auto flex justify-center">
                        <button class="justify-items-center text-2xl dark:text-white" id="${room}">
                            Join
                        </button>
                    </span>
                </div>
            </div>`;
        div.innerHTML = html;
        document.querySelector('#chat-list')?.appendChild(div);
        const join = document.getElementById(room) || new HTMLDivElement;
        join.addEventListener('click', () => {
            localStorage.setItem('room',room)
            window.location.href = 'chat.html';
        })
    })
}
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
function displayMessage(username: string, content: string) {
    const div = document.createElement("div");
    div.innerHTML = `
        <div class="text-xs">
            ${formatHistory(username, content)}
        </div>`;
    return div;
}
//getLatestHistory();
getRooms();