<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">Каталог товаров</h1>

    <SortFilterControls
      v-if="data && data.filters.available"
      :available-filters="data.filters.available"
      v-model="controlsState"
    />

    <div v-if="pending" class="text-center py-10">
      <p class="text-lg text-gray-500">Загрузка товаров...</p>
    </div>

    <div
      v-else-if="error"
      class="text-center py-10 bg-red-100 text-red-700 p-4 rounded"
    >
      <p class="font-semibold">Ошибка при загрузке товаров:</p>
      <p>{{ error.message }}</p>
      <button
        @click="refreshData"
        class="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
      >
        Попробовать снова
      </button>
    </div>

    <div
      v-else-if="data && data.products.length > 0"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      <ProductCard
        v-for="product in data.products"
        :key="product.id"
        :product="product"
      />
    </div>

    <div v-else class="text-center py-10">
      <p class="text-lg text-gray-500">
        Товары не найдены. Попробуйте изменить фильтры.
      </p>
    </div>

    <Pagination
      v-if="data && data.pagination.totalPages > 1"
      :current-page="data.pagination.currentPage"
      :total-pages="data.pagination.totalPages"
      @page-change="handlePageChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import { useFetch, useAsyncData } from "#app";
import type { Product } from "~/types/product";
import ProductCard from "~/components/ProductCard.vue";
import Pagination from "~/components/Pagination.vue";
import SortFilterControls from "~/components/SortFilterControls.vue";

// Состояние для контролов (v-model в SortFilterControls)
// Значения по умолчанию должны совпадать с серверными
const controlsState = reactive({
  sort: {
    key: "name" as keyof Product,
    order: "asc" as "asc" | "desc",
  },
  filters: {
    selected: {
      category: undefined as string | undefined,
      brand: undefined as string | undefined,
      minRating: undefined as number | undefined,
    },
  },
});

// Состояние для пагинации
const currentPage = ref(1);
const itemsPerPage = ref(12); // Количество товаров на странице

// Формируем параметры запроса на основе состояния
const queryParams = computed(() => {
  const params: Record<string, string | number> = {
    page: currentPage.value,
    limit: itemsPerPage.value,
    sortKey: controlsState.sort.key,
    sortOrder: controlsState.sort.order,
  };
  if (controlsState.filters.selected.category) {
    params.category = controlsState.filters.selected.category;
  }
  if (controlsState.filters.selected.brand) {
    params.brand = controlsState.filters.selected.brand;
  }
  if (controlsState.filters.selected.minRating) {
    params.minRating = controlsState.filters.selected.minRating;
  }
  return params;
});

// Запрос данных с использованием useAsyncData для SSR
// Ключ 'products-list' важен для кеширования и гидратации
// watch позволяет автоматически перезапрашивать данные при изменении queryParams
const { data, pending, error, refresh } = await useAsyncData(
  "products-list",
  () =>
    $fetch("/api/products", {
      params: queryParams.value, // Передаем параметры
      // query: queryParams.value // Альтернативный синтаксис
    }),
  {
    watch: [queryParams], // Следим за изменениями параметров
    // initialCache: false, // Если нужно всегда свежие данные при навигации
    // server: true, // По умолчанию true, для SSR
  }
);

// Обновляем состояние контролов, если оно пришло с сервера (на случай прямой ссылки с параметрами)
// Это нужно, чтобы UI соответствовал данным
if (data.value?.sort) {
  controlsState.sort.key = data.value.sort.key;
  controlsState.sort.order = data.value.sort.order;
}
if (data.value?.filters?.selected) {
  controlsState.filters.selected.category =
    data.value.filters.selected.category;
  controlsState.filters.selected.brand = data.value.filters.selected.brand;
  controlsState.filters.selected.minRating =
    data.value.filters.selected.minRating;
}
if (data.value?.pagination?.currentPage) {
  currentPage.value = data.value.pagination.currentPage;
}

// Обработчик смены страницы
const handlePageChange = (newPage: number) => {
  currentPage.value = newPage;
  // useAsyncData с watch сам перезапросит данные
  // Прокрутка вверх страницы
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// Обработчик для кнопки "Попробовать снова" при ошибке
const refreshData = async () => {
  await refresh();
};

// Сброс на первую страницу при изменении фильтров или сортировки
watch(
  controlsState,
  () => {
    if (currentPage.value !== 1) {
      currentPage.value = 1;
    }
    // useAsyncData с watch сам перезапросит данные
  },
  { deep: true }
); // Глубокое слежение за объектом

// Установка заголовка страницы
useHead({
  title: "Каталог товаров - Vagiz Marketplace",
  meta: [
    {
      name: "description",
      content: "Просмотрите наш каталог товаров с фильтрацией и сортировкой.",
    },
  ],
});
</script>
