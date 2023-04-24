import { parseError } from "../../response/exception.response";
import { getLastWords, login, register, updateLastWords } from "../sdk/sdk";
import { LocalStorageInfo } from "../utils/entity";
import { ErrorMessage } from "../utils/enum";
import { authformHTML } from "../utils/login_constants";

class AuthForm extends HTMLElement {
  constructor() {
    super();

  }

  connectedCallback() {
    this.innerHTML = authformHTML;
  }
}
customElements.define('auth-form', AuthForm);

const join = document.getElementById('button');
const confirmButton = document.getElementById('confirm-button');
const modal = document.getElementById("welcome-modal");
const ack = document.getElementById("ack-button");
const buttonClass = document.querySelector('#button-class');

join!.onclick = async () => {
  const err = document.getElementById('error-message') as HTMLElement;
  err.innerHTML = '';

  const username = (document.getElementById('username') as HTMLInputElement).value || '';
  const password = (document.getElementById('password') as HTMLInputElement).value || '';
  const res = await login(username, password);
  if (res.token) {
    console.log(res.role);
    const localStorageInfo: LocalStorageInfo = {
      id: res.user_id,
      username: res.user_name,
      token: res.token,
      room: "",
      role: res.role
    }
    saveTokenAndRedirect(localStorageInfo, "directory.html");
    const lastWords = await getLastWords(localStorageInfo);

    if (lastWords.unsent) {
      await updateLastWords(localStorageInfo.token, lastWords.unsent);
    }

  }
  else if (res.message != ErrorMessage.WRONGUSERNAME) {
    createErrorMessage(res.message);
  }
  else {
    createConfirmMessage();
    replaceJoinButton();
  }
}

confirmButton!.onclick = async () => {
  const err = document.getElementById('error-message') as HTMLElement;
  err.innerHTML = '';

  const username = (document.getElementById('username') as HTMLInputElement).value || '';
  const password = (document.getElementById('password') as HTMLInputElement).value || '';

  const res = await register(username, password);
  if (res.token) {
    replaceConfirmButton();
    modal!.style.display = "block";
    const localStorageInfo: LocalStorageInfo = {
      id: res.user_id,
      username: res.user_name,
      token: res.token,
      room: "",
      role: res.role
    }
    ack!.onclick = async function () {
      saveTokenAndRedirect(localStorageInfo, "directory.html");
    };
  }
  else {
    createErrorMessage(res.message);
  }
}

export function saveTokenAndRedirect(localStorageInfo: LocalStorageInfo, href: string) {
  localStorage.setItem('id', localStorageInfo.id);
  localStorage.setItem('username', localStorageInfo.username);
  localStorage.setItem('token', localStorageInfo.token);
  localStorage.setItem('role', String(localStorageInfo.role));
  window.location.href = href;
}

export function createErrorMessage(message: string) {
  const err = document.getElementById('error-message') as HTMLElement;
  err!.innerHTML = '';
  const div = document.createElement("div");
  div.innerHTML = `<div class="dark:text-white">${parseError(message)}</div>`;
  document.querySelector('#error-message')?.appendChild(div);
}

export function createConfirmMessage() {
  const div = document.createElement("div");
  div.innerHTML = `<div class="dark:text-white">Confirm to register?</div>`;
  document.querySelector('#confirm-message')?.appendChild(div);
}

export function replaceJoinButton() {
  confirmButton!.classList.remove('invisible');
  join!.classList.add('invisible');
  buttonClass!.removeChild(join!);
}

export function replaceConfirmButton() {
  buttonClass!.removeChild(confirmButton!);
  join!.classList.remove('invisible');
  buttonClass!.appendChild(join!);
  confirmButton!.classList.add('invisible');
  buttonClass!.appendChild(confirmButton!);
}