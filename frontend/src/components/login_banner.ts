import { loginBannerHTML } from "../utils/constants";

class LoginBanner extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = loginBannerHTML;
    }
}

customElements.define('login-banner', LoginBanner);