import { defineEventHandler, createError } from "h3";
import { mockProducts } from "~/server/utils/mockData";

export default defineEventHandler((event) => {
  // Получаем 'id' из параметров маршрута
  // Nuxt 3 / Nitro автоматически разбирает параметры вроде /api/products/123
  // и делает их доступными через event.context.params
  const productId = event.context.params?.id as string;

  if (!productId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Product ID is required",
    });
  }

  const product = mockProducts.find((p) => p.id === productId);

  if (!product) {
    throw createError({
      statusCode: 404,
      statusMessage: "Product not found",
    });
  }

  return product;
});
