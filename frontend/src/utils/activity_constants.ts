export const editActivityHTML = `
<div class="absolute left-5 top-5 z-50">
    <div class="w-8 h-8" id="back-button">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" class="stroke-black dark:stroke-white">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
        </svg> 
    </div>
</div>
<div class="flex flex-col justify-center w-screen h-screen">
    <div class="grid justify-items-center text-4xl text-bold">
        <p class="font-extrabold dark:text-white">Edit Activity</p>
    </div>
    <div class="grid justify-items-center w-screen mt-4">
        <p class="dark:text-white text-2xl">Name</p>
        <div class="flex w-11/12 mt-4">
            <div class="w-full">
                <input class=" text-2xl w-full rounded-lg" id="name"/>
            </div>
        </div>
    </div>
    <div class="grid justify-items-center w-screen mt-4">
        <div class="text-2xl dark:text-white">
            Description
        </div>
    </div>
    <div class="grid justify-items-center h-3/6 w-full mt-4">
        <div class="flex w-11/12 h-full">
            <textarea class=" text-4xl w-full h-full rounded-lg pl-2 pt-2" id="description"></textarea>
        </div>
    </div>
    <div class="grid w-screen h-10 justify-items-center">
        <button class="w-4/12 mt-6 h-10 bg-[#C41230] rounded-lg text-2xl dark:text-white" id="done-button">Done</button>
    </div>
</div>
`;

export const activityDetailHTML = `
<div class="absolute left-5 top-5 z-50">
            <div class="w-8 h-8" id="back-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" class="stroke-black dark:stroke-white">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                </svg> 
            </div>
        </div> 
        <div class="absolute right-5 top-5 z-50">
            <div class="w-8 h-8" id="edit-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" class="stroke-black dark:stroke-white">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>  
            </div>
          </div>
        <div class="flex flex-col justify-center w-screen h-screen">
            <div class="grid justify-items-center text-4xl font-bold dark:text-white">
                <p class="break-words overflow-auto" id="activity-name">

                </p>
            </div>
            <div class="grid justify-items-center mt-4">
                <div class="inline-block w-11/12 text-center">
                    <p class="inline text-2xl dark:text-white">
                        Victim: 
                    <p class="inline text-2xl dark:text-white" id="victim-name">
                    </p>
                    </p>
                </div>
            </div>
            <div class="grid justify-items-center">
                <div class="break-words overflow-auto w-3/6 max-h-2/6 text-center">
                    <p class="mt-4 text-2xl dark:text-white" id="description">
                    </p>
                </div>
            </div>
            <div class="grid justify-items-center w-screen mt-4">
                <div class="text-2xl dark:text-white">
                    Current member:
                </div>
            </div>
            <div class="grid justify-items-center w-screen h-2/6 mt-4">
              <div class="w-11/12">
                <div
                  class="flex flex-col bg-[#D9D9D9] h-full max-h-[70vh] w-full rounded-lg dark:bg-grey-100 overflow-auto"
                  id="member-list"
                ></div>
              </div>
            </div>
            <div class="grid w-screen h-10 justify-items-center">
                <button class="w-4/12 mt-10 h-10 bg-[#C41230] rounded-lg text-2xl dark:text-white" id="finish-button">Complete</button>
            </div>
          </div>
`;
export const createActivityHTML = `
<div class="absolute left-5 top-5 z-50">
    <div class="w-8 h-8" id="back-button">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" class="stroke-black dark:stroke-white">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
        </svg> 
    </div>
</div>
<div class="flex flex-col justify-center w-screen h-screen">
    <div class="grid justify-items-center text-4xl text-bold">
        <p class="font-extrabold dark:text-white">Create Activity</p>
    </div>
    <div class="grid justify-items-center w-screen mt-4">
        <div class="flex w-11/12">
        <div class="inline-block text-2xl dark:text-white w-5/12">
            Victim
        </div>
        <div class="inline-block w-full">
            <input class=" text-2xl w-full rounded-lg" id="victim"/>
        </div>
        </div>
        <div class="flex w-11/12 mt-4">
        <div class="inline-block text-2xl dark:text-white w-5/12">
            Name
        </div>
        <div class="inline-block w-full">
            <input class=" text-2xl w-full rounded-lg" id="name"/>
        </div>
        </div>
    </div>
    <div class="grid justify-items-center w-screen mt-4">
        <div class="text-2xl dark:text-white">
            Description
        </div>
    </div>
    <div class="grid justify-items-center h-3/6 w-full mt-4">
        <div class="flex w-11/12 h-full">
            <textarea class=" text-4xl w-full h-full rounded-lg pl-2 pt-2" id="description"></textarea>
        </div>
    </div>
    <div class="grid justify-items-center w-screen mt-2 hidden dark:text-white" id="error-message">
        Please enter a valid victim name
    </div>
    <div class="grid w-screen h-10 justify-items-center">
        <button class="w-4/12 mt-6 h-8 bg-[#C41230] rounded-lg text-2xl dark:text-white" id="done-button">Done</button>
    </div>
</div>
`;