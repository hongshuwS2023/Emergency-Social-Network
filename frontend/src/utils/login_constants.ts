export const loginBannerHTML = `<div class="grid w-screen h-1/12 justify-items-center">
<div class="w-9/12 h-9/12 text-4xl text-bold text-esn-red leading-tight">
  <p class="font-extrabold">FSE</p>
  <p class="inline font-extrabold">E<p class="inline text-black dark:text-white">mergency</p>
  </p>
  <p class="inline font-extrabold">S<p class="inline text-black dark:text-white">ocial</p>
  <p class="inline font-extrabold">N<p class="inline text-black dark:text-white">etwork</p>
  </p>
</div>
</div>`;

export const authformHTML = `<div class="mt-4">
    <div class="grid w-screen h-1/12 mt-8 justify-items-center">
      <div class="w-9/12">
        <label class="text-2xl text-black dark:text-white">Username</label>
        <input class="text-2xl w-full rounded-lg dark:bg-gray-300" id="username" />
      </div>
    </div>
    <div class="grid w-screen h-1/12 mt-3 justify-items-center">
      <div class="w-9/12">
        <label class="text-2xl text-black dark:text-white">Password</label>
        <input type="password" class="text-2xl w-full rounded-lg dark:bg-gray-300" id="password" />
      </div>
    </div>
    <div class="grid w-screen h-1/12 mt-3 justify-items-center" id="confirm-message"></div>
    <div class="grid w-screen h-10 mt-5 justify-items-center" id="button-class">
      <button class="w-4/12 h-8 bg-[#C41230] rounded-lg text-2xl dark:text-white" id="button">Join</button>
      <button class="w-4/12 h-8 bg-[#C41230] rounded-lg text-2xl dark:text-white invisible"
        id="confirm-button">Confirm</button>
    </div>
    <div class="grid w-screen h-1/12 mt-3 justify-items-center" id="error-message"></div>`;