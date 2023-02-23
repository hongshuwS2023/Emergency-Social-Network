//const token = "Bearer " + localStorage.getItem('token') as string;
const join = document.getElementById('join-button') || new HTMLDivElement;
async function getLatestHistory() {
    const res = await fetch('http://localhost:3000/api/messages', {
        method: 'GET',
        headers: {
            "authorization": token,
            "Content-type": "application/json"
        },
    }).then(response => {
        return response.json();
    })
    if (res.length>0) {
        const msg = res.slice(-1)[0];
        console.log(res);
        const div = document.createElement("div");
        div.innerHTML = `<div class="text-xs">
    ${formatHistory(msg.user.username, msg.content)}
     </div>`;
        document.querySelector('#chat-history')?.append(div);
    }
}

function formatHistory(username: string, content: string) {
    const history = `${username}: ${content}`;
    if (history.length >= 20) {
        return `${history.substring(0, 20)}...`;
    }
    else {
        return history;
    }
}

join.addEventListener('click', () => {
    window.location.href = 'chat.html';
})

getLatestHistory();