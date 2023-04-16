import { io, Socket } from "socket.io-client";
import { activity_endpoint, api_base } from "../sdk/api";
import { getActivity, updateActivity } from "../sdk/sdk";
import { activityDetailHTML } from "../utils/constants";
import { LocalStorageInfo, UpdateActivityInput, UserEntity } from "../utils/entity";
import { ActivityStatus } from "../utils/enum";

class ActivityDetail extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = activityDetailHTML;
    }
}

customElements.define('activity-detail', ActivityDetail);

const back = document.getElementById("back-icon");
const edit = document.getElementById("edit-icon");
const activityName = document.getElementById("activity-name");
const victimName = document.getElementById("victim-name");
const activityDescription = document.getElementById("description");
const memberList = document.querySelector("#member-list");
const complete = document.getElementById("finish-button");

const localStorageInfo: LocalStorageInfo = {
    id: localStorage.getItem("id") || "",
    username: localStorage.getItem("username") || "",
    token: ("Bearer " + localStorage.getItem("token")) as string,
    room: localStorage.getItem("room") || "",
    activityId: localStorage.getItem("activityId") || ""
}

const socket: Socket = io(api_base + `/?userid=${localStorageInfo.id}`, {
    transports: ["websocket"],
});

back!.onclick = () => {
    window.location.href = "activity_list.html";
}

edit!.onclick = () => {
    window.location.href = "edit_activity.html";
}

complete!.onclick = async () => {
    const updateActivityInput: UpdateActivityInput = {
        id: localStorageInfo.activityId || '',
        userId: localStorageInfo.id,
        status: ActivityStatus.COMPLETED
    }
    await updateActivity(localStorageInfo.token, updateActivityInput);
    window.location.href = 'activity_list.html';
}

async function displayActivityInfo(){
    const activityUrl = new URL(activity_endpoint + "/" + `${encodeURIComponent(localStorageInfo.activityId || "")}`);
    const activity = await getActivity(localStorageInfo.token, activityUrl.toString());
    activityName!.innerHTML = activity.name;
    victimName!.innerHTML = activity.victim.username;
    activityDescription!.innerHTML = activity.description;
    const members = activity.members;
    console.log(members);
    members.forEach(member => {
        memberList!.appendChild(createMemberDiv(member));
    })
}

socket.on("connect", () => {
    socket.on("all activity members", (members) => {
        memberList!.innerHTML = '';
        members.forEach(member => {
            memberList!.appendChild(createMemberDiv(member));
        })
    });
});

function createMemberDiv(member: UserEntity){
    const div = document.createElement('div');
    const html = `
    <div class="flex justify-center mb-4">
         <span class="ml-auto mr-auto">
            <span class="text-4xl inline-block">
                ${member.username}
            </span>
        </span>
    </div>
    `;
    div.innerHTML = html;
    return div;
}


displayActivityInfo();