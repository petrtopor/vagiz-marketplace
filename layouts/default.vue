<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-md sticky top-0 z-10">
      <nav
        class="container mx-auto px-4 py-3 flex justify-between items-center"
      >
        <NuxtLink to="/" class="text-xl font-bold text-blue-600">
          Vagiz Marketplace
        </NuxtLink>
        <div>
          <NuxtLink
            to="/cart"
            class="relative inline-block mr-4 text-gray-600 hover:text-blue-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span
              v-if="cartItemCount > 0"
              class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
            >
              {{ cartItemCount }}
            </span>
          </NuxtLink>
        </div>
      </nav>
    </header>

    <main class="container mx-auto px-4 py-8">
      <slot />
    </main>

    <footer class="bg-gray-800 text-white text-center p-4 mt-auto">
      <p>
        &copy; {{ new Date().getFullYear() }} Vagiz Marketplace. Все права
        защищены.
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useCart } from "~/composables/useCart";
const { cartItemCount } = useCart();
</script>

<style>
/* Можно добавить глобальные стили здесь или в assets/css/tailwind.css */
body {
  font-family: sans-serif;
}
.container {
  max-width: 1280px; /* Ограничиваем ширину контейнера */
}
</style>
