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

export const lastWordsHTML = `
<div class="flex flex-col w-screen h-screen">
  <div class="grid justify-items-center text-4xl text-bold text-esn-red mt-16">
      <p class="font-extrabold">Emergency Words</p>
  </div>
  <div class="grid justify-items-center w-screen h-full max-h-[23vh] mt-2 overflow-auto">
    <div class="w-11/12">
      <div
        class="flex flex-col h-full w-full rounded-lg dark:bg-grey-100"
        id="words-list"
      >
      </div>
    </div>
  </div>

  <div class="ml-auto mr-auto w-11/12 flex flex-col max-h-[60vh] mb-10 mt-5 overflow-auto">
  <div class="overflow-y">
  <div
  class="h-8 w-full rounded-lg text-black dark:text-white">
  Emergency Contact to notify
</div>
  <input
    class="text-2xl w-full bg-gray-300 h-8 w-full rounded-lg overflow-auto"
    id="contact-input"
  >
  </input>
  <div
  class="h-8 w-full rounded-lg text-black dark:text-white overflow-auto mt-1">
  Emergency Contact to notify (email)
</div>
  <input
    class="text-2xl w-full bg-gray-300 h-8 w-full rounded-lg overflow-auto"
    id="email-input"
  >
  </input>

  <div
  class="h-8 w-full rounded-lg text-black dark:text-white overflow-auto mt-1">
  Timeout (in hours)
</div>
  <input
    class="text-2xl w-full bg-gray-300 h-8 w-full rounded-lg overflow-auto"
    id="timeout-input"
  >
  </input>

  <div
  class="h-8 w-full rounded-lg text-black dark:text-white overflow-auto mt-1">
  Content
</div>
  <textarea
    class="text-xl w-full bg-gray-300 h-32 w-full rounded-lg overflow-auto"
    id="content-input"
  >
  </textarea>
  <div class="flex mt-5 justify-between">
  <div class="bg-esn-red h-10 w-40 rounded-lg text-white flex" id="send-button"><div class="ml-auto mr-auto mt-auto mb-auto text-xl">Send</div></div>
<div class="bg-opacity-0 border-2 border-esn-red h-10 w-40 rounded-lg text-black dark:text-white flex" id="cancel-button"><div class="ml-auto mr-auto mt-auto mb-auto text-xl">Cancel</div></div>
  </div>
  </div>
</div>
</div>
`;

export const templateHTML = `
<div class="absolute top-5 w-full" id="banner">
</div>
<div class="absolute w-screen h-[5%] bg-cover bottom-0 bg-[#C41230] flex justify-between">
    <div class="mt-auto mb-auto">
        <div class="w-8 h-8" id="directory-button">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg> 
        </div>
    </div>
    <div class="mt-auto mb-auto">
        <div class="w-8 h-8" id="chat-button">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
             </svg>
        </div>
    </div>

    <div class="mt-auto mb-auto">
    <div class="w-8 h-8" id="emergency-button">
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1000 1000" stroke-width="20" stroke="white" fill="none">
        <path stroke-linecap="round" stroke-linejoin="round d="M435.5,505v-0.2c9.4-3.7,15.6-11.8,15.6-27c0-21.8-14.1-31.6-35.8-31.6c-10.3,0-19.7,0.3-29.7,1.4V553h20.5v-41.6h10.7c2.7,0,3.3,1.4,4.1,4.4l9.7,37.2H452l-12.9-43.1C438.5,507.3,437.7,505.7,435.5,505L435.5,505z M417.5,495h-11.4v-32.1c3.4-0.3,6.7-0.5,10-0.5c12.3,0,14.8,7.3,14.8,16.7C430.8,490.2,426.9,495,417.5,495L417.5,495z"/><path d="M576.7,506.6h27.9v-17h-27.9v-25.4h30.9V447h-51.4v106h52.6v-16.7h-32.2V506.6z"/><path d="M166.2,506.6H194v-17h-27.8v-25.4H197V447h-51.4v106h52.6v-16.7h-32.1L166.2,506.6z"/><path d="M336.5,506.6h27.9v-17h-27.9v-25.4h30.9V447H316v106h52.6v-16.7h-32.1V506.6z"/><path d="M255.3,487.2L234.4,447h-19.2v106h20v-68.5l20,40.2l19.9-40.3h0.6V553H295V447h-19.2L255.3,487.2z"/><path d="M505.5,511.2h14.4v3.8c0,11-1.6,23.4-15.2,23.4c-17.8,0-18.3-25.3-18.3-38.3c0-12.9,1.3-37.4,18.9-37.4c8.3,0,12.2,4.6,16.8,10.3l11.3-15.1c-8.1-8.1-16.5-12.7-27.8-12.7c-30,0-40.7,28.6-40.7,55c0,26.1,9.7,54.5,39.1,54.5c28.8,0,34.5-25,34.5-48v-12.4h-33.1L505.5,511.2L505.5,511.2z"/><path d="M817.5,553h20.4v-40.5l26.9-65.5h-20.8l-16.1,48.3L811.8,447h-22l27.7,66.6L817.5,553z"/><path d="M625.7,553h20v-65.5h0.5l34,65.5h18V447h-19.9v62.8H678L645.6,447h-19.9L625.7,553z"/><path d="M867.4,10H132.2C69.1,10,10,69.2,10,132.4v735C10,930.5,69.3,990,132.5,990h734.9c63.1,0,122.6-59.2,122.6-122.3V132.4C990,69.3,930.6,10,867.4,10L867.4,10z M892.4,630.8H630.8v261.3H369.2V630.8H107.6V369.2h261.7V107.9h261.6v261.3h261.6V630.8z"/><path d="M755.8,554.7c13,0,23.2-6,30.2-14.6l-10.5-14.9c-5.2,7-10,12.2-18.6,12.2c-16.5,0-19.4-23-19.4-37.3c0-19.1,4.5-37.4,19-37.4c7.8,0,12.1,5.2,16.7,12.2l12.3-14.5c-8.2-9.7-16.3-15.3-28.6-15.3c-29.4,0-40.7,27.6-40.7,54.8C716,528.9,726.5,554.7,755.8,554.7L755.8,554.7z"/>
        </svg>
    </div>
</div>
    
    <div class=" mt-auto mb-auto">
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

export const chatHTML = `      
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