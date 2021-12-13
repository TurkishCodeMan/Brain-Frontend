<script>
import { inject, isRef, onUpdated, provide, Suspense } from "vue";
import UnAuthenticatedApp from "./UnAuthenticatedApp.vue";
import AuthenticatedApp from "./AuthenticatedApp.vue";

export default {
  components: { UnAuthenticatedApp, AuthenticatedApp },

  setup() {
    const user = inject("user");
    console.log(user.value);
    onUpdated(() =>
      console.log("App Updated Selahattin Dayı Reactive !!", user.value)
    );

    return { user };
  },
};
</script>


<template>
  <AuthenticatedApp v-if="user" />
  <UnAuthenticatedApp v-else />
</template>

<style lang="postcss">
body,#app{
  width:100%;
  min-height:100vh;
}

  #app{
    background: url('./assets/fakurian.jpg') no-repeat center;
    background-color: rgba(7, 26, 26, 0.6);
  }
</style>
