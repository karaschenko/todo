<template>
  <div class="todo">
    <ToastMessage />
    <header class="todo__header">
      <div class="container">
        <user-data></user-data>
        <button class="todo__logout" @click="logout">Logout</button>
      </div>
    </header>
    <div class="container todo__content">
      <add-todo></add-todo>
      <todo-filter></todo-filter>
      <todo-list></todo-list>
    </div>
    <footer class="todo__footer">
      Ccopyright - {{ new Date().getFullYear() }}
    </footer>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/userStore";

import AddTodo from "@/components/AddTodo.vue";
import TodoFilter from "@/components/TodoFilter.vue";
import TodoList from "@/components/TodoList.vue";
import UserData from "@/components/UserData.vue";
import ToastMessage from "@/components/ToastMessage.vue";

const router = useRouter();
const userStore = useUserStore();

const logout = () => {
  const router = useRouter();
  localStorage.removeItem("userData");
  router.push("/");
};

onMounted(() => {
  userStore.loadUserDataFromLocalStorage();
  if (!userStore.userData.id) {
    router.push("/");
  }
});
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables.scss";

.todo {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  min-height: 100vh;

  &__header .container {
    display: flex;
  }

  &__logout {
    all: unset;
    margin-left: auto;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }

  &__header,
  &__footer {
    height: calc(8 * var(--base-space));
    background: $primary-color;
    width: 100%;
    display: flex;
    justify-content: center;
    color: #fff;
    align-items: center;
  }
  &__footer {
    background: $dark-gray-color;
  }

  &__content {
    flex-grow: 1;
  }
}
</style>
