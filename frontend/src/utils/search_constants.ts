export const searchHTML = `
    <div class="flex flex-col justify-center w-screen h-screen pb-7">
        <div class="grid pb-5 justify-items-center" id="search-title">
        </div>
        <div class="grid pb-5 justify-items-center">
          <p class="text-black dark:text-white text-4xl">Search Information</p>
        </div>
        <div class="grid w-screen h-2/12 justify-items-center">
          <div class="flex justify-center w-10/12">
            <div class="inline-block w-5/12">
                <button class="inline-block w-full rounded-lg bg-white text-gray-800 font-semibold py-2 px-4 inline-flex items-center" id="dropdown">
                  <span id="selected-option">Select</span>
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
                id="search-input"
              />
            </div>
          </div>
        </div>
        <div class="grid pt-5 justify-items-center">
            <div class="w-7/12 h-1/12">
                <button class="w-full h-full bg-[#C41230] rounded-lg text-2xl dark:text-white"
                    id="search-button">Search</button>
            </div>
          </div>
        <div class="grid w-screen mt-4 h-3/6 justify-items-center">
          <div class="w-10/12">
            <div
              class="flex flex-col bg-white h-full max-h-[50vh] w-full rounded-lg dark:bg-grey-100 overflow-auto"
              id="search-result"
            >
              <div class="mt-4"></div>
            </div>
            <div class="flex justify-center mt-4">
                <button class="w-3/12 bg-[#C41230] rounded-lg text-2xl dark:text-white mr-auto" id="prev-page">
                  Prev
                </button>
                <button class="w-3/12 bg-[#C41230] rounded-lg text-2xl dark:text-white ml-auto" id="next-page">
                  Next
                </button>
              </div>
          </div>
        </div>
      </div>
`;