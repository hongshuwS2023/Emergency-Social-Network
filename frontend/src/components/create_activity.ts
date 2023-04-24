import { createActivity } from "../sdk/sdk";
import { createActivityHTML } from "../utils/activity_constants";
import { CreateActivityInput, LocalStorageInfo } from "../utils/entity";
import { ErrorMessage } from "../utils/enum";

class CreateActivity extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = createActivityHTML;
    }
}

customElements.define('create-activity', CreateActivity);

const localStorageInfo: LocalStorageInfo = {
    id: localStorage.getItem("id") || "",
    username: localStorage.getItem("username") || "",
    token: ("Bearer " + localStorage.getItem("token")) as string,
    room: localStorage.getItem("room") || "",
    activityId: localStorage.getItem("activityId") || "",
    role: Number(localStorage.getItem("role"))
}

const back = document.getElementById("back-button");
const done = document.getElementById("done-button");
const errorMessage = document.getElementById("error-message");

back!.onclick = () => {
    window.location.href = "activity_list.html";
}

done!.onclick = async () => {
    errorMessage?.classList.add("hidden");
    const name = (document.getElementById('name') as HTMLInputElement).value || '';
    const victim = (document.getElementById('victim') as HTMLInputElement).value || '';
    const description = (document.getElementById('description') as HTMLInputElement).value || '';
    const createActivityInput: CreateActivityInput = {
        id: localStorageInfo.id,
        name: name,
        victimName: victim,
        description: description
    }
    const res = await createActivity(localStorageInfo.token, createActivityInput);
    if(res.message === ErrorMessage.WRONGUSERNAME){
        errorMessage?.classList.remove("hidden");
    }
    else {
        window.location.href = 'activity_list.html'
    }
}
