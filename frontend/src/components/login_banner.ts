import { loginBannerHTML } from "../utils/login_constants";

class LoginBanner extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = loginBannerHTML;
    }
}

customElements.define('login-banner', LoginBanner);