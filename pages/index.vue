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
import { ref, watch, computed } from "vue";
import { useAsyncData, useRuntimeConfig } from "#app";
import type { Product } from "~/types/product";
import ProductCard from "~/components/ProductCard.vue";
import Pagination from "~/components/Pagination.vue";
import SortFilterControls from "~/components/SortFilterControls.vue";

const config = useRuntimeConfig();

const controlsState = ref({
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

const currentPage = ref(1);
const itemsPerPage = ref(12);

const queryParams = computed(() => {
  const params: Record<string, string | number> = {
    page: currentPage.value,
    limit: itemsPerPage.value,
    sortKey: controlsState.value.sort.key,
    sortOrder: controlsState.value.sort.order,
  };
  if (controlsState.value.filters.selected.category) {
    params.category = controlsState.value.filters.selected.category;
  }
  if (controlsState.value.filters.selected.brand) {
    params.brand = controlsState.value.filters.selected.brand;
  }
  if (controlsState.value.filters.selected.minRating) {
    params.minRating = controlsState.value.filters.selected.minRating;
  }
  return params;
});

const { data, pending, error, refresh } = await useAsyncData(
  "products-list",
  () =>
    $fetch(`${config.public.apiBase}/products`, {
      params: queryParams.value,
    }),
  {
    watch: [queryParams],
  }
);

if (data.value?.sort) {
  controlsState.value.sort.key = data.value.sort.key;
  controlsState.value.sort.order = data.value.sort.order;
}
if (data.value?.filters?.selected) {
  controlsState.value.filters.selected.category =
    data.value.filters.selected.category;
  controlsState.value.filters.selected.brand =
    data.value.filters.selected.brand;
  controlsState.value.filters.selected.minRating =
    data.value.filters.selected.minRating;
}
if (data.value?.pagination?.currentPage) {
  currentPage.value = data.value.pagination.currentPage;
}

const handlePageChange = (newPage: number) => {
  currentPage.value = newPage;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const refreshData = async () => {
  await refresh();
};

watch(
  controlsState,
  () => {
    if (currentPage.value !== 1) {
      currentPage.value = 1;
    }
  },
  { deep: true }
);

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
