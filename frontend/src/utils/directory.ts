import { io, Socket } from "socket.io-client";
import {  OnlineStatus, parseStatus, Status} from "../../response/user.response";
import { api_base, room_endpoint, user_endpoint } from "../sdk/api";

export interface User {
  id: string;
  username: string;
  onlineStatus: OnlineStatus;
  status: Status;
}
export interface Room {
  id: string;
}

export interface Message {
  id: string;
  sender: User;
  status: Status;
  content: string;
  time: string;
  room: Room;
}

const token = ("Bearer " + localStorage.getItem("token")) as string;

const id = localStorage.getItem("id") || "";

const socket: Socket = io(api_base + `/?userid=${id}`, {
  transports: ["websocket"],
});
const hakan_button = `<button class="justify-items-center text-2xl dark:text-white" id="button-me">Me</button>`;
const greenDot = `<div class="h-7 w-7 rounded-full bg-green-500"></div>`;
const greyDot = `<div class="h-7 w-7 rounded-full bg-gray-500"></div>`;

const okSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-7 h-7 stroke-white stroke-width-2 fill-green-600 bg-green-600">
<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
</svg>`;
const emergencySvg = ` <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-7 h-7 stroke-white stroke-width-1 bg-red-600 inline">
<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
</svg>`;
const helpSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"  class="w-7 h-7 stroke-white stroke-width-2 fill-yellow-600 bg-yellow-600">
<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
</svg>`;
const undefinedSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-7 h-7 stroke-white stroke-width-2 bg-black">
<path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
</svg>`;

async function getUsers() {
  const res = await fetch(user_endpoint, {
    method: "GET",
    headers: {
      authorization: token,
      "Content-type": "application/json",
    },
  }).then((response) => {
    return response.json();
  });
  const allUsers: User[] = [];
  res.forEach((user) =>
    allUsers.push({
      id: user.id,
      username: user.username,
      onlineStatus: user.onlineStatus,
      status: user.status,
    })
  );
  displayUsers(allUsers);
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

function create_chat_button(user_id: string) {
  return `<button class="justify-items-center text-2xl dark:text-white" id="chat-${user_id}" value = "${user_id}">Chat</button>`;
}

async function displayUsers(users: User[]) {
  const userList = document.getElementById("user-list");
  const userQuery = document.querySelector("#user-list");
  if (userList) {
    userList.innerHTML = `<div class="mt-4"></div>`;
  }
  users.forEach((user) => {
    const div = document.createElement("div");
    const html = `
        <div class="flex justify-center mb-4">
            <span class="ml-[10%] mr-auto mt-0.5">
                ${
                  user.onlineStatus === OnlineStatus.ONLINE ? greenDot : greyDot
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
                ${user.id !== id ? create_chat_button(user.id) : hakan_button}
             </span>
        </div>`;
    div.innerHTML = html;
    userQuery?.appendChild(div);
    const chat = document.getElementById("chat-" + user.id);

    if (chat) {
      chat.addEventListener("click", async () => {
        const users: string[] = [id, user.id];
        const messageBody = {
          idList: users,
        };

        const res = await fetch(room_endpoint, {
          method: "POST",
          headers: {
            authorization: token,
            "Content-type": "application/json",
          },
          body: JSON.stringify(messageBody),
        }).then((response) => {
          return response.json();
        });
        localStorage.setItem("room", res.id);
        window.location.href = "chat.html";
      });
    }
  });
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

async function checkUnreadMessages() {
  const userUrl = new URL(user_endpoint + "/" + `${encodeURIComponent(id)}`);
  const user = await fetch(userUrl.toString(), {
    method: "GET",
    headers: {
      authorization: token,
      "Content-type": "application/json",
    },
  }).then((response) => {
    return response.json();
  });
  const rooms: Room[] = user.rooms || [];
  const messages: Message[] = [];
  const fetchPromises = rooms.map(async (room) => {
    const res = await fetch(room_endpoint + "/" + room.id, {
      method: "GET",
      headers: {
        authorization: token,
        "Content-type": "application/json",
      },
    }).then((response) => {
      return response.json();
    });
    res.messages.forEach((message) => {
      message.room = res;
      messages.push(message);
    });
  });
  await Promise.all(fetchPromises);
  console.log(messages.length);
  messages.sort((a: Message, b: Message) =>
    Number(BigInt(a.time) - BigInt(b.time))
  );
  const msg = messages.slice(-1)[0];
  if (msg) {
    if (user.logoutTime !== "-1") {
      if (BigInt(msg.time) > BigInt(user.logoutTime)) {
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
  const newUser = await fetch(user_endpoint, {
    method: "PUT",
    headers: {
      authorization: token,
      "Content-type": "application/json",
    },
    body: JSON.stringify({ id: id, logoutTime: "-1" }),
  }).then((response) => {
    return response.json();
  });
}

function createNotification(msg: Message) {
  const messageBackgroundClass =
    'class="grid bg-gray-300 rounded-lg dark:bg-grey-100 w-4/5 h-[10%] ml-auto mr-auto text-xl duration-300 notification transition ease-in-out"';
  const messageUsernameClass = 'class="float-left ml-1 mt-1"';
  const messageContentClass = 'class="ml-1 mb-1"';
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
  const banner = document.getElementById("banner") || new HTMLDivElement();
  banner.innerHTML = "";
  document.querySelector("#banner")?.appendChild(div);
  div.addEventListener("click", async () => {
    localStorage.setItem("room", msg.room.id);
    document.querySelector("#banner")?.removeChild(div);
    window.location.href = "chat.html";
  });
}

getUsers();
checkUnreadMessages();
