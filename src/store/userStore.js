import { defineStore } from "pinia";

export const useUserStore = defineStore({
  id: "user",
  state: () => ({
    userData: {},
    userIds: [],
  }),
  actions: {
    async getUsers() {
      try {
        const res = await fetch(`${process.env.VUE_APP_API_URL}/users`);
        const users = await res.json();
        this.userIds = users.map((user) => user.id);
        return users;
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    },
    setUserData(data) {
      this.userData = data;
      localStorage.setItem("userData", JSON.stringify(data));
    },
    loadUserDataFromLocalStorage() {
      const data = localStorage.getItem("userData");
      if (data) {
        this.userData = JSON.parse(data);
      }
    },
  },
});
