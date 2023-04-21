import { io, Socket } from "socket.io-client";
import { api_base, user_endpoint } from "../sdk/api";
import {
  defaultLogoutTime,
  emergencySvg,
  greenDot,
  greyDot,
  selfButton,
  helpSvg,
  messageBackgroundClass,
  messageContentClass,
  messageUsernameClass,
  okSvg,
  undefinedSvg,
} from "../utils/constants";
import {
  User,
  Message,
  Room,
  LocalStorageInfo,
  UpdateChatGroupInput,
} from "../utils/entity";
import { getRoomUsers, joinChatGroup } from "../sdk/sdk";

import { directoryHTML } from "../utils/constants";
import { OnlineStatus, Status } from "../utils/enum";

class PeopleList extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = directoryHTML;
  }
}

customElements.define("chatgroup-people", PeopleList);

const localStorageInfo: LocalStorageInfo = {
  id: localStorage.getItem("id") || "",
  username: localStorage.getItem("username") || "",
  token: ("Bearer " + localStorage.getItem("token")) as string,
  room: localStorage.getItem("room") || "",
};

const socket: Socket = io(api_base + `/?userid=${localStorageInfo.id}`, {
  transports: ["websocket"],
});

async function getUsers() {
  const res = await getRoomUsers(localStorageInfo.token, localStorageInfo.room);
  console.log(res);
  const userList: User[] = [];
  res.users.forEach((user) =>
    userList.push({
      id: user.id,
      username: user.username,
      onlineStatus: user.onlineStatus,
      status: user.status,
      accountStatus: user.accountStatus
    })
  );
  displayUsers(userList);
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
        accountStatus: user.accountStatus
      })
    );
    displayUsers(allUsers);
  });
});

function createUserHTML(user: User) {
  const div = document.createElement("div");
  const html = `
    <div class="flex justify-center mb-4">
        <span class="ml-[10%] mr-auto mt-0.5">
            ${user.onlineStatus === OnlineStatus.ONLINE ? greenDot : greyDot}
        </span>
         <span class="ml-[5%] mr-[5%] w-[35%] inline-block overflow-auto">
            <span class="text-2xl inline-block" id="${user.id}">
                ${user.username}
            </span>
        </span>
        <span class="ml-[5%] mr-[5%] inline-block">
            <span class="flex items-center" id="${user.id}">
                ${displayStatus(user.status)}
            </span>
        </span>
    </div>`;
  div.innerHTML = html;
  return div;
}

async function displayUsers(users: User[]) {
  const userQuery = document.querySelector("#user-list");
  userQuery!.innerHTML = `<div class="mt-4"></div>`;
  users.forEach((user) => {
    const div = createUserHTML(user);
    userQuery!.appendChild(div);
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

function setLeave() {
  const leaveElement = document.createElement("div");
  leaveElement.innerHTML = `<div class="absolute right-5 top-5 z-50">
<div class="w-8 h-8" id="leave-group">
<svg version="1.1" xmlns="http://www.w3.org/2000/svg"  x="0px" y="0px" viewBox="0 0 1000 1000" fill="none" stroke-width="32" stroke="white">
<g><path stroke-linecap="round" stroke-linejoin="round" d="M118.5,933.5C58.7,933.5,10,878.8,10,811.7V195c0-70.8,48.7-128.4,108.5-128.4h474.4c59.8,0,108.5,57.6,108.5,128.4v88.5c0,17.6-14.3,32-32,32s-32-14.3-32-32V195c0-30.1-20-54.6-44.6-54.6H118.5c-24.6,0-44.6,24.5-44.6,54.6V805c0,30.1,20,54.6,44.6,54.6h474.4c24.6,0,44.6-24.5,44.6-54.6v-88.5c0-17.6,14.3-32,32-32c17.6,0,32,14.3,32,32V805c0,70.8-48.7,128.4-108.5,128.4L118.5,933.5L118.5,933.5z M804.7,708.1c-8.6,0-16.7-3.6-22.8-10c-12.2-13.1-12.2-34.3,0-47.4l100.5-109.1c0.1-0.1,0.2-0.2,0.1-0.4c-0.1-0.2-0.2-0.2-0.4-0.2H403.3c-17.6,0-32-15.1-32-33.7c0-18.6,14.3-33.7,32-33.7h478.9c0.1,0,0.3,0,0.4-0.2c0.1-0.2,0-0.3-0.1-0.4L781.9,363.6c-12.2-13.1-12.2-34.3,0-47.4c6-6.5,14.1-10,22.8-10c8.6,0,16.7,3.6,22.8,10L981,482c6.2,6.6,9.3,15.5,9,25.1c0.4,9.6-2.8,18.5-9,25.1L827.4,698C821.4,704.5,813.3,708.1,804.7,708.1z"/></g>
</svg>
</div>
</div>`;
  const template = document.getElementsByTagName("chatgroup-people")[0];
  template?.appendChild(leaveElement);
  const leave = document.getElementById("leave-group");
  if (leave) {
    leave.onclick = () => {
      const updateInput: UpdateChatGroupInput = {
        userId: localStorageInfo.id,
        isJoin: false,
      };
      joinChatGroup(localStorageInfo.token, updateInput, localStorageInfo.room);
      window.location.href = "group.html";
    };
  }
  const backElement = document.createElement("div");
  backElement.innerHTML=`<div class="absolute left-5 top-5 z-50">
  <div class="w-8 h-8" id="back">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" class="stroke-black dark:stroke-white">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
      </svg> 
  </div>
</div>`;
template?.appendChild(backElement);
const back = document.getElementById("back");
  if (back) {
    back.onclick = () => {
      window.location.href = "chat.html";
    };
  }
}

getUsers();
setLeave();
