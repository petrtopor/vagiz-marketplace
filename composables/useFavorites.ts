import { ref, computed } from "vue";
import { useRuntimeConfig } from "#app";
import { useAuth } from "./useAuth";

export const useFavorites = () => {
  const config = useRuntimeConfig();
  const { isAuthenticated } = useAuth();
  const favorites = ref<any[]>([]);

  const fetchFavorites = async () => {
    if (!isAuthenticated.value) {
      favorites.value = [];
      return;
    }
    try {
      favorites.value = await $fetch(`${config.public.apiBase}/favorites`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
    } catch (error) {
      favorites.value = [];
    }
  };

  const addToFavorites = async (productId: string) => {
    if (!isAuthenticated.value) {
      alert("Please login to add to favorites");
      return;
    }
    try {
      await $fetch(`${config.public.apiBase}/favorites/${productId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      await fetchFavorites();
    } catch (error) {
      alert("Failed to add to favorites");
    }
  };

  const removeFromFavorites = async (id: string) => {
    try {
      await $fetch(`${config.public.apiBase}/favorites/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      await fetchFavorites();
    } catch (error) {
      alert("Failed to remove from favorites");
    }
  };

  const favoritesCount = computed(() => favorites.value.length);

  // Fetch favorites on initialization
  fetchFavorites();

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    favoritesCount,
    fetchFavorites,
  };
};
