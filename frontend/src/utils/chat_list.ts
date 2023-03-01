import { io, Socket } from "socket.io-client";
import MessageResponse from "../../response/chat.response";
import { user_endpoint, api_base, room_endpoint } from "../sdk/api";
const id = localStorage.getItem("id") || "";
localStorage.setItem("room", "public");
const socket: Socket = io(api_base + `?userid=${id}`, {
  transports: ["websocket"],
});
const formattedToken = ("Bearer " + localStorage.getItem("token")) as string;
const history = document.getElementById("chat-history");
const header = document.getElementById("chat-history")?.innerHTML || "";

interface Room {
  id: number;
  name: string;
}

async function getRooms() {
  const userUrl = new URL(user_endpoint + "/" + `${encodeURIComponent(id)}`);
  const res = await fetch(userUrl.toString(), {
    method: "GET",
    headers: {
      authorization: formattedToken,
      "Content-type": "application/json",
    },
  }).then((response) => {
    return response.json();
  });

  const rooms: Room[] = res.rooms || [];
  displayRooms(rooms);
}
function displayRooms(rooms: Room[]) {
  rooms.forEach((room) => {
    const div = document.createElement("div");
    const html = `<div class="mt-4"></div>
                <div class="flex justify-center mb-4">
                    <span class="ml-[10%] mr-auto" id="chat-history-${room.name}">
                        <div class="text-2xl" id="${room.id}">
                        ${room.name}
                        </div>
                    </span>
                    <span class="mr-[10%] w-20 h-10 bg-[#C41230] rounded-lg ml-auto flex justify-center">
                        <button class="justify-items-center text-2xl dark:text-white" id="${room.name}">
                            Join
                        </button>
                    </span></div>`;
    div.innerHTML = html;
    document.querySelector("#room-list")?.appendChild(div);
    const join = document.getElementById(room.name);
    if (join) {
      join.addEventListener("click", () => {
        localStorage.setItem("room", room.name);
        window.location.href = "chat.html";
      });
    }
    getLatestHistory("chat-history-" + room.name);
  });
}
async function getLatestHistory(name: string) {
  const res = await fetch(room_endpoint + "/" + localStorage.getItem("room"), {
    method: "GET",
    headers: {
      authorization: formattedToken,
      "Content-type": "application/json",
    },
  }).then((response) => {
    return response.json();
  });
  if (res) {
    const msg = res.messages.slice(-1)[0];    
    document
      .querySelector("#"+name)
      ?.append(displayMessage(msg.user.username, msg.content));
  }
}
socket.on("connect", () => {
  socket.on("public message", (msg: MessageResponse) => {
    if (history) {
      history.innerHTML = header;
      document
        .querySelector("#chat-history")
        ?.append(displayMessage(msg.username, msg.content));
    }
  });
});
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
