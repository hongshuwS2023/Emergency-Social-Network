interface User {
    name: string;
    onlineStatus: boolean;
}

const chat = document.getElementById('chat-button') || new HTMLDivElement;
const onlineUsers: User[] = [];
const offlineUsers: User[] = [];

const greenDot = `<svg viewBox="0 0 100 100" stroke="green">
<circle cx="50" cy="50" r="50" />
</svg>`;
const greyDot = '';

async function getUsers() {
    const res = await fetch('http://localhost:3000/api/users', {
        method: 'GET',
        headers: {
            "authorization": token,
            "Content-type": "application/json"
        },
    }).then(response => {
        return response.json();
    });
    res.sort((a, b) => (a.name < b.name) ? -1 : 1);
    res.forEach(user => {
        if (user.onlineStatus) {
            onlineUsers.push({ name: user.name, onlineStatus: true });
        }
        else {
            offlineUsers.push({ name: user.name, onlineStatus: false });
        }
    })
}

function displayUser(user:User){
    const html=`<div class="flex justify-center mb-4">
    <span class="ml-[10%] mr-auto">
        <span class="text-2xl">
            ${user.onlineStatus ? greenDot : greyDot}
        </span>
    </span>
    <span class="mr-[20%]">
        <span class="text-2xl">
            ${user.name}
        </span>
    </span>
    <span class="mr-[10%] w-20 h-8 bg-[#C41230] rounded-lg ml-auto flex justify-center">
        <button class="justify-items-center text-2xl dark:text-white" id="chat-button">
            Chat
        </button>
    </span>
</div>`;
}