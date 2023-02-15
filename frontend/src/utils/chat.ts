const send = document.getElementById('send-button') || new HTMLDivElement();
const menu = document.getElementById('menu-button') || new HTMLDivElement();
const input = document.getElementById('input') || new HTMLDivElement();
const modal = document.getElementById("menu-modal") || new HTMLDivElement();
const back = document.getElementById("back-button") || new HTMLDivElement();

let message = '';
let username = '';
let userStatus = '';
let time = '';

send.addEventListener('click', async function handleClick(event) {
    let token = "Bearer " + localStorage.getItem('token') as string;
    console.log(token);
    const messageBody = {
        userId: localStorage.getItem('id'),
        content: (document.getElementById('input') as HTMLInputElement).value || '',
    }
    const res = await fetch('http://localhost:3000/api/messages', {
        method: 'POST',
        headers: {
            "authorization": token
        },
        body: JSON.stringify(messageBody)
    }).then(response => {
        console.log(messageBody.userId);
        return response.json();
    })
    console.log(res);
    username = res.user.username;
    userStatus = res.user.status;
    message = res.content;
    time = res.time;
});

menu.addEventListener('click', async function handleClick(event) {
    modal.style.display = "block"
    back.onclick = function () {
        modal.style.display = "none";
    };

});


function displayMessage(message) {
    const div = document.createElement("div");
    div.innerHTML = `<div class="grid bg-gray-300 rounded-lg dark:bg-grey-100 w-4/5 h-auto ml-auto mr-auto mt-4">
    <p>
        <span class="text-xs float-left ml-1 mt-1">${username} &nbsp;<span
                class="text-xs">status</span></span>
        <span class="text-xs float-right mr-1 mt-1">${time}</span>
    </p>
    <p class="text-xs ml-1 mb-1">${message}</p>
</div>`;
    document.querySelector(".history")?.appendChild(div);
}
