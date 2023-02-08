import { CreateUserInput } from '../../../backend/src/requests/createuser.input';

const join = document.getElementById('button');

join?.addEventListener('click', async function handleClick(event) {
    const createUserRequest: CreateUserInput = {
        username: (document.getElementById('username') as HTMLInputElement).value || '',
        password: (document.getElementById('password') as HTMLInputElement).value || ''
    }

    await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(createUserRequest)
    }).then(response => response.json()).then(async (res) => {
        if (res.token) { console.log('login success'); } else {
            await fetch('http://localhost:3001/api/auth/register', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(createUserRequest)
            }).then(response => response.json()).then(res => { console.log(res) });
        }
    });
    console.log(createUserRequest);
});