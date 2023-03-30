export const loginBannerHTML = `<div class="grid w-screen h-1/12 justify-items-center">
<div class="w-9/12 h-9/12 text-4xl text-bold text-esn-red leading-tight">
  <p class="font-extrabold">FSE</p>
  <p class="inline font-extrabold">E<p class="inline text-black dark:text-white">mergency</p>
  </p>
  <p class="inline font-extrabold">S<p class="inline text-black dark:text-white">ocial</p>
  <p class="inline font-extrabold">N<p class="inline text-black dark:text-white">etwork</p>
  </p>
</div>
</div>`

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
    <div class="grid w-screen h-1/12 mt-3 justify-items-center" id="error-message"></div>`

export const directoryHTML = `
<div class="flex flex-col justify-center w-screen h-screen">
    <div class="grid justify-items-center text-4xl text-bold text-black dark:text-white">
        <p class="font-extrabold">ESN Directory</p>
    </div>
    <div class="grid justify-items-center w-screen h-4/6 mt-4">
        <div class="w-11/12">
            <div class="flex flex-col bg-[#D9D9D9] h-full max-h-[60vh] w-full rounded-lg dark:bg-grey-100 overflow-auto"
                id="user-list">
                <div class="mt-4"></div>
            </div>
        </div>
    </div>
</div>`;

export const chatListHTML = `
<div class="flex flex-col justify-center w-screen h-screen">
  <div class="grid justify-items-center text-4xl text-bold text-esn-red">
      <p class="font-extrabold">FSE ESN</p>
  </div>
  <div class="grid justify-items-center w-screen h-4/6 mt-4">
    <div class="w-11/12">
      <div
        class="flex flex-col bg-[#D9D9D9] h-full max-h-[60vh] w-full rounded-lg dark:bg-grey-100 overflow-auto"
        id="room-list"
      ></div>
    </div>
  </div>
</div>
`;

export const templateHTML = `
<div class="absolute top-5 w-full" id="banner">
</div>
<div class="absolute w-screen h-[5%] bg-cover bottom-0 bg-[#C41230] flex justify-center">
    <div class="justify-items-start mr-auto ml-1 mt-auto mb-auto">
        <div class="w-8 h-8" id="directory-button">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg> 
        </div>
    </div>
    <div class="justify-items-center mt-auto mb-auto">
        <div class="w-8 h-8" id="chat-button">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
             </svg>
        </div>
    </div>
    <div class=" justify-items-end justify-center ml-auto mr-1 mt-auto mb-auto">
        <div class="w-8 h-8" id="setting-button">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        </div>
    </div>
</div>

<div class="absolute left-5 top-5 z-50">
    <div class="w-8 h-8 hidden" id="back-button">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" class="stroke-black dark:stroke-white">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
        </svg> 
    </div>
</div>

<div class="absolute right-5 top-5 z-50">
  <div class="w-8 h-8" id="search-icon">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" class="stroke-black dark:stroke-white">
      <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  </div>
</div>

<div id="setting-modal" class="absolute modal hidden fixed">
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
        <div class="flex h-screen">
            <div class="p-0 m-auto w-3/5 h-2/5 overflow-auto rounded-lg bg-gray-300 bg-opacity-100 border-2">
                <div class="modal-content flex flex-col justify-between h-full">
                    <div class="mt-8 text-center text-2xl">
                        <button id="profile-button" class="text-esn-red">Profile</button>
                    </div>

                    <div class="mt-4 text-center text-2xl">
                        <button id="change-status" class="text-esn-red">Change status</button>
                    </div>

                    <div class="mt-4 mb-8 text-center">
                        <button id="logout-button" class="text-esn-red text-2xl font-bold">Logout</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div id="status-modal" class="absolute modal hidden fixed">
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
        <div class="flex h-screen">
            <div class="p-0 m-auto w-3/5 h-3/5 overflow-auto rounded-lg bg-gray-300 bg-opacity-100 border-2">
                <div class="modal-content flex flex-col justify-between h-full">
                    <div class="mt-8">
                        <button id="status-ok" class="ml-auto mr-auto text-2xl text-esn-red flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-7 h-7 mr-2 stroke-white stroke-width-2 fill-green-600 bg-green-600">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                        OK</button>
                        <div class="text-xs text-center">
                            I am OK: I do not need help.
                        </div>
                    </div>
        
                    <div class="mt-4 text-center">       
                        <button id="status-help" class="text-esn-red ml-auto mr-auto text-2xl flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"  class="w-7 h-7 mr-2 stroke-white stroke-width-2 fill-yellow-600 bg-yellow-600">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                            </svg>    
                        Help</button>
                        <div class="text-xs text-center">
                            I need help, but this is not a life threatening emergency.
                        </div>
                    </div>
        
                    <div class="mt-4 mb-8 text-center">
                        <button id="status-emergency" class="ml-auto mr-auto text-2xl text-esn-red flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-7 h-7 mr-2 stroke-white stroke-width-1 bg-red-600 inline">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg> 
                        Emergency</button>
                        <div class="text-xs text-center">
                            I need help now: this is a life threatening emergency!
                         </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
`;

export const chatHTML  =`      
<div class="flex flex-col justify-center w-screen h-screen pb-7">
  <div class="grid pb-5 justify-items-center" id="room-name"></div>
  <div class="grid w-screen h-4/6 justify-items-center">
    <div class="w-10/12">
        <div class="flex flex-col bg-white h-full max-h-[60vh] w-full rounded-lg dark:bg-grey-100 overflow-auto"
            id="history">
            <div class="mt-4"></div>
        </div>
    </div>
  </div>
  <div class="grid w-screen h-2/12 justify-items-center">
    <div class="w-10/12">
        <input class="text-2xl w-full h-full rounded-lg dark:bg-grey-100" id="input" />
    </div>
  </div>
  <div class="grid pt-5 justify-items-center">
    <div class="w-7/12 h-1/12">
        <button class="w-full h-full bg-[#C41230] rounded-lg text-2xl dark:text-white"
            id="send-button">Send</button>
    </div>
  </div>
</div>`;


export const okSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-7 h-7 stroke-white stroke-width-2 fill-green-600 bg-green-600">
<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
</svg>`;
export const emergencySvg = ` <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-7 h-7 stroke-white stroke-width-1 bg-red-600 inline">
<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
</svg>`;
export const helpSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"  class="w-7 h-7 stroke-white stroke-width-2 fill-yellow-600 bg-yellow-600">
<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
</svg>`;
export const undefinedSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-7 h-7 stroke-white stroke-width-2 bg-black">
<path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
</svg>`;

export const selfButton = `<button class="justify-items-center text-2xl dark:text-white" id="button-me">Me</button>`;
export const greenDot = `<div class="h-7 w-7 rounded-full bg-green-500"></div>`;
export const greyDot = `<div class="h-7 w-7 rounded-full bg-gray-500"></div>`;

export const messageBackgroundClass =
'class="grid bg-gray-300 rounded-lg dark:bg-grey-100 w-4/5 h-[10%] ml-auto mr-auto text-xl duration-300 notification transition ease-in-out"';
export const messageUsernameClass = 'class="float-left ml-1 mt-1"';
export const messageContentClass = 'class="ml-1 mb-1"';
export const chatMessageBackgroundClass =
'class="grid bg-gray-300 rounded-lg dark:bg-grey-100 w-4/5 h-auto ml-auto mr-auto mb-4 text-xs"';
export const messageTimeClass = 'class="float-right ml-1 mt-1 mr-1"';

export const defaultLogoutTime = "-1";