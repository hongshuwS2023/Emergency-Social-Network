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
    type="email"
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
<div class="bg-opacity-0 border-2 border-esn-red h-10 w-40 rounded-lg text-black dark:text-white flex" id="cancel-button"><div class="ml-auto mr-auto mt-auto mb-auto text-xl">Cancel</div></div></div></div>`;