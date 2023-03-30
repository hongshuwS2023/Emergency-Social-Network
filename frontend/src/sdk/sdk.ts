import { login_endpoint, logout_endpoint, message_endpoint, register_endpoint, room_endpoint, search_endpoint, user_endpoint } from "./api";
import { MessageBody, SearchInput} from "../utils/entity";
import { Status } from "../utils/enum";

export const login = async (username: string, password: string) => {
    const loginUserRequest = {
        username: username,
        password: password
    }
    const res = await fetch(login_endpoint, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(loginUserRequest)
    })
    return await res.json();
}

export const register = async (username: string, password: string) => {
    const registerUserRequest = {
        username: username,
        password: password
    }
    const res = await fetch(register_endpoint, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(registerUserRequest)
    })
    return await res.json();
}

export const allUsers = async () => {
    const token = ("Bearer " + localStorage.getItem("token")) as string;
    const res = await fetch(user_endpoint, {
        method: "GET",
        headers: {
            authorization: token,
            "Content-type": "application/json",
        },
    })
    return await res.json();
}

export const updateUser = async (token: string, id: string, logoutTime: string) => {
    const res = await fetch(user_endpoint, {
        method: "PUT",
        headers: {
            authorization: token,
            "Content-type": "application/json",
        },
        body: JSON.stringify({ id, logoutTime }),
    });
    return res.json();
}

export const newRoom = async (token: string, messageBody: MessageBody) => {
    const res = await fetch(room_endpoint, {
        method: "POST",
        headers: {
            authorization: token,
            "Content-type": "application/json",
        },
        body: JSON.stringify(messageBody),
    });
    return res.json();
}

export const getRoom = async (token: string, id: string) => {
    const res = await fetch(room_endpoint + "/" + id, {
        method: "GET",
        headers: {
            authorization: token,
            "Content-type": "application/json",
        },
    });
    return res.json();
}

export const getUser = async (token: string, userUrl: string) => {
    const res = await fetch(userUrl, {
        method: "GET",
        headers: {
            authorization: token,
            "Content-type": "application/json",
        },
    });
    return res.json();
}

export const sendMessage = async (token: string, messageBody: MessageBody) => {
    const res = await fetch(message_endpoint, {
        method: "POST",
        headers: {
            authorization: token,
            "Content-type": "application/json",
        },
        body: JSON.stringify(messageBody),
    });
    return res.json();
}

export const logout = async (id: string) => {
    await fetch(logout_endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
    })
        .then((response) => {
            response.json();
        })
        .then(() => {
            localStorage.removeItem("id");
            localStorage.removeItem("token");
            location.href = "index.html";
        });
}

export const updateStatus = async (token: string, id: string, status: Status) => {
    await fetch(user_endpoint, {
        method: "PUT",
        headers: {
            authorization: token,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id: id,
            status: status,
            statusTimeStamp: new Date().getTime(),
        }),
    });
}

export const searchInformation = async (token: string, searchInput: SearchInput, page: number) => {
    const res = await fetch(search_endpoint + `?context=${searchInput.context}&criteria=${searchInput.criteria}&user_id=${searchInput.user_id}&room_id=${searchInput.room_id}&page=${page}`, {
        method: "GET",
        headers: {
            authorization: token,
            "Content-type": "application/json",
        },
    });
    return res.json();
}