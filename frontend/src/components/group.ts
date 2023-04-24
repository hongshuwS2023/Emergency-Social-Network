import { io, Socket } from "socket.io-client";
import { user_endpoint, api_base, room_endpoint } from "../sdk/api";
import { getChatGroup, getRoom, getUser, joinChatGroup } from "../sdk/sdk";
import { LocalStorageInfo, Room, UpdateChatGroupInput } from "../utils/entity";
import { RoomType } from "../utils/enum";
import { groupChatHTML } from "../utils/chat_constants";

class GroupChatList extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = groupChatHTML;
  }
}

customElements.define("group-list", GroupChatList);

const localStorageInfo: LocalStorageInfo = {
  id: localStorage.getItem("id") || "",
  username: localStorage.getItem("username") || "",
  token: ("Bearer " + localStorage.getItem("token")) as string,
  room: localStorage.getItem("room") || "",
  role: Number(localStorage.getItem("role")),
};
const socket: Socket = io(api_base + `?userid=${localStorageInfo.id}`, {
  transports: ["websocket"],
});
const history = document.getElementById("chat-history");
const header = document.getElementById("chat-history")?.innerHTML || "";

async function getRooms() {
  const res = await getChatGroup(localStorageInfo.token);
  const rooms: Room[] = res || [];
  //console.log(res);
  displayRooms(rooms);
  createGroup();
}

socket.on("connect", () => {
  socket.on("create group", (room) => {
    displayRoomHTML(room);
    const join = document.getElementById("join-" + room.id);
    if (join) {
      join.onclick = () => {
        joinRoomAndRedirect(room);
      };
    }
  });
});

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

function displayRoomHTML(room: Room) {
  const div = document.createElement("div");
  const html = `<div class="mt-4"></div>
                <div class="flex justify-center mb-4">
                    <span class="ml-[5%] mr-auto w-[12%]" id="chat-history-${
                      room.id
                    }">
                        <div class="text-2xl" id="${room.id}">
                        ${room.id}
                        </div>
                    </span>
                    <span class="ml-[5%] mr-[5%] w-[15%]" id="chat-history-${
                      room.id
                    }-type">
                        <div class="text-2xl" id="${room.id}-type">
                        ${displayType(room.type)}
                        </div>
                    </span>
                    <span class="mr-[5%] w-20 h-10 bg-[#C41230] rounded-lg ml-auto flex justify-center">
                        <button class="justify-items-center text-2xl dark:text-white" id="join-${
                          room.id
                        }">
                            Join
                        </button>
                    </span></div>`;
  div.innerHTML = html;
  document.querySelector("#group-list")?.appendChild(div);
}

async function joinRoomAndRedirect(room: Room) {
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
    console.log(room);
    //console.log(room.users);
    const index = room.users.findIndex(
      (element) => element.id === localStorageInfo.id
    );
    //console.log(index);
    if (index === -1) {
      displayRoomHTML(room);
      const join = document.getElementById("join-" + room.id);
      if (join) {
        join.onclick = () => {
          joinRoomAndRedirect(room);
        };
      }
    }
  });
}

function createGroup() {
  const create = document.getElementById("create-group");
  if (create) {
    create.onclick = () => {
      createGroupRedirect();
    };
  }
}

function createGroupRedirect() {
  window.location.href = "create_group.html";
}

getRooms();
