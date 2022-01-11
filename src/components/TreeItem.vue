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
      flex-col
    "
  >
    <div class="flex" :class="{ bold: isFolder }" @click="toggle" @dblclick="makeFolder">
      <h3 class="sm:w-72">{{ item.label }}</h3>
     
      <span v-if="isFolder"  >[{{ isOpen ? "-" : "+" }}]</span>
    </div>
    <ul v-show="isOpen" v-if="isFolder">
      <TreeItem
        class="item"
        v-for="(child, index) in item.nodes"
        :key="index"
        :item="child"
        @make-folder="$emit('make-folder', $event)"
        @add-item="$emit('add-item', $event)"
      ></TreeItem>
      <li class="add" @click="$emit('add-item', item)">+</li>
    </ul>
  </li>
</template>

<script>
export default {
  props: {
    item: Object,
  },

  data: function () {
    return {
      isOpen: false,
    };
  },
  computed: {
    isFolder: function () {
      return this.item.nodes && this.item.nodes.length;
    },
  },
  methods: {
    toggle() {
      if (this.isFolder) {
        this.isOpen = !this.isOpen;
      }
    },
    makeFolder() {
      if (!this.isFolder) {
        this.$emit("make-folder", this.item);
        this.isOpen = true;
      }
    },
  },
  mounted() {
    console.log(this.item);
  },
};
</script>

<style>
</style>