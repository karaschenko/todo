<template>
  <div class="filter">
    <div class="filter-item">
      <label class="filter-item__label" for="status">Filter by Status:</label>
      <select class="ui_select" id="status" v-model="selectedStatus">
        <option
          v-for="option in statusOptions"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
    </div>

    <div class="filter-item">
      <label for="userId">Filter by User ID:</label>
      <select
        class="ui_select"
        id="userId"
        v-model="selectedUserId"
        @change="handleUserIdChange"
      >
        <option value="all">All Users</option>
        <option v-for="id in uniqueUserIds" :key="id" :value="id">
          {{ id }}
        </option>
      </select>
    </div>

    <div class="filter-item">
      <label class="filter-item__label" for="title">Search by Title:</label>
      <input
        class="ui_input"
        id="title"
        v-model="searchTitle"
        placeholder="Search..."
        @input="debouncedSearch"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { useTodosStore } from "@/store/todosStore";
import debounce from "@/helpers/debounce";

const todosStore = useTodosStore();

const selectedStatus = ref("All");
const searchTitle = ref("");

const uniqueUserIds = computed(() => {
  const ids = todosStore.todos.map((todo) => todo.userId);
  return [...new Set(ids)];
});

const selectedUserId = ref("all");

const handleUserIdChange = () => {
  todosStore.filterByUserId(selectedUserId.value);
};

const statusOptions = [
  { label: "All", value: "All" },
  { label: "Completed", value: "Completed" },
  { label: "Uncompleted", value: "Uncompleted" },
  { label: "Favorites", value: "Favorites" },
];

const handleSearch = () => {
  todosStore.searchByTitle(searchTitle.value);
};

const debouncedSearch = debounce(handleSearch, 300);

watch(selectedStatus, (newStatus) => {
  todosStore.filterByStatus(newStatus);
});

watch(selectedUserId, (newUserId) => {
  todosStore.filterByUserId(newUserId);
});
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables.scss";
.filter {
  display: flex;
  justify-content: center;
  gap: calc(4 * var(--base-space));
  margin-top: calc(4 * var(--base-space));

  @media (max-width: $xs-screen) {
    flex-direction: column;
    gap: calc(2 * var(--base-space));
  }

  &-item {
    display: flex;
    flex-direction: column;
    gap: var(--base-space);
  }
}
</style>
