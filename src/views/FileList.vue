
<script>
import { Icon } from "@iconify/vue";
import { inject, ref, toRefs } from "@vue/runtime-core";
import { useClient } from "@/utils/apiClient";
import File from "@/components/File"
export default {
  components: { Icon,File },
  props: {
    data: { type: Array, default: () => [] },
    isLoading: { type: Boolean, default: false },
  },

  setup(props) {
    const user = inject("user");
    const client = useClient();
  
    function downloadZip(file_id) {
      return client(`downloadZip/${file_id}`, { method: "POST" }).then((data) =>
        console.log(data)
      );
    }

    //   console.log(data.value);
    return { user, downloadZip};
  },
};
</script>
<template>
  <div class="w-full h-full">
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
        <File 
        v-for="file in data" 
        :key="file._id" 
        :file="file"
        
        />
      </ul>
    </div>
    <div v-else class="flex items-center justify-center">
      <h2>Folder Not Found This User</h2>
    </div>
  </div>
</template>

<style>
</style>