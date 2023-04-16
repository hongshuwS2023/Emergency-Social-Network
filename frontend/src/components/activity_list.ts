import { io, Socket } from "socket.io-client";
import { api_base } from "../sdk/api";
import { allActivities, createActivity, updateActivity } from "../sdk/sdk";
import { activityListHTML, greenDot, greyDot } from "../utils/constants";
import { Activity, CreateActivityInput, LocalStorageInfo } from "../utils/entity";
import { ActivityStatus } from "../utils/enum";

class ActivityList extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = activityListHTML;
    }
}

customElements.define('activity-list', ActivityList);

const localStorageInfo: LocalStorageInfo = {
    id: localStorage.getItem("id") || "",
    username: localStorage.getItem("username") || "",
    token: ("Bearer " + localStorage.getItem("token")) as string,
    room: localStorage.getItem("room") || ""
}

const create = document.getElementById("create-button");
const sos = document.getElementById("sos-button");
const activityList = document.querySelector('#activity-list');

const socket: Socket = io(api_base + `/?userid=${localStorageInfo.id}`, {
    transports: ["websocket"],
});

create!.onclick = () => {
    window.location.href = "create_activity.html";
}

sos!.onclick = async () => {
    const createActivityInput: CreateActivityInput = {
        id: localStorageInfo.id,
        victimName: localStorageInfo.username
    }
    const res = await createActivity(localStorageInfo.token, createActivityInput);
    console.log(res);
    localStorage.setItem('activityId', res.id);
    window.location.href = 'activity_detail.html';
}

async function getActivities() {
    const res = await allActivities();
    if(!res){
        return;
    }
    displayActivities(res);
}

socket.on("connect", () => {
    socket.on("all activities", (activities) => {
        displayActivities(activities);
    });
});

async function displayActivities(activities: Activity[]) {
    activityList!.innerHTML = `<div class="mt-4"></div>`;
    activities.forEach((activity) => {
        const div = createActivityDiv(activity);
        activityList!.appendChild(div);
        const join = document.getElementById("join-" + activity.id);
        if (join && join.innerHTML === 'Join') {
            join!.onclick = async () => {
                const joinActivityInput = {
                    id: activity.id,
                    userId: localStorageInfo.id
                };
                const res = await updateActivity(localStorageInfo.token, joinActivityInput);
                localStorage.setItem('activityId', activity.id);
                joinActivityAndRedirect(res.id);
            };
        }
    });
}

function joinActivityAndRedirect(activityId: string){
        localStorage.setItem("activity", activityId);
        window.location.href = "activity_detail.html";
    
}

function createActivityDiv(activity: Activity){
    const div = document.createElement('div');
    const html = `
    <div class="flex justify-center mb-4">
        <span class="ml-[5%] mr-auto mt-0.5">
            ${activity.status === ActivityStatus.INCOMPLETED ? greenDot : greyDot}
        </span>
         <span class="ml-6 w-3/6 inline-block overflow-auto">
            <span class="text-2xl inline-block">
                ${activity.name}
            </span>
        </span>
        <span class="mr-[5%] w-20 h-8 bg-[#C41230] rounded-lg ml-auto flex justify-center">
            <button class="justify-items-center text-2xl dark:text-white" id="join-${activity.id}">${activity.status === ActivityStatus.INCOMPLETED ? 'Join' : 'Done'}</button>
         </span>
    </div>
    `;
    div.innerHTML = html;
    return div;
}
getActivities();