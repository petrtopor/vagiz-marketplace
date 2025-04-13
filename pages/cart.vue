<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">Корзина</h1>

    <div
      v-if="cart.length === 0"
      class="text-center py-10 bg-gray-100 rounded-lg"
    >
      <p class="text-lg text-gray-500 mb-4">Ваша корзина пуста.</p>
      <NuxtLink
        to="/"
        class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition-colors duration-200"
      >
        Перейти в каталог
      </NuxtLink>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-4">
        <div
          v-for="item in cart"
          :key="item.id"
          class="flex items-center justify-between border p-4 rounded-lg shadow-sm bg-white"
        >
          <div class="flex items-center space-x-4">
            <img
              :src="item.image"
              :alt="item.name"
              class="w-16 h-16 object-contain rounded border"
            />
            <div>
              <NuxtLink
                :to="`/products/${item.id}`"
                class="text-lg font-semibold hover:underline"
                >{{ item.name }}</NuxtLink
              >
              <p class="text-sm text-gray-500">
                {{ formatPrice(item.price) }} / шт.
              </p>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <div class="flex items-center border rounded">
              <button
                @click="updateQuantity(item.id, item.quantity - 1)"
                class="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded-l"
              >
                -
              </button>
              <input
                type="number"
                :value="item.quantity"
                @input="
                  handleQuantityInput(
                    item.id,
                    ($event.target as HTMLInputElement).value
                  )
                "
                min="1"
                class="w-12 text-center border-l border-r py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                @click="updateQuantity(item.id, item.quantity + 1)"
                class="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded-r"
              >
                +
              </button>
            </div>
            <p class="font-semibold w-24 text-right">
              {{ formatPrice(item.price * item.quantity) }}
            </p>
            <button
              @click="removeFromCart(item.id)"
              title="Удалить из корзины"
              class="text-red-500 hover:text-red-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div class="lg:col-span-1">
        <div class="sticky top-24 bg-white p-6 rounded-lg shadow-md border">
          <h2 class="text-xl font-semibold mb-4">Оформление заказа</h2>

          <div class="mb-4 pb-4 border-b">
            <div class="flex justify-between mb-1">
              <span>Товаров:</span>
              <span>{{ cartItemCount }} шт.</span>
            </div>
            <div class="flex justify-between font-bold text-lg">
              <span>Итого:</span>
              <span>{{ formatPrice(cartTotal) }}</span>
            </div>
          </div>

          <form @submit.prevent="handleCheckout">
            <div class="mb-3">
              <label
                for="name"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Имя:</label
              >
              <input
                type="text"
                id="name"
                v-model="userData.name"
                required
                class="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div class="mb-3">
              <label
                for="email"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Email:</label
              >
              <input
                type="email"
                id="email"
                v-model="userData.email"
                required
                class="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div class="mb-4">
              <label
                for="address"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Адрес доставки:</label
              >
              <textarea
                id="address"
                v-model="userData.address"
                required
                rows="3"
                class="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              ></textarea>
            </div>

            <button
              type="submit"
              :disabled="isCheckingOut"
              class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-wait"
            >
              {{ isCheckingOut ? "Обработка..." : "Оплатить и оформить заказ" }}
            </button>
          </form>

          <div
            v-if="checkoutMessage"
            :class="[
              'mt-4 p-3 rounded text-sm',
              checkoutError
                ? 'bg-red-100 text-red-700'
                : 'bg-green-100 text-green-700',
            ]"
          >
            {{ checkoutMessage }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useCart } from "~/composables/useCart";

const {
  cart,
  cartTotal,
  cartItemCount,
  updateQuantity,
  removeFromCart,
  clearCart,
} = useCart();

const userData = reactive({
  name: "",
  email: "",
  address: "",
});

const isCheckingOut = ref(false);
const checkoutMessage = ref<string | null>(null);
const checkoutError = ref(false);

// Обработчик для инпута количества, чтобы обновлять при потере фокуса или Enter
// или можно обновлять при каждом изменении (@input), но может быть менее производительно
const handleQuantityInput = (productId: string, value: string) => {
  const quantity = parseInt(value, 10);
  if (!isNaN(quantity) && quantity >= 0) {
    // Обновляем только если значение валидно
    // Если 0, то товар удалится внутри updateQuantity
    updateQuantity(productId, quantity);
  } else {
    // Если ввели не число, можно сбросить к текущему значению или 1
    const currentItem = cart.value.find((item) => item.id === productId);
    if (currentItem) {
      // Восстанавливаем значение в инпуте (требует v-model или доп. логики)
      // Проще пока просто игнорировать некорректный ввод или удалять при 0
      if (quantity === 0) updateQuantity(productId, 0);
    }
  }
};

const handleCheckout = async () => {
  isCheckingOut.value = true;
  checkoutMessage.value = null;
  checkoutError.value = false;

  try {
    const response = await $fetch("/api/cart/checkout", {
      method: "POST",
      body: {
        cartItems: cart.value,
        userData: userData,
        totalAmount: cartTotal.value,
      },
    });

    // @ts-ignore // Предполагаем, что ответ соответствует ожиданиям
    checkoutMessage.value = `${response.message} ID Заказа: ${response.orderId}`;
    clearCart(); // Очищаем корзину после успешного заказа
    // Сбрасываем форму
    userData.name = "";
    userData.email = "";
    userData.address = "";
  } catch (err: any) {
    checkoutError.value = true;
    checkoutMessage.value = `Ошибка оформления заказа: ${
      err.data?.message || err.message || "Неизвестная ошибка"
    }`;
    console.error("Checkout failed:", err);
  } finally {
    isCheckingOut.value = false;
  }
};

// Вспомогательная функция для форматирования цены
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0,
  }).format(price);
};

// Установка заголовка страницы
useHead({
  title: "Корзина - Vagiz Marketplace",
  meta: [
    {
      name: "description",
      content: "Просмотрите свою корзину и оформите заказ.",
    },
  ],
});
</script>
