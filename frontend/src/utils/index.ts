import { CreateUserInput } from '../../../backend/src/requests/createuser.input';

const button = document.getElementById('button');

button?.addEventListener('click', function handleClick(event) {
    const createUserRequest: CreateUserInput = {
        username: (document.getElementById('username') as HTMLInputElement).value || '',
        password: (document.getElementById('password') as HTMLInputElement).value || ''
    }

    fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(createUserRequest)
    }).then(response => console.log(JSON.stringify(response)));
    console.log(createUserRequest);
});