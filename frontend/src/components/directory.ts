import { io, Socket } from "socket.io-client";
import { parseStatus } from "../../response/user.response";
import { api_base, user_endpoint } from "../sdk/api";
import { defaultLogoutTime, emergencySvg, greenDot, greyDot, selfButton, helpSvg, messageBackgroundClass, messageContentClass, messageUsernameClass, okSvg, undefinedSvg } from "../utils/constants";
import { User, Message, Room, LocalStorageInfo } from "../utils/entity";
import { allUsers, getRoom, getUser, getUserProfile, newRoom, updateUser } from "../sdk/sdk";

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
    room: localStorage.getItem("room") || "",
    role: Number(localStorage.getItem("role"))
}

const profileModal = document.getElementById("profile-modal");

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
        <span class="ml-5 mr-auto mt-auto">
            ${user.onlineStatus === OnlineStatus.ONLINE ? greenDot : greyDot
        }
        </span>
         <span class="ml-auto mr-auto mt-auto mb-auto inline-block overflow-auto">
            <span class="text-lg inline-block" id="${user.id}">
                ${user.username}
            </span>
        </span>
        <span class="ml-auto mr-auto mt-auto mb-auto inline-block">
            <span class="flex items-center" id="${user.id}">
                ${displayStatus(user.status)}
            </span>
        </span>
        ${localStorageInfo.role === 0 ? createProfileButton(user.id): ''}
        <span class="mr-5 w-16 h-8 bg-[#C41230] rounded-lg ml-auto flex justify-center">
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

        const profile = document.getElementById("profile-" + user.id);

        if (profile) {
            profile!.onclick = () => {
                renderProfileModal(user.id);
            }
        }
    });
}

const renderProfileModal = async (userId: string) => {
    const userProfile = await getUserProfile(localStorageInfo.token, userId);
    profileModal!.classList.remove("hidden");
    profileModal!.innerHTML = `<div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
    <div class="flex h-screen">
        <div class="p-0 m-auto w-4/5 h-3/5 overflow-auto rounded-lg bg-gray-300 bg-opacity-100 border-2">
            <div class="modal-content flex flex-col justify-between h-full text-2xl">
                <div class="ml-5 flex flex-col justify-between">
                    <div class="text-esn-red">Username</div>
                    <input id="profile-username" class="w-5/6" placeholder=${userProfile.username} />
                </div>

                <div class="ml-5 mt-auto">
                    <div class="text-esn-red">New Password</div>
                    <input id="profile-username-input" class="w-5/6" placeholder="password" />
                </div>

                <div class="ml-5 mt-auto">
                    <div class="text-esn-red">Role</div>
                    <div class="w-5/6 mt-2 flex flex-col">
                        <text>Admin</text>
                        <text>Coordinator</text>
                        <text>Citizen</text>
                    </div>
                </div>

                <div class="ml-5 mt-auto">
                <div class="text-esn-red">AccountStatus</div>
                <div class="w-5/6 mt-2 flex justify-between">
                <text>Active</text>
                <text>InActive</text>
                </div>
                </div>

                <div class="ml-5 w-5/6 mt-auto flex justify-between">
                    <div id="profile-save-button" class="w-24 h-8 bg-esn-red rounded-lg flex justify-center text-white">Save</div>
                    <div id="profile-cancel-button" class="w-24 h-8 bg-opacity-0 border-2 border-esn-red rounded-lg flex justify-center text-black">Cancel</div>
                </div>
            </div>
        </div>
    </div>
</div>`;


    const saveButton = document.getElementById("profile-save-button");
    const cancelButton = document.getElementById("profile-cancel-button");

    saveButton!.onclick = () => {
        profileModal!.classList.add("hidden");
        console.log(userProfile);
    }

    cancelButton!.onclick = () => {
        profileModal!.classList.add("hidden");
    }
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
function createProfileButton(id: string) {
    return `<div class="ml-auto mr-auto" id="profile-${id}">
    <svg stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="w-7 h-7 stroke-white stroke-width-1">
    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"></path>
  </svg></div>`;
}
