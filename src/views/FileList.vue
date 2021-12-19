
<script>
import { Icon } from "@iconify/vue";
import { useClient } from "@/utils/apiClient";

import { inject } from "@vue/runtime-core";
import { useUserFolders } from "@/utils/brain";
export default {
  components: { Icon },

  setup() {
    const user = inject("user");
    const { data, error, isLoading, isSuccess } = useUserFolders({
      id: user.value._id,
    });
    const client = useClient();

    function downloadZip(file_id){
      return client(`downloadZip/${file_id}`,{method:'POST'}).then(data=>console.log(data))
    }

    console.log(data.value);
    return { user, data, isLoading ,downloadZip};
  },
};
</script>
<template>
  <div class="w-full h-full">
    <header
      class="
        w-full
        h-24
        dark:bg-blue-700
        bg-gradient-to-r
        from-indigo-400
        to-purple-300
        px-4
      "
    >
      <div
        class="w-full h-full text-gray-200 flex items-center justify-between"
      >
        <img src="@/assets/brain.png" width="100" />

        <div class="grid grid-cols-4 gap-8 mr-auto">
          <RouterLink
            tag="p"
            to="/"
            class="text-gray-700 dark:text-gray-200 text-lg font-semibold"
          >
            Brain Segmentation
          </RouterLink>
          <RouterLink
            tag="p"
            to="/file-list"
            class="text-gray-700 dark:text-gray-200 text-lg font-medium"
          >
            File List
          </RouterLink>
        </div>

        <div class="flex items-center justify-between">
          <p class="mr-4 text-lg text-gray-700 dark:text-gray-200">
            {{ user.first_name }}
          </p>
          <label class="dark-mode ml-auto">
            <input
              type="checkbox"
              :checked="!isDark"
              @change="useDarkModeHandler"
            />
            <span></span>
          </label>

          <Icon
            @click="logoutHandler"
            icon="feather:log-out"
            width="30"
            class="text-gray-100"
            style="background-color: transparent; margin-left: 20px"
          />
        </div>
      </div>
    </header>
    <div v-if="isLoading">
      <Icon
        v-show="isLoading"
        icon="feather:rotate-ccw"
        color="green"
        :rotate="1"
        width="24"
        style="
          animation: spin 1s linear infinite;
          background-color: transparent;
          margin-left: 4px;
        "
        :horizontalFlip="true"
      />
    </div>
    <div v-else-if="data && data.length > 0">
      <ul>
        <li
          class="flex p-8 text-gray-100 bg-gradient-to-tr from-purple-800 to-green-500 my-4 justify-between items-center"
          v-for="file in data"
          :key="file._id"
        >
          <h3>{{ file.fileName }}</h3>
          <p class="text-gray-100">
            {{ new Date(file.createdAt).toLocaleString() }}
          </p>
          <div>
            <span class="text-blue-100">{{ file.status }}</span>
          </div>
          <div role="button" @click="downloadZip(file._id)" class="text-yellow-400 cursor-pointer font-bold">Download</div>
        </li>
      </ul>
    </div>
    <div v-else class="flex items-center justify-center">
      <h2>Folder Not Found This User</h2>
    </div>
  </div>
</template>

<style>
</style>