import { createChatGroup, searchInformation } from "../sdk/sdk";
import {
  LocalStorageInfo,
  CreateChatGroupInput,
} from "../utils/entity";
import { RoomType } from "../utils/enum";
import { parseError } from "../../response/exception.response";
import { createGroupHTML } from "../utils/group_constants";

class CreateGroup extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = createGroupHTML;
    }
}

customElements.define('create-page', CreateGroup);


const localStorageInfo: LocalStorageInfo = {
  id: localStorage.getItem("id") || "",
  username: localStorage.getItem("username") || "",
  token: ("Bearer " + localStorage.getItem("token")) as string,
  room: localStorage.getItem("room") || "",
  role: Number(localStorage.getItem("role"))
};

const dropdown = document.getElementById("dropdown");
const options = document.querySelector("#options");
const create = document.getElementById("create-button");

export function createErrorMessage(message: string) {
  const err = document.getElementById('error-message') as HTMLElement;
  err!.innerHTML = `<div class="grid w-screen h-1/12 mt-3 justify-items-center dark:text-white" id="error-message">${parseError(message)}</div>`;
}

function displayOptions() {
  options!.innerHTML = "";
  const excavateDiv = document.createElement("div");
  const searchDiv = document.createElement("div");
  const monitorDiv = document.createElement("div");
  const rescueDiv = document.createElement("div");
  const excavateHTML = `<li><a class="dropdown-item rounded-t bg-white hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap">Excavate</a></li>`;
  const searchHTML = `<li><a class="dropdown-item rounded-t bg-white hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap">Search</a></li>`;
  const monitorHTML = `<li><a class="dropdown-item rounded-t bg-white hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap">Monitor</a></li>`;
  const rescueHTML = `<li><a class="dropdown-item rounded-t bg-white hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap">Rescue</a></li>`;
  rescueDiv.innerHTML = rescueHTML;
  monitorDiv.innerHTML = monitorHTML;
  excavateDiv.innerHTML = excavateHTML;
  searchDiv.innerHTML = searchHTML;

  options?.appendChild(excavateDiv);
  options?.appendChild(searchDiv);
  options?.appendChild(rescueDiv);
  options?.appendChild(monitorDiv);
}

document.addEventListener("DOMContentLoaded", function () {
  const dropdownBox = document.getElementsByClassName("dropdown-item");

  for (var i = 0; i < dropdownBox.length; i++) {
    dropdownBox[i].addEventListener("click", function () {
      dropdown!.getElementsByTagName("span")[0].innerText = this.innerText;
      options!.classList.add("hidden");
    });

    dropdown!.onclick = () => {
      options!.classList.toggle("hidden");
    };
  }
});

function parseCreateType(type: string | null) {
  switch (type) {
    case "Excavate":
      return RoomType.EXCAVATE;
    case "Search":
      return RoomType.SEARCH;
    case "Rescue":
      return RoomType.RESCUE;
    case "Monitor":
      return RoomType.MONITOR;
    default:
      return RoomType.UNDEFINED;
  }
}

create!.onclick = async () => {
  const createType = document.getElementById("selected-option")!.innerHTML;
  const createGroupInput: CreateChatGroupInput = {
    roomId: (document.getElementById("create-group-input") as HTMLInputElement).value || "",
    userId: localStorageInfo.id,
    type: parseCreateType(createType),
  };

  const res = await createChatGroup(
    localStorageInfo.token,
    createGroupInput
  );

  if(res.id){
    localStorage.setItem("room", res.id);
    window.location.href = "chat.html";
  }else{
    createErrorMessage(res.message);
  }
  
};




displayOptions();
