<script>
import { defineAsyncComponent, Suspense } from "@vue/runtime-core";
import FullPageSpinner from "@/components/base/FullPageSpinner";

const AuthProvider = defineAsyncComponent(() =>
  import("@/providers/AuthProvider")
);
const App = defineAsyncComponent(() => import("./App.vue"));

export default {
  components: { AuthProvider, Suspense, App, FullPageSpinner },
};
</script>

<template>
  <Suspense>
    <template #default>
      <AuthProvider>
        <App />
      </AuthProvider>
    </template>
    <template #fallback>
      <FullPageSpinner />
    </template>
  </Suspense>
</template>

