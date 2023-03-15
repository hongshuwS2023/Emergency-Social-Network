import { io, Socket } from "socket.io-client";
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
  id: string;
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
                    <span class="ml-[10%] mr-auto" id="chat-history-${room.id}">
                        <div class="text-2xl" id="${room.id}">
                        ${room.id}
                        </div>
                    </span>
                    <span class="mr-[10%] w-20 h-10 bg-[#C41230] rounded-lg ml-auto flex justify-center">
                        <button class="justify-items-center text-2xl dark:text-white" id="join-${room.id}">
                            Join
                        </button>
                    </span></div>`;
    div.innerHTML = html;
    document.querySelector("#room-list")?.appendChild(div);
    const join = document.getElementById("join-"+room.id);
    if (join) {
      join.addEventListener("click", () => {
        localStorage.setItem("room", room.id);
        window.location.href = "chat.html";
      });
    }
    getLatestHistory("chat-history-" + room.id);
  });
}
async function getLatestHistory(room_id: string) {
  const res = await fetch(room_endpoint + "/" + room_id, {
    method: "GET",
    headers: {
      authorization: formattedToken,
      "Content-type": "application/json",
    },
  }).then((response) => {
    return response.json();
  });
  if (res.messages) {
    const msg = res.messages.slice(-1)[0];    
    document
      .querySelector("#chat-history-"+room_id)
      ?.append(displayMessage(msg.sender.username, msg.content));
  }
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
