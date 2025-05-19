<template>
  <div class="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
    <h1 class="text-3xl font-bold mb-6">Вход</h1>

    <form @submit.prevent="handleLogin">
      <div class="mb-4">
        <label for="email" class="block text-sm font-medium text-gray-700 mb-1"
          >Email:</label
        >
        <input
          type="email"
          id="email"
          v-model="form.email"
          required
          class="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div class="mb-4">
        <label
          for="password"
          class="block text-sm font-medium text-gray-700 mb-1"
          >Пароль:</label
        >
        <input
          type="password"
          id="password"
          v-model="form.password"
          required
          class="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <button
        type="submit"
        :disabled="isSubmitting"
        class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200 disabled:opacity-50"
      >
        {{ isSubmitting ? "Вход..." : "Войти" }}
      </button>
    </form>

    <div v-if="errorMessage" class="mt-4 p-3 bg-red-100 text-red-700 rounded">
      {{ errorMessage }}
    </div>

    <p class="mt-4 text-center">
      Нет аккаунта?
      <NuxtLink to="/register" class="text-blue-600 hover:underline"
        >Зарегистрироваться</NuxtLink
      >
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "~/composables/useAuth";

const router = useRouter();
const { login } = useAuth();

const form = reactive({
  email: "",
  password: "",
});

const isSubmitting = ref(false);
const errorMessage = ref<string | null>(null);

const handleLogin = async () => {
  isSubmitting.value = true;
  errorMessage.value = null;

  try {
    await login(form.email, form.password);
    router.push("/");
  } catch (error: any) {
    errorMessage.value = error.message || "Ошибка входа";
  } finally {
    isSubmitting.value = false;
  }
};

useHead({
  title: "Вход - Vagiz Marketplace",
  meta: [
    {
      name: "description",
      content: "Войдите в свой аккаунт Vagiz Marketplace.",
    },
  ],
});
</script>
