import { ErrorMessage, parseError } from "../../response/exception.response";
import { authformHTML } from "../utils/constants";
import { login, register } from "../sdk/sdk";
import { LocalStorageInfo } from "../utils/entity";

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
    const localStorageInfo: LocalStorageInfo = {
      id: res.user_id,
      username: res.user_name,
      token: res.token,
      room: ""
    }
    saveTokenAndRedirect(localStorageInfo, "directory.html");
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
      room: ""
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