export const directoryHTML = `
<div class="flex flex-col justify-center w-screen h-screen">
    <div class="grid justify-items-center text-4xl text-bold text-black dark:text-white">
        <p class="font-extrabold text-esn-red">ESN Directory</p>
    </div>
    <div class="grid justify-items-center w-screen h-4/6 mt-4">
        <div class="w-11/12">
            <div class="flex flex-col bg-[#D9D9D9] h-full max-h-[70vh] w-full rounded-lg dark:bg-grey-100 overflow-auto"
                id="user-list">
                <div class="mt-4"></div>
            </div>
        </div>
    </div>
</div>
<div id="profile-modal" class="absolute modal hidden fixed">
</div>
`;

export const chatListHTML = `
<div class="flex flex-col justify-center w-screen h-screen">
  <div class="grid justify-items-center text-4xl text-bold text-esn-red">
      <p class="font-extrabold">FSE ESN</p>
  </div>
  <div class="grid justify-items-center w-screen h-4/6 mt-4">
    <div class="w-11/12">
      <div
        class="flex flex-col bg-[#D9D9D9] h-full max-h-[70vh] w-full rounded-lg dark:bg-grey-100 overflow-auto"
        id="room-list"
      ></div>
    </div>
  </div>
</div>
`;
export const activityListHTML = `
<div class="flex flex-col justify-center w-screen h-screen">
  <div class="grid justify-items-center text-4xl text-bold text-esn-red">
      <p class="font-extrabold">Activity</p>
  </div>
  <div class="grid justify-items-center w-screen h-[60%] mt-4">
    <div class="w-11/12">
      <div
        class="flex flex-col bg-[#D9D9D9] h-full max-h-[60vh] w-full rounded-lg dark:bg-grey-100 overflow-auto"
        id="activity-list"
      >
      <div class="mt-4"></div>
      </div>
    </div>
  </div>
<div class="grid w-screen mt-4 h-10 justify-items-center">
    <button class="w-4/12 mt-2 h-8 bg-[#C41230] rounded-lg text-2xl dark:text-white" id="create-button">Create</button>
    <button class="w-4/12 mt-2 h-8 bg-[#C41230] rounded-lg text-2xl dark:text-white" id="sos-button">SOS</button>
    </div>
</div>
`;