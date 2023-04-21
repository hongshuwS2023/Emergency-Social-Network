import { io, Socket } from "socket.io-client";
import { user_endpoint, api_base, room_endpoint } from "../sdk/api";
import { getRoom, getUser } from "../sdk/sdk";
import { chatListHTML } from "../utils/constants";
import { LocalStorageInfo, Room } from "../utils/entity";
import { RoomType } from "../utils/enum";

class ChatList extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = chatListHTML;
    }
}

customElements.define('chat-list', ChatList);


const localStorageInfo: LocalStorageInfo = {
  id: localStorage.getItem("id") || "",
  username: localStorage.getItem("username") || "",
  token: ("Bearer " + localStorage.getItem("token")) as string,
  room: localStorage.getItem("room") || "",
  role: Number(localStorage.getItem("role"))
}
const socket: Socket = io(api_base + `?userid=${localStorageInfo.id}`, {
  transports: ["websocket"],
});
const history = document.getElementById("chat-history");
const header = document.getElementById("chat-history")?.innerHTML || "";

async function getRooms() {
  
  const userUrl = new URL(user_endpoint + "/" + `${encodeURIComponent(localStorageInfo.id)}`);
  const res = await getUser(localStorageInfo.token, userUrl.toString());
  const rooms: Room[] = res.rooms || [];
  console.log(rooms);
  
  displayRooms(rooms);
}

async function displayRoomHTML(room: Room, roomName:string){
    const div = document.createElement("div");
    const html = `<div class="mt-4"></div>
                <div class="flex justify-center mb-4">
                    <span class="ml-[10%] mr-auto" id="chat-history-${roomName}">
                        <div class="text-2xl" id="${roomName}">
                        ${roomName}
                        </div>
                    </span>
                    <span class="mr-[10%] w-20 h-10 bg-[#C41230] rounded-lg ml-auto flex justify-center">
                        <button class="justify-items-center text-2xl dark:text-white" id="join-${room.id}">
                            Join
                        </button>
                    </span></div>`;
    div.innerHTML = html;
    document.querySelector("#room-list")?.appendChild(div);
}

function joinRoomAndRedirect(room: Room){
    localStorage.setItem("room", room.id);
    window.location.href = "chat.html";
}

function displayRooms(rooms: Room[]) {
  rooms.forEach(async (room) => {
    let roomName = room.id;
    const res = await getRoom(localStorageInfo.token, room.id);
    if(res.type===RoomType.UNDEFINED&&room.id!=='public'){
      roomName = res.users[0].username+'-'+res.users[1].username;
    }
   displayRoomHTML(room, roomName);
    const join = document.getElementById("join-"+room.id);
    if (join) {
      join.onclick = () => {
        joinRoomAndRedirect(room);
      };
    }
    getLatestHistory("chat-history-" + room.id);
  });
}

socket.on("connect", () => {
  socket.on("chat message", (msg) => {
    if (history) {
      history.innerHTML = header;
      document
        .querySelector("#chat-history")
        ?.append(displayMessage(msg.sender.username, msg.content));
    }
  });
});

async function getLatestHistory(room_id: string) {
    const res = await getRoom(localStorageInfo.token, room_id);
    if (res.messages) {
      const msg = res.messages.slice(-1)[0];    
      document
        .querySelector("#chat-history-"+room_id)
        ?.append(displayMessage(msg.sender.username, msg.content));
    }
  }

function formatHistory(username: string, content: string) {
  const history = `${username}: ${content}`;
  if (history.length >= 20) {
    return `${history.substring(0, 20)}...`;
  } else {
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

getRooms();
