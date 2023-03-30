import { io, Socket } from "socket.io-client";
import { parseStatus } from "../../response/user.response";
import { api_base, user_endpoint } from "../sdk/api";
import { defaultLogoutTime, emergencySvg, greenDot, greyDot, selfButton, helpSvg, messageBackgroundClass, messageContentClass, messageUsernameClass, okSvg, undefinedSvg } from "../utils/constants";
import { User, Message, Room, LocalStorageInfo } from "../utils/entity";
import { allUsers, getRoom, getUser, newRoom, updateUser } from "../sdk/sdk";

import { directoryHTML } from "../utils/constants";
import { OnlineStatus, Status } from "../utils/enum";

class Directory extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = directoryHTML;
    }
}

customElements.define('directory-page', Directory);


const localStorageInfo: LocalStorageInfo = {
    id: localStorage.getItem("id") || "",
    username: localStorage.getItem("username") || "",
    token: ("Bearer " + localStorage.getItem("token")) as string,
    room: localStorage.getItem("room") || ""
}

const socket: Socket = io(api_base + `/?userid=${localStorageInfo.id}`, {
    transports: ["websocket"],
});

async function getUsers() {
    const res = await allUsers();
    const userList: User[] = [];
    res.forEach((user) =>
        userList.push({
            id: user.id,
            username: user.username,
            onlineStatus: user.onlineStatus,
            status: user.status,
        })
    );
    displayUsers(userList);
}

socket.on("connect", () => {
    socket.on("all users", (users) => {
        const allUsers: User[] = [];
        users.forEach((user) =>
            allUsers.push({
                id: user.id,
                username: user.username,
                onlineStatus: user.onlineStatus,
                status: user.status,
            })
        );
        displayUsers(allUsers);
    });
});

function createChatButton(user_id: string) {
    return `<button class="justify-items-center text-2xl dark:text-white" id="chat-${user_id}" value = "${user_id}">Chat</button>`;
}

function createUserHTML(user: User) {
    const div = document.createElement("div");
    const html = `
    <div class="flex justify-center mb-4">
        <span class="ml-[10%] mr-auto mt-0.5">
            ${user.onlineStatus === OnlineStatus.ONLINE ? greenDot : greyDot
        }
        </span>
         <span class="ml-[5%] mr-[5%] w-[20%] inline-block overflow-auto">
            <span class="text-2xl inline-block" id="${user.id}">
                ${user.username}
            </span>
        </span>
        <span class="ml-[5%] mr-[5%] inline-block">
            <span class="flex items-center" id="${user.id}">
                ${displayStatus(user.status)}
            </span>
        </span>
        <span class="mr-[10%] w-20 h-8 bg-[#C41230] rounded-lg ml-auto flex justify-center">
            ${user.id !== localStorageInfo.id ? createChatButton(user.id) : selfButton}
         </span>
    </div>`;
    div.innerHTML = html;
    return div;
}

async function displayUsers(users: User[]) {
    const userQuery = document.querySelector("#user-list");
    userQuery!.innerHTML = `<div class="mt-4"></div>`;
    users.forEach((user) => {
        const div = createUserHTML(user);
        userQuery!.appendChild(div);
        const chat = document.getElementById("chat-" + user.id);
        if (chat) {
            chat!.onclick = async () => {
                const users: string[] = [localStorageInfo.id, user.id];
                const messageBody = {
                    idList: users,
                };
                const res = await newRoom(localStorageInfo.token, messageBody);
                storeRoomInfoAndRedirect(res.id);
            };
        }
    });
}

function storeRoomInfoAndRedirect(roomId: string) {
    localStorage.setItem("room", roomId);
    window.location.href = "chat.html";

}

function displayStatus(status: Status) {
    switch (status) {
        case Status.OK:
            return okSvg;
        case Status.EMERGENCY:
            return emergencySvg;
        case Status.HELP:
            return helpSvg;
        default:
            return undefinedSvg;
    }
}

async function getLatestMessage(messages: Message[], rooms: Room[]) {
    const fetchPromises = rooms.map(async (room) => {
        const res = await getRoom(localStorageInfo.token, room.id);
        res.messages.forEach((message) => {
            message.room = res;
            messages.push(message);
        });
    });
    await Promise.all(fetchPromises);
    messages.sort((a: Message, b: Message) =>
        Number(BigInt(a.time) - BigInt(b.time))
    );
    return messages.slice(-1)[0];
}

async function checkUnreadMessages() {
    const userUrl = new URL(user_endpoint + "/" + `${encodeURIComponent(localStorageInfo.id)}`);
    const user = await getUser(localStorageInfo.token, userUrl.toString());
    const rooms: Room[] = user.rooms || [];
    const messages: Message[] = [];
    const msg = await getLatestMessage(messages, rooms);
    console.log(messages.length);
    if (msg) {
        if (user.logoutTime !== defaultLogoutTime) {
            if (BigInt(msg.time) > BigInt(user!.logoutTime)) {
                createNotification(msg);
                const notification = document.getElementById("notification");
                if (notification) {
                    setTimeout(() => {
                        notification.classList.add("hidden");
                    }, 3000);
                }
            }
        }
    }
    await updateUser(localStorageInfo.token, localStorageInfo.id, defaultLogoutTime);
}

function createNotificationHTML(msg: Message) {
    const div = document.createElement("div");
    div.id = "notification";
    div.innerHTML = `
    <div ${messageBackgroundClass}>
        <p>
            <span ${messageUsernameClass}>${msg.sender.username}
            <span>${parseStatus(msg.sender.status)}</span></span>
        </p>
        <p ${messageContentClass}>${msg.content}</p> 
    </div>`;
    return div;
}

function createNotification(msg: Message) {
    const div = createNotificationHTML(msg);
    const banner = document.getElementById("banner");
    banner!.innerHTML = "";
    document.querySelector("#banner")?.appendChild(div);
    div.onclick = async () => {
        removeNotificationAndRedirect(msg.room.id, div);
    };
}

function removeNotificationAndRedirect(room: string, div: HTMLElement) {
    localStorage.setItem("room", room);
    document.querySelector("#banner")?.removeChild(div);
    window.location.href = "chat.html";
}

getUsers();
checkUnreadMessages();