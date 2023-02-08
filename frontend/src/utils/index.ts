import { ErrorMessage, parseError } from '../../response/exception.response';

const join = document.getElementById('button') || new HTMLDivElement();
const modal = document.getElementById("welcomeModal") || new HTMLDivElement();
const ack = document.getElementById("ackButton") || new HTMLDivElement();

join?.addEventListener('click', async function handleClick(event) {
    let createUserRequest = {
        username: (document.getElementById('username') as HTMLInputElement).value || '',
        password: (document.getElementById('password') as HTMLInputElement).value || ''
    }
    const err = document.getElementById('error-message') as HTMLElement || new HTMLDivElement;
    err.innerHTML = '';

    await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(createUserRequest)
    }).then(response => response.json()).then(async (res) => {
        if (res.token) {
            console.log('login success.');

        }
        else if (res.message == ErrorMessage.WRONGUSERNAME) {
            console.log(res);
            console.log('create');
            // change button to confirm
            join.innerHTML = 'Confirm';
            join?.addEventListener('click', async function handleClick(event) {
                // once confirm is triggered
                createUserRequest = {
                    username: (document.getElementById('username') as HTMLInputElement).value || '',
                    password: (document.getElementById('password') as HTMLInputElement).value || ''
                }
                await fetch('http://localhost:3001/api/auth/register', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(createUserRequest)
                }).then(response => response.json()).then(res => {
                    if (res.token) {
                        console.log(res);
                        modal.style.display = "block"
                        ack.onclick = function () {
                            modal.style.display = "none";
                        };
                        join.innerHTML = 'Join';
                    }
                    else {
                        const div = document.createElement("div");
                        div.innerHTML = `<div class="dark:text-white">${parseError(res.message)}</div>`;
                        document.querySelector('#error-message')?.appendChild(div);
                        join.innerHTML = 'Join';
                    }

                });

            });
        }
        else {
            console.log(res);
            const div = document.createElement("div");
            div.innerHTML = `<div class="dark:text-white">${parseError(res.message)}</div>`;
            document.querySelector('#error-message')?.appendChild(div);

        }
    });
    console.log(createUserRequest);
});