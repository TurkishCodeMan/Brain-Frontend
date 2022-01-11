<template>
  <li
    class="
      flex
      p-8
      text-gray-100
      bg-gradient-to-tr
      from-purple-800
      to-green-500
      my-4
      justify-between
      items-center
    "
  >
    <h3 class="sm:w-72">{{ file.fileName }}</h3>
    <p class="text-gray-100">
      {{ new Date(file.createdAt).toLocaleString() }}
    </p>
    <div class="flex items-center">
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
  </li>
</template>

<script>
import { getToken } from "@/utils/authProvider";
import { ref, toRefs } from "@vue/reactivity";
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

    const statusFile = ref(file.value.status);
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
      if (statusFile.value=== "Completed")
        return client(
          `startProcess?token=${token}&fileName=${file.value.fileName}`,
          { method: "POST" }
        ).then((data) => {
          var iframeElement = document.createElement("iframe");
          iframeElement.srcdoc = `<p>PSNR : ->>> ${data.PSNR}</p>`
          iframeElement.id = Math.random(9999);
          
          iframeElement.style.display = "none";
          iframeElement.name = Math.random(9999);
          document.body.append(iframeElement);

          setTimeout(() => {
            document.body.removeChild(iframeElement);
          }, [10000]);
          window.frames[0].print()
          return data;
        });

      notif.error("Please completed process after download !");
    }

    return {
      processStart,
      processLoading,
      statusFile,
      downloadZip,
    };
  },
};
</script>

<style>
</style>