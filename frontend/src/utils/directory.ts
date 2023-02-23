import { on } from 'events';
import e from 'express';
import { io, Socket } from 'socket.io-client';
import { OnlineStatusResponse } from '../../response/chat.response';

interface User {
    id: number;
    name: string;
    onlineStatus: boolean;
}

const token = "Bearer " + localStorage.getItem('token') as string;
const socket: Socket = io('http://localhost:3000', { transports: ['websocket'] });
// const chat = document.getElementById('chat-button') || new HTMLDivElement;
let onlineUsers: User[] = [];
let offlineUsers: User[] = [];

const greenDot = `<div class="h-7 w-7 rounded-full bg-green-500"></div>`;
const greyDot = `<div class="h-7 w-7 rounded-full bg-gray-500"></div>`;

async function getUsers() {
    const res = await fetch('http://localhost:3000/api/users', {
        method: 'GET',
        headers: {
            "authorization": token,
            "Content-type": "application/json"
        },
    }).then(response => {
        return response.json();
    });
    res.sort((a, b) => (a.name < b.name) ? -1 : 1);
    res.forEach(user => {
        if (user.onlineStatus) {
            if (user.id != localStorage.getItem('id')) {
                const newUser: User = { id: user.id, name: user.username, onlineStatus: true };
                onlineUsers.push(newUser);
            }
        }
        else {
            const newUser: User = { id: user.id, name: user.username, onlineStatus: false };
            offlineUsers.push(newUser);
        }
    })
    displayUsers(onlineUsers, offlineUsers);
}

// chat.addEventListener('click', async function handleClick(event) {
//     const roomName = `${localStorage.getItem('id')}-`;

//     const res = await fetch('http://localhost:3000/api/room', {
//         method: 'POST',
//         headers: {
//             "authorization": token,
//             "Content-type": "application/json"
//         },
//         body: JSON.stringify(roomName)
//     }).then(response => {
//         return response.json();
//     });
// })

socket.on('connect', () => {
    socket.on('online status', (status: OnlineStatusResponse) => {})

});

function parseMessage(status: OnlineStatusResponse) {
    const onlineUser: User = { id: status.id, name: status.name, onlineStatus: true };
    const offlineUser: User = { id: status.id, name: status.name, onlineStatus: false };
    if (status.onlineStatus) {
        if (!onlineUsers.includes(onlineUser)) {
            onlineUsers.push(onlineUser);
        }
        offlineUsers = offlineUsers.filter(user => { user !== offlineUser });
    }
    else {
        if (!offlineUsers.includes(offlineUser)) {
            offlineUsers.push(offlineUser);
        }
        onlineUsers = onlineUsers.filter(user => { user !== offlineUser });
        console.log(offlineUsers);
    }
}

window.addEventListener('beforeunload', () => {
    navigator.sendBeacon('http://localhost:3000/api/auth/logout');
})

function displayUsers(onlineUsers: User[], offlineUsers: User[]) {
    const userList = document.getElementById('user-list');
    const userQuery = document.querySelector('#user-list');
    if (userList) {
        userList.innerHTML = `<div class="mt-4"></div>`;
    }
    onlineUsers.forEach(user => {
        const div = document.createElement("div");
        const html = `<div class="flex justify-center mb-4">
    <span class="ml-[10%] mr-auto mt-0.5">
        ${user.onlineStatus ? greenDot : greyDot}
    </span>
    <span class="mr-[20%]">
        <span class="text-2xl" id="${user.id}">
            ${user.name}
        </span>
    </span>
    <span class="mr-[10%] w-20 h-8 bg-[#C41230] rounded-lg ml-auto flex justify-center">
        <button class="justify-items-center text-2xl dark:text-white" onclick="myFunction() id="button-${-user.id}">
            Chat
        </button>
    </span>
</div>`;
        div.innerHTML = html;
        userQuery?.appendChild(div);
    });

    offlineUsers.forEach(user => {
        const div = document.createElement("div");
        const html = `<div class="flex justify-center mb-4">
    <span class="ml-[10%] mr-auto mt-0.5">
        ${user.onlineStatus ? greenDot : greyDot}
    </span>
    <span class="mr-[20%]">
        <span class="text-2xl" id="${user.id}">
            ${user.name}
        </span>
    </span>
    <span class="mr-[10%] w-20 h-8 bg-[#C41230] rounded-lg ml-auto flex justify-center">
        <button class="justify-items-center text-2xl dark:text-white" onclick="myFunction() id="button-${-user.id}">
            Chat
        </button>
    </span>
</div>`;
        div.innerHTML = html;
        userQuery?.appendChild(div);
    });
}

getUsers();
displayUsers(onlineUsers, offlineUsers);
