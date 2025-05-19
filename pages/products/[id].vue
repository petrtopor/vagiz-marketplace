<template>
  <div>
    <div v-if="pending" class="text-center py-10">
      <p class="text-lg text-gray-500">Загрузка информации о товаре...</p>
    </div>

    <div
      v-else-if="error"
      class="text-center py-10 bg-red-100 text-red-700 p-4 rounded"
    >
      <p class="font-semibold">Не удалось загрузить товар:</p>
      <p>{{ error.data?.message || error.message }}</p>
      <NuxtLink
        to="/"
        class="mt-2 inline-block bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
      >
        Вернуться в каталог
      </NuxtLink>
    </div>

    <div v-else-if="product" class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <img
          :src="product.image"
          :alt="product.name"
          class="w-full max-w-md mx-auto h-auto object-contain rounded-lg shadow-md border"
        />
      </div>

      <div>
        <h1 class="text-3xl font-bold mb-3">{{ product.name }}</h1>
        <p class="text-gray-700 mb-4 text-lg">{{ product.description }}</p>

        <div class="mb-4 border-t pt-4">
          <h2 class="text-xl font-semibold mb-2">Характеристики:</h2>
          <ul class="list-disc list-inside text-gray-600 space-y-1">
            <li>Категория: {{ product.category }}</li>
            <li>Бренд: {{ product.brand }}</li>
            <li>Рейтинг: {{ product.rating }} / 5</li>
            <li>Продавец: {{ product.seller.email }}</li>
          </ul>
        </div>

        <p class="text-3xl font-bold text-green-600 mb-6">
          {{ formatPrice(product.price) }}
        </p>

        <div class="flex space-x-4">
          <button
            @click="handleAddToCart"
            class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded transition-colors duration-200"
          >
            Добавить в корзину
          </button>
          <button
            @click="handleAddToFavorites"
            class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded transition-colors duration-200"
          >
            {{ isFavorite ? "Убрать из избранного" : "Добавить в избранное" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { useAsyncData, useRuntimeConfig } from "#app";
import { useCart } from "~/composables/useCart";
import { useFavorites } from "~/composables/useFavorites";
import type { Product } from "~/types/product";

const config = useRuntimeConfig();
const route = useRoute();
const productId = route.params.id as string;

const { addToCart } = useCart();
const { favorites, addToFavorites, removeFromFavorites, fetchFavorites } =
  useFavorites();

const {
  data: product,
  pending,
  error,
} = await useAsyncData<Product>(`product-detail-${productId}`, () =>
  $fetch(`${config.public.apiBase}/products/${productId}`)
);

const isFavorite = computed(() => {
  return favorites.value.some((fav) => fav.product.id === productId);
});

const handleAddToCart = () => {
  if (product.value) {
    addToCart(product.value, 1);
    alert(`${product.value.name} добавлен в корзину!`);
  }
};

const handleAddToFavorites = async () => {
  if (!product.value) return;
  if (isFavorite.value) {
    const favorite = favorites.value.find(
      (fav) => fav.product.id === productId
    );
    if (favorite) {
      await removeFromFavorites(favorite.id);
      alert(`${product.value.name} удален из избранного!`);
    }
  } else {
    await addToFavorites(productId);
    alert(`${product.value.name} добавлен в избранное!`);
  }
  await fetchFavorites();
};

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0,
  }).format(price);
};

watchEffect(() => {
  if (product.value) {
    useHead({
      title: `${product.value.name} - Vagiz Marketplace`,
      meta: [{ name: "description", content: product.value.description }],
    });
  } else if (error.value) {
    useHead({
      title: "Ошибка - Товар не найден",
      meta: [
        { name: "description", content: "Не удалось найти запрошенный товар." },
      ],
    });
  }
});
</script>
