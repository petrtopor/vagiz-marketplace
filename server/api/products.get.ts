import { defineEventHandler, getQuery } from "h3";
import { mockProducts, getUniqueValues } from "~/server/utils/mockData";
import type { Product } from "~/types/product";

export default defineEventHandler((event) => {
  const query = getQuery(event);

  // Параметры пагинации
  const page = parseInt((query.page as string) || "1", 10);
  const limit = parseInt((query.limit as string) || "10", 10);

  // Параметры сортировки
  const sortKey = (query.sortKey as keyof Product | undefined) || "name"; // По умолчанию сортируем по имени
  const sortOrder = (query.sortOrder as "asc" | "desc" | undefined) || "asc"; // По умолчанию по возрастанию

  // Параметры фильтрации (category, brand, minRating)
  const filterCategory = query.category as string | undefined;
  const filterBrand = query.brand as string | undefined;
  const filterMinRating = parseFloat((query.minRating as string) || "0"); // По умолчанию 0

  let filteredProducts = [...mockProducts];

  // Применение фильтров
  if (filterCategory) {
    filteredProducts = filteredProducts.filter(
      (p) => p.category === filterCategory
    );
  }
  if (filterBrand) {
    filteredProducts = filteredProducts.filter((p) => p.brand === filterBrand);
  }
  if (filterMinRating > 0) {
    filteredProducts = filteredProducts.filter(
      (p) => p.rating >= filterMinRating
    );
  }

  // Применение сортировки
  filteredProducts.sort((a, b) => {
    let valA = a[sortKey];
    let valB = b[sortKey];

    // Обработка разных типов данных для сортировки
    if (typeof valA === "string" && typeof valB === "string") {
      valA = valA.toLowerCase();
      valB = valB.toLowerCase();
    }

    let comparison = 0;
    if (valA > valB) {
      comparison = 1;
    } else if (valA < valB) {
      comparison = -1;
    }

    return sortOrder === "desc" ? comparison * -1 : comparison;
  });

  // Общее количество товаров после фильтрации (для пагинации)
  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / limit);

  // Применение пагинации
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // Получение доступных фильтров на основе ВСЕХ продуктов (можно оптимизировать)
  const availableFilters = {
    categories: getUniqueValues(mockProducts, "category"),
    brands: getUniqueValues(mockProducts, "brand"),
    // ratings: [1, 2, 3, 4, 5] // Или динамически, если нужно
  };

  return {
    products: paginatedProducts,
    pagination: {
      currentPage: page,
      totalPages: totalPages,
      totalProducts: totalProducts,
      limit: limit,
    },
    sort: {
      key: sortKey,
      order: sortOrder,
    },
    filters: {
      selected: {
        category: filterCategory,
        brand: filterBrand,
        minRating: filterMinRating,
      },
      available: availableFilters,
    },
  };
});
