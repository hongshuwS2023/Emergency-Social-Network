import { user_endpoint, logout_endpoint, api_base } from "../sdk/api";
import { parseStatus, Status } from "../../response/user.response";
import { io, Socket } from "socket.io-client";
import { Message } from "./directory";

const html = `
<div class="absolute top-5 w-full" id="banner">
</div>
<div class="absolute w-screen h-[5%] bg-cover bottom-0 bg-[#C41230] flex justify-center">
    <div class="justify-items-start mr-auto ml-1">
        <div class="w-8 h-8" id="directory-button">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg> 
        </div>
    </div>
    <div class="justify-items-center mt-auto mb-auto">
        <div class="w-8 h-8" id="chat-button">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
             </svg>
        </div>
    </div>
    <div class=" justify-items-end justify-center ml-auto mr-1">
        <div class="w-8 h-8" id="setting-button">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        </div>
    </div>
</div>

<div class="absolute left-5 top-5 z-50">
    <div class="w-8 h-8 hidden" id="back-button">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" class="stroke-black dark:stroke-white">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
        </svg> 
    </div>
</div>

<div id="setting-modal" class="absolute modal hidden fixed">
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
        <div class="flex h-screen">
            <div class="p-0 m-auto w-3/5 h-2/5 overflow-auto rounded-lg bg-gray-300 bg-opacity-100 border-2">
                <div class="modal-content flex flex-col justify-between h-full">
                    <div class="mt-8 text-center text-2xl">
                        <button id="profile-button" class="text-esn-red">Profile</button>
                    </div>

                    <div class="mt-4 text-center text-2xl">
                        <button id="change-status" class="text-esn-red">Change status</button>
                    </div>

                    <div class="mt-4 mb-8 text-center">
                        <button id="logout-button" class="text-esn-red text-2xl font-bold">Logout</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div id="status-modal" class="absolute modal hidden fixed">
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
        <div class="flex h-screen">
            <div class="p-0 m-auto w-3/5 h-3/5 overflow-auto rounded-lg bg-gray-300 bg-opacity-100 border-2">
                <div class="modal-content flex flex-col justify-between h-full">
                    <div class="mt-8">
                        <button id="status-ok" class="ml-auto mr-auto text-2xl text-esn-red flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-7 h-7 mr-2 stroke-white stroke-width-2 fill-green-600 bg-green-600">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                        OK</button>
                        <div class="text-xs text-center">
                            I am OK: I do not need help.
                        </div>
                    </div>
        
                    <div class="mt-4 text-center">       
                        <button id="status-help" class="text-esn-red ml-auto mr-auto text-2xl flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"  class="w-7 h-7 mr-2 stroke-white stroke-width-2 fill-yellow-600 bg-yellow-600">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                            </svg>    
                        Help</button>
                        <div class="text-xs text-center">
                            I need help, but this is not a life threatening emergency.
                        </div>
                    </div>
        
                    <div class="mt-4 mb-8 text-center">
                        <button id="status-emergency" class="ml-auto mr-auto text-2xl text-esn-red flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-7 h-7 mr-2 stroke-white stroke-width-1 bg-red-600 inline">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg> 
                        Emergency</button>
                        <div class="text-xs text-center">
                            I need help now: this is a life threatening emergency!
                         </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
`;

const template = document.createElement("template");
template.innerHTML = html;

class TemplateElement extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.innerHTML = template.innerHTML;
  }
}

customElements.define("menu-template", TemplateElement);

const id = localStorage.getItem("id") || "";
const formattedToken = ("Bearer " + localStorage.getItem("token")) as string;
const token = localStorage.getItem("token") || "";
const setting =
  document.getElementById("setting-button") || new HTMLDivElement();
const menuModal =
  document.getElementById("setting-modal") || new HTMLDivElement();
const statusModal =
  document.getElementById("status-modal") || new HTMLDivElement();
const back = document.getElementById("back-button") || new HTMLDivElement();
const changeStatus =
  document.getElementById("change-status") || new HTMLDivElement();
const logout = document.getElementById("logout-button") || new HTMLDivElement();
const chatList = document.getElementById("chat-button") || new HTMLDivElement();
const directory =
  document.getElementById("directory-button") || new HTMLDivElement();
const statusOK = document.getElementById("status-ok") || new HTMLDivElement();
const statusEmergency =
  document.getElementById("status-emergency") || new HTMLDivElement();
const statusHelp =
  document.getElementById("status-help") || new HTMLDivElement();

const socket: Socket = io(api_base + `?userid=${id}`, {
  transports: ["websocket"],
});

export function createNotification(msg: Message) {
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

socket.on("connect", () => {
  socket.on("chat message", (msg) => {
    const user_list = msg.room.id.split("-");
    const user_name = localStorage.getItem("username");
    const url = window.location.href.split("/").slice(-1)[0];

    user_list.forEach((element) => {
      console.log(element);
      console.log(msg.sender.id);
      console.log(window.location.href);
      if (
        element === user_name &&
        msg.sender.id !== id &&
        url !== "chat.html"
      ) {
        createNotification(msg);
        const notification = document.getElementById("notification");
        if (notification) {
          setTimeout(() => {
            notification.classList.add("hidden");
          }, 3000);
        }
      }
    });
  });
});

if (!id || !token) {
  window.location.href = "index.html";
}

setting.onclick = async () => {
  menuModal.style.display = "block";
  back.classList.remove("hidden");
};

changeStatus.onclick = async () => {
  statusModal.style.display = "block";
  menuModal.style.display = "none";
};

back.onclick = () => {
  menuModal.style.display = "none";
  statusModal.style.display = "none";
  back.classList.add("hidden");
};

logout.onclick = async () => {
  await fetch(logout_endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: id }),
  })
    .then((response) => {
      response.json();
    })
    .then(() => {
      localStorage.removeItem("id");
      localStorage.removeItem("token");
      location.href = "index.html";
    });
};

chatList.onclick = () => {
  window.location.href = "chat_list.html";
};

directory.onclick = () => {
  window.location.href = "directory.html";
};

statusOK.onclick = async () => {
  await fetch(user_endpoint, {
    method: "PUT",
    headers: {
      authorization: formattedToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: id,
      status: Status.OK,
      statusTimeStamp: new Date().getTime(),
    }),
  });
  console.log(id);
};

statusHelp.onclick = async () => {
  await fetch(user_endpoint, {
    method: "PUT",
    headers: {
      authorization: formattedToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: id,
      status: Status.HELP,
      statusTimeStamp: new Date().getTime(),
    }),
  });
};

statusEmergency.onclick = async () => {
  await fetch(user_endpoint, {
    method: "PUT",
    headers: {
      authorization: formattedToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: id,
      status: Status.EMERGENCY,
      statusTimeStamp: new Date().getTime(),
    }),
  });
};
