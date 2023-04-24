export const createGroupHTML = `<div class="flex flex-col justify-center w-screen h-screen pb-7">
<div class="grid pb-5 justify-items-center" id="create-group-title">
</div>
<div class="grid pb-5 justify-items-center">
  <p class="text-black dark:text-white text-4xl">Create Group</p>
</div>
<div class="grid w-screen h-2/12 justify-items-center">
  <div class="flex justify-center w-10/12">
    <div class="inline-block w-5/12">
        <button class="inline-block w-full rounded-lg bg-white text-gray-800 font-semibold py-2 px-4 inline-flex items-center" id="dropdown">
          <span id="selected-option">Excavate</span>
          <svg class="fill-current h-4 w-4 ml-auto" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 10l5 5 5-5z" />
          </svg>
        </button>
        <ul class="absolute rounded-lg bg-white hidden text-gray-700 mt-2 w-40" id="options">
        </ul>
      </div>
    <div class="w-6/12 ml-4">
      <input
        class="text-2xl w-full h-full rounded-lg dark:bg-grey-100 overflow-auto"
        id="create-group-input"
      />
    </div>
  </div>
</div>
<div class="grid pt-5 justify-items-center">
    <div class="w-7/12 h-1/12">
        <button class="w-full h-full bg-[#C41230] rounded-lg text-2xl dark:text-white"
            id="create-button">Create</button>
    </div>
  </div>
  <div class="grid w-screen h-1/12 mt-3 justify-items-center" id="error-message"></div>

</div>
</div>`;