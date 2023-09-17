<template>
  <div class="add-todo">
    <h2 class="add-todo__title">Add new todo</h2>
    <form class="add-todo__form" @submit.prevent="addTodo">
      <input
        class="ui_input user-id-input"
        type="number"
        v-model="userId"
        placeholder="User ID"
      />
      <input class="ui_input title-input" v-model="title" placeholder="Title" />
      <button :disabled="loading" :class="['ui_button', { disabled: loading }]">
        Add
      </button>
    </form>
    <div v-show="isSuccess" class="add-todo__succes">
      New todo has been added
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useTodosStore } from "@/store/todosStore";

const userId = ref("");
const title = ref("");
const isSuccess = ref(false);
const todosStore = useTodosStore();

const loading = ref(false);
const addTodo = async () => {
  loading.value = true;
  try {
    if (userId.value && title.value) {
      const newTodo = await todosStore.addTodo({
        userId: userId.value,
        title: title.value,
      });
      if (newTodo.id) {
        isSuccess.value = true;
        setTimeout(() => {
          isSuccess.value = false;
        }, 3000);
      }
      userId.value = "";
      title.value = "";
    }
  } catch (e) {
    console.log("error on adding todo: ", e);
  }
  loading.value = false;
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables.scss";
.add-todo {
  background: $light-gray-color;
  padding: calc(3 * var(--base-space));
  text-align: center;

  &__title {
    color: #fff;
    font-size: calc(1.3 * var(--base-font-size));
  }

  &__form {
    display: flex;
    justify-content: center;
    margin: auto;
    margin-top: calc(2 * var(--base-space));
    gap: calc(4 * var(--base-space));
    max-width: 700px;

    @media (max-width: $xs-screen) {
      flex-direction: column;
      gap: calc(2 * var(--base-space));
    }

    .title-input {
      flex-grow: 2;
    }
  }
  &__succes {
    color: #fff;
    margin-top: calc(2 * var(--base-space));
  }
}
</style>
