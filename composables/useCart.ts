import { ref, computed } from "vue";
import { useRuntimeConfig } from "#app";
import { useAuth } from "./useAuth";
import type { CartItem } from "~/types/cart";

export const useCart = () => {
  const config = useRuntimeConfig();
  const { isAuthenticated, user } = useAuth();
  const cart = ref<CartItem[]>([]);

  const fetchCart = async () => {
    if (!isAuthenticated.value) {
      cart.value = [];
      return;
    }
    try {
      cart.value = await $fetch(`${config.public.apiBase}/cart`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
    } catch (error) {
      cart.value = [];
    }
  };

  const addToCart = async (product: any, quantity: number = 1) => {
    if (!isAuthenticated.value) {
      alert("Please login to add items to cart");
      return;
    }
    try {
      await $fetch(`${config.public.apiBase}/cart`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: { productId: product.id, quantity },
      });
      await fetchCart();
    } catch (error) {
      alert("Failed to add to cart");
    }
  };

  const removeFromCart = async (id: string) => {
    try {
      await $fetch(`${config.public.apiBase}/cart/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      await fetchCart();
    } catch (error) {
      alert("Failed to remove from cart");
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    try {
      await $fetch(`${config.public.apiBase}/cart/${id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: { quantity },
      });
      await fetchCart();
    } catch (error) {
      alert("Failed to update quantity");
    }
  };

  const clearCart = async () => {
    try {
      await $fetch(`${config.public.apiBase}/cart`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      cart.value = [];
    } catch (error) {
      alert("Failed to clear cart");
    }
  };

  const cartTotal = computed(() => {
    return cart.value.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  });

  const cartItemCount = computed(() => {
    return cart.value.reduce((count, item) => count + item.quantity, 0);
  });

  // Fetch cart on initialization
  fetchCart();

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartItemCount,
    fetchCart,
  };
};
