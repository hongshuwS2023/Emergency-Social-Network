import { io, Socket } from "socket.io-client";
import { getFormattedDate} from "../../response/user.response";
import { parseStatus } from "../../response/user.response";
import { api_base } from "../sdk/api";
import { getRoom, sendMessage } from "../sdk/sdk";
import { chatHTML, chatMessageBackgroundClass, messageContentClass, messageTimeClass, messageUsernameClass } from "../utils/constants";
import { LocalStorageInfo, MessageBody, MessageContent, Room } from "../utils/entity";
import { AccountStatus, RoomType } from "../utils/enum";

class Chat extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = chatHTML;
    }
}

customElements.define('chat-page', Chat);


const localStorageInfo: LocalStorageInfo = {
    id: localStorage.getItem("id") || "",
    username: localStorage.getItem("username") || "",
    token: ("Bearer " + localStorage.getItem("token")) as string,
    room: localStorage.getItem("room") || "",
    role: Number(localStorage.getItem("role")) 
}
const socket: Socket = io(api_base + `/?userid=${localStorageInfo.id}`, {
    transports: ["websocket"],
});
const send = document.getElementById("send-button");


send!.onclick = async () => {
    const messageBody: MessageBody = {
        userId: localStorageInfo.id,
        content: (document.getElementById("input") as HTMLInputElement).value,
        roomId: localStorageInfo.room,
    };

    if (messageBody.content!.trim().length) {
        sendMessage(localStorageInfo.token, messageBody);
    }
    (document.getElementById("input") as HTMLInputElement).value = "";
};

socket.on("connect", () => {
    socket.on("chat message", (msg) => {
        if (msg.room.id === localStorageInfo.room) {
            const messageContent: MessageContent = {
                username: msg.sender.username,
                status: msg.status,
                message: msg.content,
                time: getFormattedDate(Number(msg.time))
            };
            displayMessage(
                messageContent
            );
        }
    });
});

function displayMessage(
    messageContent: MessageContent
) {
    const div = document.createElement("div");
    div.innerHTML = `<div ${chatMessageBackgroundClass}>
    <p>
        <span ${messageUsernameClass}>${messageContent.username}
        <span>${parseStatus(messageContent.status)}</span></span>
        <span ${messageTimeClass}>${messageContent.time}</span>
    </p>
    <p ${messageContentClass}>${messageContent.message}</p> </div>`;
    document.querySelector("#history")?.appendChild(div);
    const scroll = document.getElementById("history") || new HTMLDivElement();
    scroll.scrollTop = scroll.scrollHeight || 0;
}

async function getHistory() {
    const res = await getRoom(localStorageInfo.token, localStorageInfo.room);
    checkGroup(res);
    res.messages.forEach((msg) => {
        if(msg.sender.accountStatus === AccountStatus.ACTIVE){
            const messageContent: MessageContent = {
            username: msg.sender.username,
            status: msg.status,
            message: msg.content,
            time: getFormattedDate(Number(msg.time))
        };
        displayMessage(
            messageContent
        );
        }
    });
}

function checkGroup(room: Room){
    //console.log(room);
    const search = document.getElementById("search-icon");
    const people = document.getElementById("people-icon");
    if(room.type !== RoomType.UNDEFINED){
        search?.classList.add('hidden');
        people?.classList.remove('hidden');
        if (people) {
            people.onclick = () => {
                window.location.href = "group_people.html";
            };
          }
        
    }else{
        search?.classList.add('hidden');
    }
}

async function setRoomName() {
    const roomNameDiv = document.createElement("div");
    let roomName = localStorageInfo.room
    const res = await getRoom(localStorageInfo.token, localStorageInfo.room);
    if(res.type===RoomType.UNDEFINED&&localStorageInfo.room!=='public'){
      roomName = res.users[0].username+'-'+res.users[1].username;
    }
    roomNameDiv.innerHTML = `<p class="text-black dark:text-white text-4xl">${roomName}</p>`;
    document.querySelector("#room-name")?.appendChild(roomNameDiv);
}

setRoomName();
getHistory();
