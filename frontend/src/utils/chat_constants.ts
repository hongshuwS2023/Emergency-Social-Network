export const groupChatHTML = `
<div class="flex flex-col justify-center w-screen h-screen">
  <div class="grid justify-items-center text-4xl text-bold text-esn-red">
      <p class="font-extrabold">Group Chat</p>
  </div>
  <div class="grid justify-items-center w-screen h-4/6 mt-4">
    <div class="w-11/12">
      <div
        class="flex flex-col bg-[#D9D9D9] h-full max-h-[60vh] w-full rounded-lg dark:bg-grey-100 overflow-auto"
        id="group-list"
      ></div>
    </div>
  </div>
  <div class="grid justify-items-center w-screen">
  <button class="w-4/12 h-8 bg-[#C41230] rounded-lg text-2xl dark:text-white" id="create-group">Create</button>
  </div>
</div>`;

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