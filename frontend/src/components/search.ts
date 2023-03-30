
import { getFormattedDate, parseStatus } from "../../response/user.response";
import { searchInformation } from "../sdk/sdk";
import { chatMessageBackgroundClass, emergencySvg, greenDot, greyDot, helpSvg, messageContentClass, messageTimeClass, messageUsernameClass, okSvg, undefinedSvg } from "../utils/constants";
import { StatusHistoryContent, HistoryStatus, LocalStorageInfo, MessageContent, MessageEntity, SearchInput, User, UserEntity } from "../utils/entity";
import { Context, OnlineStatus, Status } from "../utils/enum";

const localStorageInfo: LocalStorageInfo = {
    id: localStorage.getItem("id") || "",
    username: localStorage.getItem("username") || "",
    token: ("Bearer " + localStorage.getItem("token")) as string,
    room: localStorage.getItem("room") || "",
}

const dropdown = document.getElementById('dropdown');
const options = document.querySelector('#options');
const search = document.getElementById('search-button');
const searchResult = document.querySelector("#search-result");
const searchTitle = document.querySelector("#search-title");
const searchCriteria = localStorage.getItem("searchCriteria");

function displayTitle(){
    let title: string = 'Unknown Criteria';
    if(searchCriteria == 'directory'){
            title = 'directory';
    }
    if(searchCriteria == "chat"){
            title = localStorageInfo.room;
    }
    const div = document.createElement("div");
    const html = `<p class="text-black dark:text-white text-4xl" id="title">${title}</p>`;
    div.innerHTML = html;
    searchTitle?.appendChild(div);

    displayOptions();
}

function displayOptions(){
    options!.innerHTML = '';
    const nameDiv = document.createElement("div");
    const statusDiv = document.createElement("div");
    const publicDiv = document.createElement("div");
    const privateDiv = document.createElement("div");
    const nameHTML = 
    `<li><a class="dropdown-item rounded-t bg-white hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap">Name</a></li>`;
    const statusHTML = 
    `<li><a class="dropdown-item rounded-t bg-white hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap">Status</a></li>`;
    const publicHTML = 
    `<li><a class="dropdown-item rounded-t bg-white hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap">Public</a></li>`;
    const privateHTML = 
    `<li><a class="dropdown-item rounded-t bg-white hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap">Private</a></li>`;
    nameDiv.innerHTML = nameHTML;
    statusDiv.innerHTML = statusHTML;
    publicDiv.innerHTML = publicHTML;
    privateDiv.innerHTML = privateHTML;

    const title = document.getElementById('title');
    console.log(title!.innerHTML);
    switch(title!.innerHTML){
        case 'directory':
            options?.appendChild(nameDiv);
            options?.appendChild(statusDiv);
            return;
        case 'public':
            options?.appendChild(publicDiv);
            return;
        default:
            options?.appendChild(privateDiv);
            return;
    }   
}

document.addEventListener("DOMContentLoaded", function() {
    const dropdownItems = document.getElementsByClassName("dropdown-item");
  
    for (var i = 0; i < dropdownItems.length; i++) {
      dropdownItems[i].addEventListener("click", function() {
        dropdown!.getElementsByTagName("span")[0].innerText = this.innerText;
        options!.classList.add("hidden");
        const selected = document.getElementById('selected-option')!.innerHTML;
        console.log(selected);
     });

     dropdown!.onclick = () => {
        options!.classList.toggle("hidden");
      };
    }

    const selected = document.getElementById('selected-option');
    //console.log(selected!.innerHTML);
  });

function parseSearchContext(context: string | null){
    switch(context){
        case 'Name':
            return Context.CITIZENNAME;
        case 'Status':
            return Context.CITIZENSTATUS;
        case 'Public':
            return Context.PUBLICCHAT;
        case 'Private':
            return Context.PRIVATECHAT;
        default:
            return Context.UNKNOWN;
    }
}

search!.onclick = async () => {
    searchResult!.innerHTML = '<div class="mt-4"></div>';
    const searchContext = document.getElementById('selected-option')!.innerHTML;
    const searchInput: SearchInput = {
        context: parseSearchContext(searchContext),
        criteria: (document.getElementById('search-input') as HTMLInputElement).value || '',
        user_id: localStorageInfo.id,
        room_id: localStorageInfo.room
    }
    
    const res = await searchInformation(localStorageInfo.token, searchInput);
    console.log(res);
    switch(searchContext){
        case 'Name':
            return searchUsers(res.users);
        case 'Status':
            return searchUsers(res.users);
        case 'Public':
            console.log(res);
                console.log(localStorageInfo);
                console.log(searchInput);
            return searchChat(res.messages);
        case 'Private':
            if(searchInput.criteria.toLowerCase() != 'status'){
                console.log(res);
                console.log(localStorageInfo);
                console.log(searchInput);
                return searchChat(res.messages);
            }
            else {
                console.log(res);
                console.log(localStorageInfo);
                console.log(searchInput);
                return searchStatus(res.historyStatus);
            }
        default:
            return null;
    }
}

function searchUsers(res: UserEntity[]) {
    console.log(res);
    const userList: User[] = [];
    res.forEach((user) =>
    userList.push({
      id: user.id,
      username: user.username,
      onlineStatus: user.onlineStatus,
      status: user.status,
    })
  );
  displayUsers(userList);
}

async function displayUsers(users: User[]) {
    searchResult!.innerHTML = `<div class="mt-4"></div>`;
    users.forEach((user) => {
      const div = createUserHTML(user);
      searchResult!.appendChild(div);
    });
}

function createUserHTML(user: User) {
    const div = document.createElement("div");
    const html = `
      <div class="flex justify-center mb-4">
          <span class="ml-[10%] mr-auto mt-0.5">
              ${user.onlineStatus === OnlineStatus.ONLINE ? greenDot : greyDot}
          </span>
           <span class="ml-auto mr-auto w-[20%] inline-block overflow-auto">
              <span class="text-2xl inline-block" id="${user.id}">
                  ${user.username}
              </span>
          </span>
          <span class="ml-auto mr-[10%] inline-block">
              <span class="flex items-center" id="${user.id}">
                  ${displayStatus(user.status)}
              </span>
          </span>
      </div>`;
    div.innerHTML = html;
    return div;
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

function searchChat(res: MessageEntity[]){
    res.forEach((msg) => {
        const messageContent: MessageContent = {
            username: msg.sender.username,
            status: msg.status,
            message: msg.content,
            time: getFormattedDate(Number(msg.time))
        };
        displayMessage(
            messageContent
        );
    });
}

function displayMessage(
    messageContent: MessageContent
) {
    const div = document.createElement("div");
    div.innerHTML = `<div ${chatMessageBackgroundClass}>
    <p>
        <span ${messageUsernameClass}>${messageContent.username}
        <span>${parseStatus(messageContent.status)}</span></span>
        <span ${messageTimeClass}>${messageContent.time}</span>
    </p>
    <p ${messageContentClass}>${messageContent.message}</p> </div>`;
    searchResult?.appendChild(div);
    const scroll = document.getElementById("search-result");
    scroll!.scrollTop = scroll!.scrollHeight || 0;
}

function searchStatus(res: HistoryStatus[]){
    res.forEach((history) => {
        const historyContent: StatusHistoryContent = {
            username: history.user.username,
            status: history.status,
            time: history.timeStamp
        };
        displayHistory(
            historyContent
        );
    });
}

function displayHistory(historyContent: StatusHistoryContent){
    const div = document.createElement("div");
    const html = `
      <div class="flex justify-center mb-4">
          <span class="ml-[10%] mr-auto mt-0.5 text-2xl">
              ${historyContent.username}
          </span>
           <span class="ml-auto mr-auto w-[20%] inline-block overflow-auto">
              <span class="text-2xl inline-block">
                  ${displayStatus(historyContent.status)}
              </span>
          </span>
          <span class="ml-auto mr-[10%] w-[30%] inline-block overflow-x">
              <span class="flex items-center">
                  ${getFormattedDate(Number(historyContent.time))}
              </span>
          </span>
      </div>`;
    div.innerHTML = html;
    searchResult?.appendChild(div);
    const scroll = document.getElementById("search-result");
    scroll!.scrollTop = scroll!.scrollHeight || 0;
}

displayTitle();