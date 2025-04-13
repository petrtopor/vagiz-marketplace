<template>
  <div class="bg-gray-100 p-4 rounded-lg mb-6 shadow">
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      <div>
        <label
          for="sortKey"
          class="block text-sm font-medium text-gray-700 mb-1"
          >Сортировать по:</label
        >
        <select
          id="sortKey"
          :value="modelValue.sort.key"
          @change="
            updateSortKey(
              ($event.target as HTMLSelectElement).value as keyof Product
            )
          "
          class="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
        >
          <option value="name">Названию</option>
          <option value="price">Цене</option>
          <option value="rating">Рейтингу</option>
          <option value="category">Категории</option>
          <option value="brand">Бренду</option>
        </select>
      </div>
      <div>
        <label
          for="sortOrder"
          class="block text-sm font-medium text-gray-700 mb-1"
          >Порядок:</label
        >
        <select
          id="sortOrder"
          :value="modelValue.sort.order"
          @change="
            updateSortOrder(
              ($event.target as HTMLSelectElement).value as 'asc' | 'desc'
            )
          "
          class="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
        >
          <option value="asc">Возрастанию</option>
          <option value="desc">Убыванию</option>
        </select>
      </div>

      <div>
        <label
          for="filterCategory"
          class="block text-sm font-medium text-gray-700 mb-1"
          >Категория:</label
        >
        <select
          id="filterCategory"
          :value="modelValue.filters.selected.category || ''"
          @change="
            updateFilter('category', ($event.target as HTMLSelectElement).value)
          "
          class="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
        >
          <option value="">Все категории</option>
          <option
            v-for="cat in availableFilters.categories"
            :key="cat"
            :value="cat"
          >
            {{ cat }}
          </option>
        </select>
      </div>
      <div>
        <label
          for="filterBrand"
          class="block text-sm font-medium text-gray-700 mb-1"
          >Бренд:</label
        >
        <select
          id="filterBrand"
          :value="modelValue.filters.selected.brand || ''"
          @change="
            updateFilter('brand', ($event.target as HTMLSelectElement).value)
          "
          class="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
        >
          <option value="">Все бренды</option>
          <option
            v-for="brand in availableFilters.brands"
            :key="brand"
            :value="brand"
          >
            {{ brand }}
          </option>
        </select>
      </div>
      <div>
        <label
          for="filterMinRating"
          class="block text-sm font-medium text-gray-700 mb-1"
          >Мин. рейтинг:</label
        >
        <select
          id="filterMinRating"
          :value="modelValue.filters.selected.minRating || 0"
          @change="
            updateFilter(
              'minRating',
              ($event.target as HTMLSelectElement).value
            )
          "
          class="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
        >
          <option value="0">Любой</option>
          <option value="4">4+</option>
          <option value="4.5">4.5+</option>
          <option value="4.8">4.8+</option>
        </select>
      </div>

      <div class="flex items-end">
        <button
          @click="resetFilters"
          class="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md text-sm transition-colors duration-200"
        >
          Сбросить все
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from "~/types/product";

// Определяем тип для v-model
interface ControlState {
  sort: {
    key: keyof Product;
    order: "asc" | "desc";
  };
  filters: {
    selected: {
      category?: string;
      brand?: string;
      minRating?: number;
    };
  };
}
// Определяем тип для доступных фильтров
interface AvailableFilters {
  categories: (string | number)[];
  brands: (string | number)[];
}

// Props: modelValue для v-model и availableFilters для списков
const props = defineProps<{
  modelValue: ControlState;
  availableFilters: AvailableFilters;
}>();

// Эмиттер для обновления v-model
const emit = defineEmits(["update:modelValue"]);

// Функции для обновления состояния
const updateSortKey = (key: keyof Product) => {
  emit("update:modelValue", {
    ...props.modelValue,
    sort: { ...props.modelValue.sort, key: key },
  });
};

const updateSortOrder = (order: "asc" | "desc") => {
  emit("update:modelValue", {
    ...props.modelValue,
    sort: { ...props.modelValue.sort, order: order },
  });
};

const updateFilter = (
  key: "category" | "brand" | "minRating",
  value: string
) => {
  // Преобразуем значение к нужному типу
  let processedValue: string | number | undefined =
    value === "" ? undefined : value;
  if (key === "minRating") {
    processedValue = value === "" ? undefined : parseFloat(value);
  }

  emit("update:modelValue", {
    ...props.modelValue,
    filters: {
      ...props.modelValue.filters,
      selected: {
        ...props.modelValue.filters.selected,
        [key]: processedValue,
      },
    },
  });
};

const resetFilters = () => {
  emit("update:modelValue", {
    ...props.modelValue,
    filters: {
      ...props.modelValue.filters,
      selected: {
        category: undefined,
        brand: undefined,
        minRating: undefined,
      },
    },
    // Можно сбросить и сортировку по желанию
    // sort: { key: 'name', order: 'asc' }
  });
};
</script>
