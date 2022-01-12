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

import File from "@/components/File";
import { useRoute, useRouter } from "vue-router";
export default {
  components: { Icon,File },
  setup() {
    const client = useClient();
    const notif = useNotyf();
    const user = inject("user");
    const token = getToken();
    const fileListData = ref([]);
    const fileDirectory = ref(null);
    const route = useRoute();
    const router = useRouter();
    const nodes = ref([]);

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

    async function reFetch(result) {
      console.log(result);
      if (result.status) {
        notif.success(result.message);
      }
      uploadSuccess.value = false;

      await fetchUserFolder();
    }

    async function manuelUpload(event) {
      fileList.value = [...event.target.files, fileList.value];
      uploadSuccess.value = true;
      const result = await fetcher(fileList.value[0]);
      await reFetch(result);
    }

    async function onChange() {
      fileList.value = [...file.files, ...fileList.value];
      uploadSuccess.value = true;
      const result = await fetcher(fileList.value[0]);
      await reFetch(result);
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

      console.log("-******");
    }

    onMounted(async () => {
      if (route.path.includes("login")) {
        router.push("/");
      }
      await fetchUserFolder();
      var newNodes=[]
      fileDirectory.value = await fetchFileDirectory(token);
      nodes.value = fileDirectory.value.directories;

       fileListData.value.forEach((element) => {
         return nodes.value.forEach((item) => {
           if (item.label.slice(5)===element.fileName) {
             return newNodes.push({
               ...element,
              ...item,
              label:item.label.slice(5)
            })
         }else if(item.label!=''&&!newNodes.some(inItem=>item.label===inItem.label)&&!item.label.match(/file/g)){
           return newNodes.push({
             ...item,

           })
         }
         });
       });
       console.log(newNodes)


      nodes.value=newNodes


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
        accept=".nii,.tar,.gz,.zip,.rar"
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
          flex
          items-center
          justify-center
          w-full
          h-full
          text-2xl
        "
      >
        <Icon
          icon="feather:loader"
          width="80"
          class="text-green-500 animate-spin"
          style="background-color: transparent; margin-left: 20px"
        />
      </div>
    </div>

    <File
      class="item"
      v-for="item in nodes"
      :key="item.id"
      :file="item"
    ></File>

    <!-- <FileList :data="fileListData" /> -->
  </div>
</template>

