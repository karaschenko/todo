<template>
  <div class="toasts-container">
    <div v-for="toast in toasts" :key="toast.id" :class="`toast ${toast.type}`">
      {{ toast.message }}
    </div>
  </div>
</template>

<script setup>
import { useTodosStore } from "@/store/todosStore";
import { storeToRefs } from "pinia";

const { toasts } = storeToRefs(useTodosStore());
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables.scss";
.toasts-container {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 2;
}

.toast {
  margin: 1rem;
  padding: 1rem;
  border-radius: 0.25rem;
}

.toast.success {
  background-color: $primary-color;
}

.toast.error {
  background-color: $error-color;
}
</style>
