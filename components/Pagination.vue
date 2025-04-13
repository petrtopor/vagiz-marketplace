<template>
  <nav
    v-if="totalPages > 1"
    aria-label="Pagination"
    class="flex justify-center items-center space-x-2 mt-8"
  >
    <button
      @click="changePage(currentPage - 1)"
      :disabled="currentPage === 1"
      class="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
    >
      Назад
    </button>

    <span v-if="showFirstEllipsis" class="px-3 py-1 text-sm">...</span>

    <button
      v-for="page in pagesToShow"
      :key="page"
      @click="changePage(page)"
      :class="[
        'px-3 py-1 border rounded text-sm',
        currentPage === page
          ? 'bg-blue-500 text-white border-blue-500'
          : 'hover:bg-gray-100',
      ]"
    >
      {{ page }}
    </button>

    <span v-if="showLastEllipsis" class="px-3 py-1 text-sm">...</span>

    <button
      @click="changePage(currentPage + 1)"
      :disabled="currentPage === totalPages"
      class="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
    >
      Вперед
    </button>
  </nav>
</template>

<script setup lang="ts">
const props = defineProps<{
  currentPage: number;
  totalPages: number;
  maxVisiblePages?: number; // Макс. кол-во видимых кнопок страниц
}>();

const emit = defineEmits(["page-change"]);

const maxVisible = props.maxVisiblePages || 5; // По умолчанию 5 видимых страниц

const changePage = (page: number) => {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit("page-change", page);
  }
};

// Логика для отображения страниц с многоточиями
const pagesToShow = computed(() => {
  if (props.totalPages <= maxVisible) {
    return Array.from({ length: props.totalPages }, (_, i) => i + 1);
  }

  const halfVisible = Math.floor((maxVisible - 2) / 2); // -2 для первой и последней страницы
  let startPage = Math.max(1, props.currentPage - halfVisible);
  let endPage = Math.min(props.totalPages, props.currentPage + halfVisible);

  // Корректировка, если близко к началу или концу
  if (props.currentPage - halfVisible <= 1) {
    endPage = Math.min(props.totalPages, maxVisible - 1); // Показываем первые страницы
    startPage = 1;
  }
  if (props.currentPage + halfVisible >= props.totalPages) {
    startPage = Math.max(1, props.totalPages - maxVisible + 2); // Показываем последние страницы
    endPage = props.totalPages;
  }

  const pages: number[] = [];
  // Всегда показываем первую страницу
  pages.push(1);

  // Многоточие после первой, если нужно
  if (startPage > 2) {
    // Используем -1 как маркер для многоточия
    // pages.push(-1); // Пока не будем добавлять многоточие как элемент массива
  }

  // Генерируем диапазон страниц
  for (let i = startPage; i <= endPage; i++) {
    if (i > 1 && i < props.totalPages) {
      // Не добавляем первую и последнюю снова
      pages.push(i);
    }
  }

  // Многоточие перед последней, если нужно
  if (endPage < props.totalPages - 1) {
    // pages.push(-1);
  }

  // Всегда показываем последнюю страницу
  pages.push(props.totalPages);

  // Убираем дубликаты, если они вдруг появились
  return [...new Set(pages)].sort((a, b) => a - b);
});

// Показать многоточие после 1?
const showFirstEllipsis = computed(() => {
  if (props.totalPages <= maxVisible) return false;
  const firstVisiblePageInRange = pagesToShow.value[1]; // Вторая страница в массиве
  return firstVisiblePageInRange > 2; // Если вторая видимая не 2, значит было ...
});

// Показать многоточие перед последней страницей?
const showLastEllipsis = computed(() => {
  if (props.totalPages <= maxVisible) return false;
  const lastVisiblePageInRange =
    pagesToShow.value[pagesToShow.value.length - 2]; // Предпоследняя
  return lastVisiblePageInRange < props.totalPages - 1; // Если предпоследняя не N-1, значит было ...
});
</script>
