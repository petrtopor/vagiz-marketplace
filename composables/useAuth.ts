import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useRuntimeConfig } from "#app";

export const useAuth = () => {
  const config = useRuntimeConfig();
  const user = ref<any>(null);
  const isAuthenticated = computed(() => !!user.value);
  const router = useRouter();

  const login = async (email: string, password: string) => {
    try {
      const response = await $fetch(`${config.public.apiBase}/auth/login`, {
        method: "POST",
        body: { email, password },
      });
      localStorage.setItem("token", response.access_token);
      await fetchUser();
    } catch (error) {
      throw new Error("Invalid credentials");
    }
  };

  const register = async (
    email: string,
    password: string,
    roles: string[] = ["buyer"]
  ) => {
    try {
      await $fetch(`${config.public.apiBase}/auth/register`, {
        method: "POST",
        body: { email, password, roles },
      });
    } catch (error) {
      throw new Error("Registration failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    user.value = null;
    router.push("/login");
  };

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        user.value = await $fetch(`${config.public.apiBase}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (error) {
        localStorage.removeItem("token");
        user.value = null;
      }
    }
  };

  // Fetch user on initialization
  fetchUser();

  return { user, isAuthenticated, login, register, logout, fetchUser };
};
