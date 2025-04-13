import { defineEventHandler, readBody } from "h3";
import type { CartItem } from "~/types/cart";

interface CheckoutPayload {
  cartItems: CartItem[];
  userData: {
    name: string;
    email: string;
    address: string;
  };
  totalAmount: number;
}

export default defineEventHandler(async (event) => {
  // Получаем тело POST-запроса
  const body = await readBody<CheckoutPayload>(event);

  // Валидация (очень базовая)
  if (
    !body.cartItems ||
    body.cartItems.length === 0 ||
    !body.userData ||
    !body.totalAmount
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid checkout data",
    });
  }

  // Имитация обработки заказа (например, логирование)
  console.log("--- New Order Received ---");
  console.log("User Data:", body.userData);
  console.log(
    "Cart Items:",
    body.cartItems
      .map(
        (item) =>
          `<span class="math-inline">\{item\.name\} \(x</span>{item.quantity})`
      )
      .join(", ")
  );
  console.log("Total Amount:", body.totalAmount);
  console.log("--- End Order ---");

  // Имитация задержки сети/обработки
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // В реальном приложении здесь была бы логика сохранения заказа в БД,
  // вызов платежной системы и т.д.

  // Возвращаем успешный ответ
  return {
    success: true,
    message: "Ваш заказ успешно оформлен!",
    orderId: `MOCK-${Date.now()}`, // Генерируем моковый ID заказа
  };
});
