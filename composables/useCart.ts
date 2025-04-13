import { useState } from "#app";
import type { Product } from "~/types/product";
import type { CartItem } from "~/types/cart";

// Используем useState для создания реактивного состояния корзины,
// которое будет общим для всего приложения на стороне клиента.
// Ключ 'cartState' гарантирует, что это одно и то же состояние везде.
const useCartState = () => useState<CartItem[]>("cartState", () => []);

export const useCart = () => {
  const cart = useCartState();

  const addToCart = (product: Product, quantity: number = 1) => {
    const existingItem = cart.value.find((item) => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.value.push({ ...product, quantity });
    }
    // console.log('Cart updated:', cart.value); // Для отладки
  };

  const removeFromCart = (productId: string) => {
    cart.value = cart.value.filter((item) => item.id !== productId);
    // console.log('Cart updated:', cart.value); // Для отладки
  };

  const updateQuantity = (productId: string, quantity: number) => {
    const item = cart.value.find((item) => item.id === productId);
    if (item) {
      if (quantity > 0) {
        item.quantity = quantity;
      } else {
        // Если количество <= 0, удаляем товар
        removeFromCart(productId);
      }
    }
    // console.log('Cart updated:', cart.value); // Для отладки
  };

  const clearCart = () => {
    cart.value = [];
    // console.log('Cart cleared'); // Для отладки
  };

  // Вычисляемое свойство для общей стоимости
  const cartTotal = computed(() => {
    return cart.value.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  });

  // Вычисляемое свойство для общего количества товаров
  const cartItemCount = computed(() => {
    return cart.value.reduce((count, item) => count + item.quantity, 0);
  });

  return {
    cart, // Реактивное состояние корзины
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal, // Общая стоимость
    cartItemCount, // Общее количество товаров
  };
};
