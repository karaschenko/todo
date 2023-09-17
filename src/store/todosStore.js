import { defineStore } from "pinia";

export const useTodosStore = defineStore({
  id: "todos",
  state: () => ({
    todos: [],
    toasts: [],
    titleFilter: "",
    statusFilter: "All",
    userIdFilter: "all",
  }),
  getters: {
    filteredTodos() {
      let filtered = [...this.todos];

      if (this.titleFilter) {
        filtered = filtered.filter((todo) =>
          todo.title.toLowerCase().includes(this.titleFilter.toLowerCase())
        );
      }

      if (this.statusFilter === "Completed") {
        filtered = filtered.filter((todo) => todo.completed);
      } else if (this.statusFilter === "Uncompleted") {
        filtered = filtered.filter((todo) => !todo.completed);
      } else if (this.statusFilter === "Favorites") {
        const favoritesFromLocalStorage = JSON.parse(
          localStorage.getItem("favorites") || "[]"
        );
        filtered = filtered.filter((todo) =>
          favoritesFromLocalStorage.includes(todo.id)
        );
      }

      if (this.userIdFilter !== "all") {
        filtered = filtered.filter((todo) => todo.userId === this.userIdFilter);
      }

      return filtered;
    },
  },
  actions: {
    async fetchTodos() {
      const res = await fetch(`${process.env.VUE_APP_API_URL}/todos`);
      const data = await res.json();
      this.todos = data;
    },
    async addTodo(newTodo) {
      const res = await fetch(`${process.env.VUE_APP_API_URL}/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTodo),
      });
      const data = await res.json();

      const maxId = Math.max(...this.todos.map((todo) => todo.id));
      if (data.id <= maxId) {
        data.id = maxId + 1;
      }
      console.log(data);

      this.todos.unshift(data);
      return data;
    },
    async updateTodo(todoId, completed) {
      const url = `${process.env.VUE_APP_API_URL}/todos/${todoId}`;

      try {
        const response = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ completed }),
        });

        if (response.ok) {
          // Update the local state
          const todo = this.todos.find((t) => t.id === todoId);
          if (todo) {
            todo.completed = completed;
          }
        } else {
          console.error("Failed to update todo:", await response.text());
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    },
    setFavorite(todoId) {
      const todo = this.todos.find((t) => t.id === todoId);
      if (todo) {
        todo.favorite = true;
      }
    },
    removeFavorite(todoId) {
      const todo = this.todos.find((t) => t.id === todoId);
      if (todo) {
        todo.favorite = false;
      }
    },
    setFavoritesFromLocalStorage() {
      const favoriteIds = JSON.parse(localStorage.getItem("favorites") || "[]");
      for (const id of favoriteIds) {
        this.setFavorite(id);
      }
    },
    searchByTitle(title) {
      this.titleFilter = title;
    },
    filterByStatus(status) {
      this.statusFilter = status;
    },
    filterByUserId(userId) {
      this.userIdFilter = userId;
    },
    addToast(toast) {
      this.toasts.push(toast);
      setTimeout(() => {
        this.removeToast(0);
      }, 2000);
    },

    removeToast(index) {
      this.toasts.splice(index, 1);
    },
  },
});
