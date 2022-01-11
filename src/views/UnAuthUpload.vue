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
        </div>

        <div class="flex items-center justify-between">
          <label class="dark-mode ml-auto mr-4">
            <input
              type="checkbox"
              :checked="!isDark"
              @change="useDarkModeHandler"
            />
            <span></span>
          </label>
          <RouterLink
            tag="p"
            :to="{name:'Login'}"
            class="text-gray-700 dark:text-gray-200 text-lg font-medium"
          >
            Login
          </RouterLink>
        </div>
      </div>
    </header>
    <div
      class="
        p-12
        bg-transparent
        text-gray-200
        border border-gray-200
        md:m-20
        h-96
        flex
        rounded-lg
        items-center
        justify-center
        bg-gradient-to-r
        from-yellow-300
        to-yellow-200

      "
      @dragover="dragover"
      @dragleave="dragleave"
      @drop="drop"
    >
      <input
        type="file"
        multiple
        name="fields[assetsFieldHandle][]"
        id="assetsFieldHandle"
        class="w-px h-px opacity-0 overflow-hidden absolute"
        @change="manuelUpload"
        :ref="file"
        accept=".pdf,.jpg,.jpeg,.png,.zip,.rar"
      />

      <label for="assetsFieldHandle" class="block cursor-pointer">
        <div class="text-gray-600 text-xl font-sans">
          Explain to our users they can drop files in here or
          <span class="underline">click here</span> to upload their files
        </div>
      </label>
      <ul
        class="mt-4 flex flex-col bg-transparent items-center justify-center"
        v-if="fileList.length"
        v-cloak
      >
        <li class="text-sm p-1" v-for="file in fileList" :key="file">
          {{ file.name
          }}<button
            class="ml-2"
            type="button"
            @click="remove(fileList.indexOf(file))"
            title="Remove file"
          >
            remove
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { isDark, useDarkModeHandler } from "@/composable/useDarkModeHandler";
import { useHead } from "@vueuse/head";
import { ref } from "@vue/reactivity";
import { inject, onMounted, watch } from "@vue/runtime-core";
import { useClient } from "@/utils/apiClient";
import { getToken } from "@/utils/authProvider";
import useNotyf from "@/composable/useNotyf";
import { useUserFolders } from "@/utils/brain";

export default {
  setup() {
    const client = useClient();
    const notif = useNotyf();
    const user = inject("user");
    const token = getToken();
    const fileListData = ref([]);
    const fetcher = function (file) {
      const formData = new FormData();
      formData.append("file", file);
      return client(`uploadZip?id=${user.value._id}&token=${token}`, {
        method: "POST",
        data: formData,
        formData: true,
      }).then((data) => data);
    };

    const file = ref(null);
    let fileList = ref([]);

    async function manuelUpload(event) {
      fileList.value = [...event.target.files, fileList.value];
      const result = await fetcher(fileList.value[0]);
      console.log(result);
      if (result.status) {
        notif.success(result.message);
      }
    }

    async function onChange() {
      fileList.value = [...file.files, ...fileList.value];
      const result = await fetcher(fileList.value[0]);
      console.log(result);
    }
    function remove(i) {
      fileList.value.splice(i, 1);
    }
    function dragover(event) {
      event.preventDefault();
    }
    function dragleave(event) {
      event.currentTarget.classList.add("bg-gray-200");
      event.currentTarget.classList.remove("bg-green-300");
    }
    function drop(event) {
      event.preventDefault();
      file.files = event.dataTransfer.files;
      console.log(event.dataTransfer.files);
      onChange();
    }
    const logoutHandler = inject("logout");

    async function fetchUserFolder() {
      const data = await useUserFolders({
        id: 2
      });
      fileListData.value = data;
    }
    watch(fileList, async () => {
      await fetchUserFolder();
    });

    onMounted(async () => {
      await fetchUserFolder();
    });

    useHead({
      title: "Segmentation",
    });

    return {
      fileList,
      useDarkModeHandler,
      isDark,
      file,
      logoutHandler,
      user,
      onChange,
      remove,
      dragover,
      dragleave,
      drop,
      manuelUpload,
      fileListData,
    };
  },
};
</script>


<style>
</style>