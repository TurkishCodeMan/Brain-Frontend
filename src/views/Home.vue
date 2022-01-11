<script>
import { isDark, useDarkModeHandler } from "@/composable/useDarkModeHandler";
import { useHead } from "@vueuse/head";
import { Icon } from "@iconify/vue";
import { ref } from "@vue/reactivity";
import {
  inject,
  onMounted,
  onUpdated,
  watch,
  watchEffect,
} from "@vue/runtime-core";
import { useClient } from "@/utils/apiClient";
import { getToken } from "@/utils/authProvider";
import useNotyf from "@/composable/useNotyf";
import FileList from "./FileList.vue";
import { useUserFolders } from "@/utils/brain";

import TreeItem from "@/components/TreeItem";
export default {
  components: { Icon, FileList },
  setup() {
    const client = useClient();
    const notif = useNotyf();
    const user = inject("user");
    const token = getToken();
    const fileListData = ref([]);
    const fileDirectory = ref(null);

    const nodes = ref([
      {
        id: "1",
        label: "a",
        nodes: [
          {
            id: "4",
            label: "aa",
          },
          {
            id: "5",
            label: "ab",
          },
        ],
      },
      {
        id: "2",
        label: "b",
        nodes: [
          {
            id: "6",
            label: "ba",
            nodes: [
              {
                id: "11",
                label: "aaaa",
                nodes: [
                  {
                    id: "15",
                    label: "aaaa",
                  },
                  {
                    id: "16",
                    label: "bbbb",
                  },
                ],
              },
              {
                id: "12",
                label: "bbbb",
              },
            ],
          },
          {
            id: "7",
            label: "bb",
            nodes: [
              {
                id: "13",
                label: "cccc",
              },
              {
                id: "14",
                label: "dddd",
              },
            ],
          },
        ],
      },
      {
        id: "3",
        label: "c",
      },
    ]);

    const fetcher = function (file) {
      const formData = new FormData();
      formData.append("file", file);
      return client(`uploadZip?id=${user.value._id}&token=${token}`, {
        method: "POST",
        data: formData,
        formData: true,
      }).then((data) => data);
    };

    const fetchFileDirectory = async (token) => {
      return client(`?token=${token}`).then((data) => data);
    };

    const file = ref(null);
    let fileList = ref([]);

    const uploadSuccess = ref(false);

    async function manuelUpload(event) {
      fileList.value = [...event.target.files, fileList.value];
      const result = await fetcher(fileList.value[0]);
      console.log(result);
      if (result.status) {
        notif.success(result.message);
      
      uploadSuccess.value = false
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
        id: user.value._id,
      });
      fileListData.value = data;

      console.log("-******")
    }

    watch(fileList, async () => {
      console.log("--Guncellendis");
        uploadSuccess.value = true;
      await fetchUserFolder();
    });

    onMounted(async () => {
      fileDirectory.value = await fetchFileDirectory(token);

      nodes.value = fileDirectory.value.directories;

      fileListData.value.forEach((element) => {
        nodes.value = nodes.value.map((item) => {
          if (item.label === element.name) {
            return {
              ...element,
              ...item,
            };
          }
        });
      });

      console.log(nodes.value);
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
      uploadSuccess,
      nodes,
    };
  },
};
</script>

<style lang="scss" scoped>
.tree-row {
  padding: 80px !important;
}
</style>



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
        relative
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

      <div
        v-show="uploadSuccess"
        class="
          absolute
          z-10
          bg-opacity-70 bg-green-200
          transition-all
          animate-ping
          flex
          items-center
          justify-center
          w-full
          h-full
          text-2xl
        "
      >
        <Icon
          icon="feather:check-circle"
          width="80"
          class="text-green-500"
          style="background-color: transparent; margin-left: 20px"
        />
      </div>
    </div>

    <!-- <TreeItem
      class="item"
      v-for="item in nodes"
      :key="item.id"
      :item="item"
    ></TreeItem> -->

    <FileList :data="fileListData" />
  </div>
</template>

