<template>
  <div
    class="border rounded-lg p-4 shadow hover:shadow-md transition-shadow duration-200 flex flex-col"
  >
    <img
      :src="product.image"
      :alt="product.name"
      class="w-full h-40 object-contain mb-4 rounded"
    />
    <h3 class="text-lg font-semibold mb-2 flex-grow">{{ product.name }}</h3>
    <p class="text-sm text-gray-600 mb-1">Бренд: {{ product.brand }}</p>
    <p class="text-sm text-gray-600 mb-1">Категория: {{ product.category }}</p>
    <p class="text-sm text-gray-600 mb-3">Рейтинг: {{ product.rating }} / 5</p>
    <p class="text-xl font-bold mb-4">{{ formatPrice(product.price) }}</p>
    <div class="mt-auto flex justify-between items-center">
      <NuxtLink
        :to="`/products/${product.id}`"
        class="text-blue-600 hover:underline text-sm"
      >
        Подробнее
      </NuxtLink>
      <button
        @click="handleAddToCart"
        class="bg-green-500 hover:bg-green-600 text-white text-sm py-1 px-3 rounded transition-colors duration-200"
      >
        В корзину
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from "~/types/product";
import { useCart } from "~/composables/useCart";

const props = defineProps<{
  product: Product;
}>();

const { addToCart } = useCart();

const handleAddToCart = () => {
  addToCart(props.product, 1);
  // Можно добавить уведомление
  alert(`${props.product.name} добавлен в корзину!`);
};

// Вспомогательная функция для форматирования цены
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0,
  }).format(price);
};
</script>
