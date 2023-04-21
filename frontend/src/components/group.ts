import { io, Socket } from "socket.io-client";
import { api_base } from "../sdk/api";
import { getChatGroup, getRoom, joinChatGroup } from "../sdk/sdk";
import { groupChatHTML } from "../utils/constants";
import { LocalStorageInfo, Room, UpdateChatGroupInput } from "../utils/entity";
import { RoomType } from "../utils/enum";

class GroupChatList extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = groupChatHTML;
    }
}

customElements.define('group-list', GroupChatList);


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
  const res = await getChatGroup(localStorageInfo.token);
  const rooms: Room[] = res|| [];
  console.log(res);
  displayRooms(rooms);
  createGroup();
}

function displayType(type: RoomType) {
    switch (type) {
        case RoomType.EXCAVATE:
            return `<span style="color: #FF5722  ; font-weight: bold; text-shadow: 1px 1px black;">Excavate</span>`;
        case RoomType.RESCUE:
            return `<span style="color: Red; font-weight: bold; text-shadow: 1px 1px black;">Rescue</span>`;
        case RoomType.SEARCH:
            return `<span style="color: #2196F3; font-weight: bold; text-shadow: 1px 1px black;">Search</span>`;
        case RoomType.MONITOR:
            return `<span style="color: #4CAF50; font-weight: bold; text-shadow: 1px 1px black;">Monitor</span>`;
        default:
            return "Undefined";
    }
}

function displayRoomHTML(room: Room){
    const div = document.createElement("div");
    const html = `<div class="mt-4"></div>
                <div class="flex justify-center mb-4">
                    <span class="ml-[5%] mr-auto w-[12%]" id="chat-history-${room.id}">
                        <div class="text-2xl" id="${room.id}">
                        ${room.id}
                        </div>
                    </span>
                    <span class="ml-[5%] mr-[5%] w-[15%]" id="chat-history-${room.id}-type">
                        <div class="text-2xl" id="${room.id}-type">
                        ${displayType(room.type)}
                        </div>
                    </span>
                    <span class="mr-[5%] w-20 h-10 bg-[#C41230] rounded-lg ml-auto flex justify-center">
                        <button class="justify-items-center text-2xl dark:text-white" id="join-${room.id}">
                            Join
                        </button>
                    </span></div>`;
    div.innerHTML = html;
    document.querySelector("#group-list")?.appendChild(div);
}

async function joinRoomAndRedirect(room: Room){
    const updateInput: UpdateChatGroupInput = {
        userId: localStorageInfo.id,
        isJoin: true,
    };
    await joinChatGroup(localStorageInfo.token, updateInput, room.id);
    localStorage.setItem("room", room.id);
    window.location.href = "chat.html";
}

function displayRooms(rooms: Room[]) {
  rooms.forEach((room) => {
   displayRoomHTML(room);
    const join = document.getElementById("join-"+room.id);
    if (join) {
      join.onclick = () => {
        joinRoomAndRedirect(room);
      };
    }
    getLatestHistory("chat-history-" + room.id);
  });
}

function createGroup(){
    const create = document.getElementById("create-group");
    if (create) {
        create.onclick = () => {
          createGroupRedirect();
        };
      }
}

function createGroupRedirect(){
    window.location.href = "create_group.html";
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
