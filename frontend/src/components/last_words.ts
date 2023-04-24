import { io, Socket } from "socket.io-client";
import { api_base } from "../sdk/api";
import { LocalStorageInfo, Room } from "../utils/entity";
import { dismissLastWords, getLastWords, postLastWords, updateLastWords } from "../sdk/sdk";
import { lastWordsHTML } from "../utils/lastWord_constants";

class LastWords extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = lastWordsHTML;
  }
}

customElements.define('last-words', LastWords);

const wordList = document.getElementById('words-list');
let unsentLastWords;
const localStorageInfo: LocalStorageInfo = {
  id: localStorage.getItem("id") || "",
  username: localStorage.getItem("username") || "",
  token: ("Bearer " + localStorage.getItem("token")) as string,
  room: localStorage.getItem("room") || "",
  role: Number(localStorage.getItem("role"))
}
const socket: Socket = io(api_base + `?userid=${localStorageInfo.id}`, {
  transports: ["websocket"],
});

socket.on('last-words-change', async () => {
  wordList!.innerHTML = '';
  await onLoad();
})

const handlePing = async (id) => {
  const messageBody = {
    id: id,
    contact: 'all',
  };
  const res = await updateLastWords(localStorageInfo.token, messageBody);

  if (res.status_code) {
    alert('This message has already been pinged');
  }
}

const handleDismiss = async (div, id) => {
  wordList!.removeChild(div);
  await dismissLastWords(localStorageInfo.token, id);
}

const renderLastWords = (words) => {
  wordList!.innerHTML = '';
  for (const word of words) {
    const div = document.createElement("div");
    div.innerHTML = `<div
    class="flex bg-gray-300 h-32 w-full rounded-lg dark:bg-grey-100 overflow-auto mt-2"
      >
    <div class="flex flex-col">
    <div class="text-black font-bold text-lg ml-1">${((Date.now() - word.time_created - word.timeout * 1000) / 1000 / 60 / 60).toFixed(4)} hours ago</div>
    <div class="text-black w-60 ml-1">${word.content}</div>
    </div>
    <div class="flex flex-col justify-between mt-5 mb-5">
    <div class="bg-esn-red h-10 w-24 rounded-lg text-white flex" id='ping-button-${word.id}'><div class="ml-auto mr-auto mt-auto mb-auto text-xl">Ping</div></div>
    <div class="bg-opacity-0 border-2 border-esn-red h-10 w-24 rounded-lg text-black flex" id='dismiss-button-${word.id}'><div class="ml-auto mr-auto mt-auto mb-auto text-xl">Dismiss</div></div>
    </div>
    </div>`
    wordList!.appendChild(div);

    const ping = document.getElementById(`ping-button-${word.id}`);
    const dismiss = document.getElementById(`dismiss-button-${word.id}`);
    ping!.onclick = async () => handlePing(word.id);
    dismiss!.onclick = async () => handleDismiss(div, word.id);
  };
}


const send = document.getElementById("send-button");
const cancel = document.getElementById("cancel-button");

const contact = document.getElementById("contact-input") as HTMLInputElement;
const email = document.getElementById("email-input") as HTMLInputElement;
const timeout = document.getElementById("timeout-input") as HTMLInputElement;
const content = document.getElementById("content-input") as HTMLInputElement;

send!.onclick = async () => {
  if (Number.isNaN(Number(timeout.value)) || Number(timeout.value) <= 0.0001) {
    alert('timeout must be a positive number');
    return;
  }
  if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.value)) {
    alert('email malformed');
    return;
  }
  if (!unsentLastWords) {
    const messageBody = {
      user_id: localStorageInfo.id,
      contact: contact.value,
      email: email.value,
      timeout:Number(timeout.value),
      content: content.value
    };
    
    const res = await postLastWords(localStorageInfo.token, messageBody);

    if (res.status_code) {
      alert(res.message);
    }
    else {
      unsentLastWords = res.body;
      alert('Emergency Words updated');
    }
    return;
  }

  const messageBody = {
    id: unsentLastWords.id,
    user_id: localStorageInfo.id,
    contact: contact.value,
    email: email.value,
    timeout:Number(timeout.value),
    content: content.value
  };

  const res = await updateLastWords(localStorageInfo.token, messageBody);
  console.log(res);
};

const renderUnsentWords = () => {
  if (!unsentLastWords) {
    contact.value = '';
    email.value = '';
    timeout.value = '';
    content.value = '';
    return;
  }

  contact.value = unsentLastWords.contact;
  email.value = unsentLastWords.email;
  timeout.value = unsentLastWords.timeout;
  content.value = unsentLastWords.content;
}

cancel!.onclick = async () => {
  if (unsentLastWords) {
    await dismissLastWords(localStorageInfo.token, unsentLastWords.id);
  }

  contact.value = '';
  email.value = '';
  timeout.value = '';
  content.value = '';
}

const onLoad = async () => {
  const {availables, unsent } = await getLastWords(localStorageInfo);
  unsentLastWords = unsent;
  renderLastWords(availables);
  renderUnsentWords();
}


onLoad();