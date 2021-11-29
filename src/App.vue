<script>
import { inject, isRef, onUpdated, provide, Suspense } from "vue";
import UnAuthenticatedApp from "./UnAuthenticatedApp.vue";

export default {
  components: { UnAuthenticatedApp },

  setup() {
    const user = inject("user");
    console.log(user.value);
    onUpdated(() => console.log("App Updated Selahattin Reactive !!", user.value));

    return { user };
  },
};
</script>


<template>
<div v-if="user">Auth APp</div>
  <UnAuthenticatedApp v-else />
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
