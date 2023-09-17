<template>
  <div class="todo-list_w">
    <h2 class="todo-list__title">ToDo List</h2>
    <ul v-if="filteredTodos.length > 0" class="todo-list">
      <li class="todo-list__item" v-for="todo in filteredTodos" :key="todo.id">
        <input
          class="todo-list__checkbox"
          type="checkbox"
          :checked="todo.completed"
          :id="`todo-${todo.id}`"
          @change="updateTodo($event, todo)"
        />
        <label
          :for="`todo-${todo.id}`"
          :class="{ completed: todo.completed }"
          >{{ todo.title }}</label
        >
        <img
          v-if="todo.favorite"
          class="favorite-img"
          src="@/assets/star.svg"
          alt="star"
        />
        <button
          v-if="todo.favorite"
          @click="removeFromFavorite(todo.id)"
          class="favorite-button remove"
        >
          Remove from Favorite
        </button>
        <button
          v-else
          @click="addToFavorite(todo.id)"
          class="favorite-button add"
        >
          Add to Favorite
        </button>
      </li>
    </ul>
    <div v-else>No ToDo's found</div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useTodosStore } from "@/store/todosStore";
import { useUserStore } from "@/store/userStore";
import { storeToRefs } from "pinia";

import debounce from "@/helpers/debounce";

const todosStore = useTodosStore();
const { todos, filteredTodos } = storeToRefs(todosStore);

const userStore = useUserStore();
const { userData } = storeToRefs(userStore);

const addToFavorite = (todoId) => {
  todosStore.setFavorite(todoId);
  const existingFavorites = JSON.parse(
    localStorage.getItem("favorites") || "[]"
  );
  existingFavorites.push(todoId);
  localStorage.setItem("favorites", JSON.stringify(existingFavorites));
};

const removeFromFavorite = (todoId) => {
  todosStore.removeFavorite(todoId);
  let existingFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
  existingFavorites = existingFavorites.filter((id) => id !== todoId);
  localStorage.setItem("favorites", JSON.stringify(existingFavorites));
};

const debouncedUpdateTodo = debounce((todoId, completed) => {
  todosStore.updateTodo(todoId, completed);
}, 300);

const updateTodo = (event, todo) => {
  if (todo.userId !== userData.value.id) {
    todosStore.addToast({
      message: "You are not allowed to change todos of other users",
      type: "error",
    });
    event.target.checked = !event.target.checked;
    return;
  }

  const completed = event.target.checked;
  debouncedUpdateTodo(todo.id, completed);
};

onMounted(async () => {
  await todosStore.fetchTodos();
  filteredTodos.value = todos.value;
  todosStore.setFavoritesFromLocalStorage();
});
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables.scss";
.todo-list_w {
  padding: calc(6 * var(--base-space));

  @media (max-width: $xs-screen) {
    padding: calc(4 * var(--base-space)) 0;
  }
}
.todo-list {
  list-style: none;
  padding: 0;
  max-height: 40vh;
  margin-bottom: calc(6 * var(--base-space));
  overflow: auto;

  @media (max-width: $xs-screen) {
    flex-direction: column;
    gap: calc(2 * var(--base-space));
  }

  &__title {
    font-size: calc(1.5 * var(--base-font-size));
    margin-bottom: calc(4 * var(--base-space));
  }

  &__item {
    display: flex;
    align-items: center;
    padding: calc(2 * var(--base-space));
    border-bottom: 1px solid #ccc;
    gap: calc(2 * var(--base-space));

    .completed {
      text-decoration: line-through;
    }

    .favorite-button {
      outline: none;
      border: none;
      margin-left: auto;
      padding: var(--base-space);
      outline: unset;
      appearance: none;
      color: #fff;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s ease;

      white-space: nowrap;
      &.add {
        background-color: #007bff;
        &:hover {
          background-color: #0056b3;
        }
      }
      &.remove {
        background-color: #ff5733;
        &:hover {
          background-color: #e43d00;
        }
      }

      &:hover {
        background-color: #0056b3;
      }
    }

    .favorite-img {
      width: calc(1.2 * var(--base-font-size));
    }
  }
}
</style>
