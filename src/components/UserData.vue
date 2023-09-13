<template>
  <div class="user-data">
    <div @click="showPopup = !showPopup" class="clickable">
      {{ userData?.username }}
      <span class="details" v-if="!showPopup"> (Show Details) </span>
      <span class="details" v-else> (Hide Details)</span>
    </div>
    <div v-if="showPopup" class="user-popup">
      <p><strong>Name:</strong> {{ userData?.name }}</p>
      <p><strong>Email:</strong> {{ userData?.email }}</p>
      <p><strong>Phone:</strong> {{ userData?.phone }}</p>
      <p><strong>Website:</strong> {{ userData?.website }}</p>
      <p><strong>Company:</strong> {{ userData?.company.name }}</p>
      <p><strong>Address:</strong> {{ userData?.address.city }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useUserStore } from "@/store/userStore";
import { storeToRefs } from "pinia";

const userStore = useUserStore();
const { userData } = storeToRefs(userStore);
const showPopup = ref(false);
</script>

<style lang="scss" scoped>
.user-data {
  cursor: pointer;

  .details {
    text-decoration: underline;
  }
}

.user-popup {
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  padding: 10px;
  position: absolute;
  z-index: 1;
  width: 300px;
  color: #000;
  p {
    margin-bottom: var(--base-space);
  }
}
</style>
