import { io, Socket } from "socket.io-client";
import { getFormattedDate} from "../../response/user.response";
import { parseStatus } from "../../response/user.response";
import { api_base } from "../sdk/api";
import { getRoom, sendMessage } from "../sdk/sdk";
import { chatHTML, chatMessageBackgroundClass, messageContentClass, messageTimeClass, messageUsernameClass } from "../utils/constants";
import { LocalStorageInfo, MessageBody, MessageContent } from "../utils/entity";

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
    room: localStorage.getItem("room") || ""
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
    res.messages.forEach((msg) => {
        const messageContent: MessageContent = {
            username: msg.sender.username,
            status: msg.status,
            message: msg.content,
            time: getFormattedDate(Number(msg.time))
        };
        displayMessage(
            messageContent
        );
    });
}

function setRoomName() {
    const roomNameDiv = document.createElement("div");
    roomNameDiv.innerHTML = `<p class="text-black dark:text-white text-4xl">${localStorageInfo.room}</p>`;
    document.querySelector("#room-name")?.appendChild(roomNameDiv);
}

setRoomName();
getHistory();
