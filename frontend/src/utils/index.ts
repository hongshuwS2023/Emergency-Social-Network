import { ErrorMessage, parseError } from '../../response/exception.response';

let join = document.getElementById('button') || new HTMLDivElement();
let confirm = document.getElementById('confirm-button') || new HTMLDivElement();
const modal = document.getElementById("welcomeModal") || new HTMLDivElement();
const ack = document.getElementById("ackButton") || new HTMLDivElement();
const buttonClass = document.querySelector('#button-class');

join?.addEventListener('click', async function handleClick(event) {
    const err = document.getElementById('error-message') as HTMLElement || new HTMLDivElement;
    err.innerHTML = '';

    let createUserRequest = {
        username: (document.getElementById('username') as HTMLInputElement).value || '',
        password: (document.getElementById('password') as HTMLInputElement).value || ''
    }
    const res = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(createUserRequest)
    }).then(response => { return response.json() })
    if (res.token) {
        console.log('login success');
    }
    else if (res.message != ErrorMessage.WRONGUSERNAME) {
        console.log(res);
        const err = document.getElementById('error-message') as HTMLElement || new HTMLDivElement;
        err.innerHTML = '';
        const div = document.createElement("div");
        div.innerHTML = `<div class="dark:text-white">${parseError(res.message)}</div>`;
        document.querySelector('#error-message')?.appendChild(div);
    }
    else {
        confirm.classList.remove('invisible');
        join.classList.add('invisible');
        buttonClass?.removeChild(join);
    }
})

confirm.addEventListener('click', async function handleClick(event) {
    const err = document.getElementById('error-message') as HTMLElement || new HTMLDivElement;
    err.innerHTML = '';
    let createUserRequest = {
        username: (document.getElementById('username') as HTMLInputElement).value || '',
        password: (document.getElementById('password') as HTMLInputElement).value || ''
    }
    const res = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(createUserRequest)
    }).then(response => { return response.json() });

    if (res.token) {
        console.log('create success');
        buttonClass?.removeChild(confirm);
        join.classList.remove('invisible');
        buttonClass?.appendChild(join);
        confirm.classList.add('invisible');
        buttonClass?.appendChild(confirm);
        modal.style.display = "block"
        ack.onclick = function () {
            modal.style.display = "none";
        };
    }
    else {
        const div = document.createElement("div");
        div.innerHTML = `<div class="dark:text-white">${parseError(res.message)}</div>`;
        document.querySelector('#error-message')?.appendChild(div);
    }
})
