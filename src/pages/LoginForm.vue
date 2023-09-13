<template>
  <div class="login">
    <form class="login-form" @submit.prevent="loginHanlder">
      <div class="login-form__title">Your TODO list</div>
      <div class="login-form__item">
        <label class="login-form__label" for="username">Username:</label>
        <input
          class="login-form__input ui_input"
          type="text"
          id="username"
          placeholder="Username"
          v-model="formData.username"
          required
        />
        <p v-if="usernameError" class="login-form__error">
          {{ usernameError }}
        </p>
      </div>
      <div class="login-form__item">
        <label class="login-form__label" for="phoneNumber">Phone Number:</label>
        <input
          type="text"
          id="phoneNumber"
          placeholder="Phone number"
          class="login-form__input ui_input"
          v-model="formData.phoneNumber"
          required
        />
        <p v-if="phoneNumberError" class="login-form__error">
          {{ phoneNumberError }}
        </p>
        <p v-if="loginError" class="login-form__error">
          {{ loginError }}
        </p>
      </div>
      <div class="login-form__item">
        <button
          :disabled="loading"
          type="submit"
          :class="['ui_button', { disabled: loading }]"
        >
          Login
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/userStore";

const router = useRouter();
const userStore = useUserStore();

const formData = ref({
  username: "Moriah.Stanton",
  phoneNumber: "024-648-3804",
});

const usernameError = ref("");
const phoneNumberError = ref("");
const loginError = ref("");
const loading = ref(false);

const loginHanlder = async () => {
  if (validateForm()) {
    loading.value = true;
    try {
      const users = await userStore.getUsers();

      const inputPhone = formData.value.phoneNumber;

      const foundUser = users.find((user) => {
        const originalPhone = user.phone;

        // sometimes API returns incorrect phone format with 'x' aphter number
        const cleanedPhone = originalPhone.split(" ")[0];
        return (
          user.username === formData.value.username &&
          (cleanedPhone === inputPhone || originalPhone === inputPhone)
        );
      });

      if (foundUser) {
        userStore.setUserData(foundUser);
        router.push("/dashboard");
      } else {
        loginError.value = "Login Error";
      }
      loading.value = false;
    } catch (error) {
      loading.value = false;
      console.log(error);
    }
  }
};

const validateForm = () => {
  let isValid = true;

  if (!/^[\w\W]+$/.test(formData.value.username)) {
    usernameError.value = "Username should contain only letters.";
    isValid = false;
  } else {
    usernameError.value = "";
  }

  if (!/^[\d\s()+-]+$/.test(formData.value.phoneNumber)) {
    phoneNumberError.value =
      "Phone number should contain only digits and symbols.";
    isValid = false;
  } else {
    phoneNumberError.value = "";
  }

  return isValid;
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables.scss";
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  background: #333;
  color: $gray-text-color;
  padding: calc(6 * var(--base-space));

  &-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 447px;
    background: $light-gray-color;
    border-radius: 5px;

    &__title {
      background: $dark-gray-color;
      width: 100%;
      padding: calc(2 * var(--base-space));
      text-align: center;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      margin-bottom: calc(3 * var(--base-space));
    }

    &__item {
      padding: 0 calc(2 * var(--base-space));
      margin-bottom: calc(3 * var(--base-space));
      display: flex;
      flex-direction: column;
      width: 100%;
      position: relative;

      .ui_input {
        padding: 10px;
      }

      .ui_button {
        padding: 10px 30px;
      }
    }

    &__input {
      background: #fff;
      width: 100%;
    }

    &__label {
      margin-bottom: var(--base-space);
    }

    &__error {
      align-self: baseline;
      display: inline-block;
      padding: 3px var(--base-space);
      color: #ff0038;
    }
  }
}
</style>
