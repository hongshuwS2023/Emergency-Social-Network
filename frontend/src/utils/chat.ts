import { io, Socket } from "socket.io-client";
import { getFormattedDate, Status } from "../../response/user.response";
import { parseStatus } from "../../response/user.response";
import { message_endpoint, api_base, room_endpoint } from "../sdk/api";

const id = localStorage.getItem("id") || "";
const roomId = localStorage.getItem("room") || "";
const socket: Socket = io(api_base + `/?userid=${id}`, {
  transports: ["websocket"],
});
const send = document.getElementById("send-button") || new HTMLDivElement();
const token = ("Bearer " + localStorage.getItem("token")) as string;

const messageBackgroundClass =
  'class="grid bg-gray-300 rounded-lg dark:bg-grey-100 w-4/5 h-auto ml-auto mr-auto mb-4 text-xs mb-auto"';
const messageUsernameClass = 'class="float-left ml-1 mt-1"';
const messageTimeClass = 'class="float-right ml-1 mt-1 mr-1"';
const messageContentClass = 'class="ml-1 mb-1"';

send.addEventListener("click", async function handleClick(event) {
  const messageBody = {
    userId: id,
    content: (document.getElementById("input") as HTMLInputElement).value,
    roomId: roomId,
  };

  if (messageBody.content.trim().length) {
    const res = await fetch(message_endpoint, {
      method: "POST",
      headers: {
        authorization: token,
        "Content-type": "application/json",
      },
      body: JSON.stringify(messageBody),
    }).then((response) => {
      return response.json();
    });
  }
  (document.getElementById("input") as HTMLInputElement).value = "";
});

socket.on("connect", () => {
  socket.on("chat message", (msg) => {
    if (msg.room.id === roomId) {
      displayMessage(
        msg.sender.username,
        msg.sender.status,
        msg.content,
        msg.time
      );
    }
  });
});

function displayMessage(
  username: string,
  status: Status,
  message: string,
  time: string
) {
  const div = document.createElement("div");
  div.innerHTML = `<div ${messageBackgroundClass}>
    <p>
        <span ${messageUsernameClass}>${username}
        <span>${parseStatus(status)}</span></span>
        <span ${messageTimeClass}>${time}</span>
    </p>
    <p ${messageContentClass}>${message}</p> </div>`;
  document.querySelector("#history")?.appendChild(div);
  const scroll = document.getElementById("history") || new HTMLDivElement();
  scroll.scrollTop = scroll.scrollHeight || 0;
}

async function getHistory() {
  const res = await fetch(room_endpoint + "/" + roomId, {
    method: "GET",
    headers: {
      authorization: token,
      "Content-type": "application/json",
    },
  }).then((response) => {
    return response.json();
  });
  console.log(res);
  res.messages.forEach((msg) => {
    displayMessage(
      msg.sender.username,
      msg.sender.status,
      msg.content,
      getFormattedDate(Number(msg.time))
    );
  });
}

function setRoomName() {
  const roomNameDiv = document.createElement("div");
  roomNameDiv.innerHTML = `<p class="text-black dark:text-white text-4xl">${roomId}</p>`;
  document.querySelector("#room-name")?.appendChild(roomNameDiv);
}

setRoomName();
getHistory();
