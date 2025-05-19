<template>
  <div class="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
    <h1 class="text-3xl font-bold mb-6">Регистрация</h1>

    <form @submit.prevent="handleRegister">
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
          minlength="6"
          class="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1"
          >Роли:</label
        >
        <div class="flex space-x-4">
          <label class="flex items-center">
            <input
              type="checkbox"
              v-model="form.roles"
              value="buyer"
              class="mr-2"
            />
            Покупатель
          </label>
          <label class="flex items-center">
            <input
              type="checkbox"
              v-model="form.roles"
              value="seller"
              class="mr-2"
            />
            Продавец
          </label>
        </div>
      </div>
      <button
        type="submit"
        :disabled="isSubmitting"
        class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200 disabled:opacity-50"
      >
        {{ isSubmitting ? "Регистрация..." : "Зарегистрироваться" }}
      </button>
    </form>

    <div v-if="errorMessage" class="mt-4 p-3 bg-red-100 text-red-700 rounded">
      {{ errorMessage }}
    </div>
    <div
      v-if="successMessage"
      class="mt-4 p-3 bg-green-100 text-green-700 rounded"
    >
      {{ successMessage }}
    </div>

    <p class="mt-4 text-center">
      Уже есть аккаунт?
      <NuxtLink to="/login" class="text-blue-600 hover:underline"
        >Войти</NuxtLink
      >
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "~/composables/useAuth";

const router = useRouter();
const { register } = useAuth();

const form = reactive({
  email: "",
  password: "",
  roles: ["buyer"] as string[],
});

const isSubmitting = ref(false);
const errorMessage = ref<string | null>(null);
const successMessage = ref<string | null>(null);

const handleRegister = async () => {
  isSubmitting.value = true;
  errorMessage.value = null;
  successMessage.value = null;

  try {
    await register(form.email, form.password, form.roles);
    successMessage.value =
      "Регистрация успешна! Пожалуйста, проверьте вашу почту для подтверждения.";
    form.email = "";
    form.password = "";
    form.roles = ["buyer"];
    setTimeout(() => router.push("/login"), 3000);
  } catch (error: any) {
    errorMessage.value = error.message || "Ошибка регистрации";
  } finally {
    isSubmitting.value = false;
  }
};

useHead({
  title: "Регистрация - Vagiz Marketplace",
  meta: [
    { name: "description", content: "Зарегистрируйтесь в Vagiz Marketplace." },
  ],
});
</script>
