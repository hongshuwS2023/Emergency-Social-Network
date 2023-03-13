import { io, Socket } from 'socket.io-client';
import { OnlineStatus } from '../../response/chat.response';
import { api_base, user_endpoint } from '../sdk/api';

interface User {
    id: number;
    name: string;
    onlineStatus: OnlineStatus;
}

const token = "Bearer " + localStorage.getItem('token') as string;


const id = localStorage.getItem('id') || '';
const socket: Socket = io(api_base+`/?userid=${id}`, { transports: ['websocket'] });
const chat_button = `<button class="justify-items-center text-2xl dark:text-white" onclick="myFunction() id="button-chat">Chat</button>`;
const hakan_button = `<button class="justify-items-center text-2xl dark:text-white" onclick="myFunction() id="button-chat">Me</button>`;
const greenDot = `<div class="h-7 w-7 rounded-full bg-green-500"></div>`;
const greyDot = `<div class="h-7 w-7 rounded-full bg-gray-500"></div>`;

async function getUsers() {
    const res = await fetch(user_endpoint, {
        method: 'GET',
        headers: {
            "authorization": token,
            "Content-type": "application/json"
        },
    }).then(response => {
        return response.json();
    });
    const allUsers: User[] = [];
    res.forEach(user => allUsers.push({ id: user.id, name: user.username, onlineStatus: user.onlineStatus }));
    displayUsers(allUsers);
}

socket.on('connect', () => {
    socket.on('online status', (users) => {
        const allUsers: User[] = [];
        users.forEach(user => allUsers.push({ id: user.id, name: user.username, onlineStatus: user.onlineStatus }));
        displayUsers(allUsers);
    })

});

function displayUsers(users: User[]) {
    const userList = document.getElementById('user-list');
    const userQuery = document.querySelector('#user-list');
    if (userList) {
        userList.innerHTML = `<div class="mt-4"></div>`;
    }
    users.forEach(user => {
        const div = document.createElement("div");
        const html = `
        <div class="flex justify-center mb-4">
            <span class="ml-[10%] mr-auto mt-0.5">
                ${user.onlineStatus === OnlineStatus.ONLINE ? greenDot : greyDot}
            </span>
             <span class="mr-[20%]">
                <span class="text-2xl" id="${user.id}">
                    ${user.name}
                </span>
            </span>
            <span class="mr-[10%] w-20 h-8 bg-[#C41230] rounded-lg ml-auto flex justify-center">
                ${user.id !== Number(id) ? chat_button : hakan_button}
             </span>
        </div>`;
        div.innerHTML = html;
        userQuery?.appendChild(div);
    });
}

getUsers();
