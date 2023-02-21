

class TemplateElement extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <div class="absolute left-5 top-5 z-50">
    <button class="text-white" id="back-button">Back</button>
</div>

<div class="absolute top-10 left-1/2 transform -translate-x-1/2 z-50">
    <p class="text-white text-4xl">Public</p>
</div>

<div class="absolute w-screen h-8 bg-cover bottom-0 bg-[#C41230] flex justify-center items-center">
    <span class="justify-items-start mr-auto ml-1">
        <button class="text-white" id="directory-button">Directory</button>
    </span>
    <span class="justify-items-center">
        <button class="text-white" id="chat-button">Chat</button>
    </span>
    <span class="justify-items-end ml-auto mr-1">
        <button class="text-white" id="setting-button">Setting</button>
    </span>
</div>

<div id="setting-modal" class="absolute modal hidden fixed">
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
        <div class="flex h-screen">
            <div class="p-0 m-auto w-3/5 h-2/5 overflow-auto rounded-lg bg-gray-300 bg-opacity-100 border-2">
                <div class="modal-content flex flex-col justify-between h-full">
                    <div class="mt-8 text-center text-2xl">
                        <button id="profile-button" class="text-esn-red">Profile</button>
                    </div>

                    <div class="mt-4 mb-8 text-center">
                        <button id="logout-button" class="text-esn-red text-2xl font-bold">Logout</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
        `;
    }
}



customElements.define('menu-template', TemplateElement);

const setting = document.getElementById('setting-button') || new HTMLDivElement();
const modal = document.getElementById("setting-modal") || new HTMLDivElement();
const back = document.getElementById("back-button") || new HTMLDivElement();
const logout = document.getElementById("logout-button") || new HTMLDivElement();

setting.addEventListener('click', async function handleClick(event) {
    modal.style.display = "block";
    back.onclick = function () {
        modal.style.display = "none";
    };
});

logout.addEventListener('click', () => {
    localStorage.removeItem('id');
    localStorage.removeItem('token');
    window.location.href = "index.html";
})
