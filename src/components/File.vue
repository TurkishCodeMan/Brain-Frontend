<template>
  <li
    class="
      p-8
      text-gray-100
      bg-gradient-to-tr
      from-purple-800
      to-green-500
      my-4
      justify-between
      items-center
      list-none
    "
  >
    <div class="flex w-full h-full items-center justify-center">
      <h3 class="sm:w-full text-gray-100">{{ file.label }}</h3>
      <p class="text-gray-100 w-full">
        {{ new Date(file.createdAt).toLocaleString() }}
      </p>
      <div class="flex items-center w-full">
        <span
          :class="[statusFile === 'Completed' ? 'text-md text-green-400' : '']"
          class="text-blue-100"
          >{{ statusFile }}</span
        >
        <Icon
          v-show="statusFile === 'Ready'"
          icon="feather:clock"
          width="30"
          class="text-yellow-500"
          style="background-color: transparent; margin-left: 20px"
        />
        <Icon
          v-show="statusFile === 'Completed'"
          icon="feather:check-circle"
          width="30"
          class="text-green-300"
          style="background-color: transparent; margin-left: 20px"
        />
        <Icon
          :key="file._id"
          v-if="processLoading"
          icon="feather:loader"
          width="30"
          class="text-gray-100 cursor-pointer"
          style="background-color: transparent; margin-left: 20px"
        />
        <Icon
          v-else
          @click="processStart"
          icon="feather:play"
          width="30"
          class="text-gray-100 cursor-pointer"
          style="background-color: transparent; margin-left: 20px"
        />
      </div>
      <div
        role="button"
        @click="downloadZip"
        class="text-yellow-200 cursor-pointer font-bold"
      >
        Download
      </div>
      <div v-if="isFolder" @click="toggle" class="ml-4">
        
        <Icon
          v-show="isOpen"
          icon="feather:folder-minus"
          width="30"
          class="text-gray-100 cursor-pointer"
          style="background-color: transparent; margin-left: 20px"
        />
        <Icon
          v-show="!isOpen"
          icon="feather:folder-plus"
          width="30"
          class="text-gray-100 cursor-pointer"
          style="background-color: transparent; margin-left: 20px"
        />
      </div>
    </div>

    <div class="flex flex-col w-full">
      <ul
        class="flex flex-col"
        v-show="isOpen"
        v-if="isFolder && file?.nodes && file?.nodes.length > 0"
      >
        <File
          class="item"
          v-for="(child, index) in file.nodes"
          :key="index"
          :file="child"
        ></File>
      </ul>
    </div>
  </li>
</template>

<script>
import { getToken } from "@/utils/authProvider";
import { ref, toRefs, computed } from "@vue/reactivity";
import { useClient } from "@/utils/apiClient";
import { Icon } from "@iconify/vue";
import useNotyf from "@/composable/useNotyf";

export default {
  props: {
    file: { type: Object, default: () => {} },
  },
  components: { Icon },

  setup(props) {
    const processLoading = ref(false);
    const token = getToken();
    const client = useClient();
    const { file } = toRefs(props);
    const notif = useNotyf();
    console.log(file.value);
    const statusFile = ref(file?.value?.status || "Ready");

    const isOpen = ref(false);
    const isFolder = computed(
      () => file.value.nodes && file.value.nodes.length
    );
    function toggle() {
      if (isFolder.value) {
        isOpen.value = !isOpen.value;
      }
    }

    const processStart = async () => {
      processLoading.value = true;
      return client(
        `startProcess?token=${token}&fileName=${file.value.fileName}`,
        { method: "POST" }
      ).then((data) => {
        console.log(data);
        statusFile.value = data.status;
        processLoading.value = false;
        return data;
      });
    };

    function downloadZip() {
      if (statusFile.value === "Completed")
        return client(
          `startProcess?token=${token}&fileName=${file.value.fileName}`,
          { method: "POST" }
        ).then((data) => {
          var iframeElement = document.createElement("iframe");
          iframeElement.srcdoc = `<p>PSNR : ->>> ${data.PSNR}</p>`;
          iframeElement.id = Math.random(9999);

          iframeElement.style.display = "none";
          iframeElement.name = Math.random(9999);
          document.body.append(iframeElement);

          setTimeout(() => {
            document.body.removeChild(iframeElement);
          }, [10000]);
          window.frames[0].print();
          return data;
        });

      notif.error("Please completed process after download !");
    }

    return {
      processStart,
      processLoading,
      statusFile,
      downloadZip,
      isFolder,
      toggle,
      isOpen,
    };
  },
};
</script>

<style>
</style>