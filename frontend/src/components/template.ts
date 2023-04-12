import { api_base } from "../sdk/api";
import { parseStatus } from "../../response/user.response";
import { io, Socket } from "socket.io-client";
import { LocalStorageInfo, Message } from "../utils/entity";
import { messageBackgroundClass, messageContentClass, messageUsernameClass, templateHTML } from "../utils/constants";
import { logout, updateStatus } from "../sdk/sdk";
import { Status } from "../utils/enum";

class TemplateElement extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.innerHTML = templateHTML;
  }
}

customElements.define("menu-template", TemplateElement);

const localStorageInfo: LocalStorageInfo = {
  id: localStorage.getItem("id") || "",
  username: localStorage.getItem("username") || "",
  token: localStorage.getItem("token") || "",
  room: localStorage.getItem("room") || ""
}
const formattedToken = ("Bearer " + localStorageInfo.token) as string;
const setting =
  document.getElementById("setting-button") || new HTMLDivElement();
const menuModal =
  document.getElementById("setting-modal");
const statusModal =
  document.getElementById("status-modal");
const back = document.getElementById("back-button");
const search = document.getElementById("search-icon");
const changeStatus =
  document.getElementById("change-status");
const logoutButton = document.getElementById("logout-button");
const chatList = document.getElementById("chat-button");
const lastword = document.getElementById("emergency-button");
const directory =
  document.getElementById("directory-button");
const statusOK = document.getElementById("status-ok");
const statusEmergency =
  document.getElementById("status-emergency");
const statusHelp =
  document.getElementById("status-help");
const options = document.getElementById("options");

const socket: Socket = io(api_base + `?userid=${localStorageInfo.id}`, {
  transports: ["websocket"],
});

function clickNotification(msg: Message, div: HTMLElement) {
  localStorage.setItem("room", msg.room.id);
  document.querySelector("#banner")?.removeChild(div);
  window.location.href = "chat.html";
}

function displaySearchButton(){
  const url = window.location.href.split('/');
  const href = url[url.length-1]
  console.log(href);
  if(href == 'chat_list.html' || href == 'search.html'){
    search?.classList.add('hidden');
  }
  else{
    search?.classList.remove('hidden');
  }
}
displaySearchButton();

export function createNotification(msg: Message) {
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
  div.onclick = async () => {
    clickNotification(msg, div);
  };
  displayNotification();
}

function displayNotification() {
  const notification = document.getElementById("notification");
  if (notification) {
    setTimeout(() => {
      notification.classList.add("hidden");
    }, 3000);
  }
}

socket.on("connect", () => {
  socket.on("chat message", (msg) => {
    const user_list = msg.room.id.split("-");
    const user_name = localStorage.getItem("username");
    const url = window.location.href.split("/").slice(-1)[0];

    user_list.forEach((element) => {
      if (
        element === user_name &&
        msg.sender.id !== localStorageInfo.id &&
        url !== "chat.html"
      ) {
        createNotification(msg);
      }
    });
  });
});

if (!localStorageInfo.id || !localStorageInfo.token) {
  window.location.href = "index.html";
}

function displayMenu(){
  menuModal!.style.display = "block";
  back!.classList.remove("hidden");
  options?.classList.add("hidden");
}

function selectStatus(){
  statusModal!.style.display = "block";
  menuModal!.style.display = "none";
}

function clickBack() {
  menuModal!.style.display = "none";
  statusModal!.style.display = "none";
  back!.classList.add("hidden");
}

setting!.onclick = async () => {
  displayMenu();
};


changeStatus!.onclick = async () => {
  selectStatus();
};

back!.onclick = () => {
  clickBack();
};

search!.onclick = () => {
  const url = window.location.href.split('/');
  const href = url[url.length-1]
  localStorage.setItem('searchCriteria', href.replace('.html', ''));
  window.location.href = "search.html";
}

logoutButton!.onclick = async () => {
  await logout(localStorageInfo.id);
};

chatList!.onclick = () => {
  window.location.href = "chat_list.html";
};

lastword!.onclick = () => {
  window.location.href = "last_words.html";
}

directory!.onclick = () => {
  window.location.href = "directory.html";
};

statusOK!.onclick = async () => {
  updateStatus(formattedToken,localStorageInfo.id, Status.OK);
};

statusHelp!.onclick = async () => {
  updateStatus(formattedToken,localStorageInfo.id, Status.HELP);
};

statusEmergency!.onclick = async () => {
  updateStatus(formattedToken,localStorageInfo.id, Status.EMERGENCY);
};
