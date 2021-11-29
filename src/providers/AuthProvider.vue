<script>
import * as auth from "@/utils/authProvider.js";
import { provide, watchEffect } from "@vue/runtime-core";
import { useAsync } from "@/composable/useAsync";
import FullPageSpinner from "@/components/base/FullPageSpinner";
export default {
  components: { FullPageSpinner },
  async setup() {
    const {
      data: user,
      error,
      status,
      isLoading,
      isError,
      isSuccess,
      isIdle,
      run,
      setData,
      setError,
    } = useAsync();

    provide("user", {value:{name:'Deneme'}});
    provide("login", login);
    provide("logout", logout);

    await run(new Promise((res) => res(auth.getUser())));

    function login(formData) {
      auth.login(formData).then((user) => {
        setData(user);
      });
    }

    function logout() {
      auth.logout();
      setData(null);
    }

    watchEffect(() => {
      if (isError.value) {
        goLogin();
      }
    });

    function goLogin() {
      setError(null);
      setData(null);
    }

    console.log("AuthProvbider render");
    return {
      status,
      isLoading,
      isError,
      isSuccess,
      isIdle,
      user,
      login,
      goLogin,
    };
  },
};
</script>


<template>
  <div v-if="isLoading || isIdle">
    <FullPageSpinner />
  </div>
  <div v-if="isError">
    <div>
      <p>Please reauthenticate !</p>
      <span role="button" @click="goLogin">Go Login</span>
    </div>
  </div>
  <div v-if="isSuccess" class="auth-provider">
    <slot></slot>
  </div>
</template>
