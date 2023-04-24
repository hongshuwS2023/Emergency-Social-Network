import { updateActivity } from "../sdk/sdk";
import { editActivityHTML } from "../utils/activity_constants";
import { LocalStorageInfo, UpdateActivityInput } from "../utils/entity";

class EditActivity extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = editActivityHTML;
    }
}

customElements.define('edit-activity', EditActivity);

const back = document.getElementById("back-button");
const done = document.getElementById("done-button");

const localStorageInfo: LocalStorageInfo = {
    id: localStorage.getItem("id") || "",
    username: localStorage.getItem("username") || "",
    token: ("Bearer " + localStorage.getItem("token")) as string,
    room: localStorage.getItem("room") || "",
    activityId: localStorage.getItem("activityId") || "",
    role: Number(localStorage.getItem("role"))
}

back!.onclick = () => {
    window.location.href = "activity_detail.html";
}

done!.onclick = async () => {
    const name = (document.getElementById('name') as HTMLInputElement).value || '';
    const description = (document.getElementById('description') as HTMLInputElement).value || '';
    const updateActivityInput: UpdateActivityInput = {
        id: localStorageInfo.activityId || '',
        userId: localStorageInfo.id,
        name: name,
        description: description
    }
    const res = await updateActivity(localStorageInfo.token, updateActivityInput);
    window.location.href = 'activity_list.html'
}