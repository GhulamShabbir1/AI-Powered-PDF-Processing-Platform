import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores';
import type { LoginCredentials, RegisterData } from '@/types/auth.types';

export function useAuth() {
  const authStore = useAuthStore();
  const router = useRouter();
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => authStore.isAuthenticated);
  const isLoading = computed(() => authStore.isLoading);
  const user = computed(() => authStore.user);

  async function login(credentials: LoginCredentials) {
    error.value = null;
    try {
      await authStore.login(credentials.email, credentials.password);
      router.push('/dashboard');
    } catch (e) {
      error.value = (e as Error).message;
      throw e;
    }
  }

  async function register(data: RegisterData) {
    error.value = null;
    try {
      await authStore.register(data.name, data.email, data.password);
      router.push('/dashboard');
    } catch (e) {
      error.value = (e as Error).message;
      throw e;
    }
  }

  async function logout() {
    await authStore.logout();
    router.push('/');
  }

  async function checkAuth() {
    if (authStore.token && !authStore.user) {
      await authStore.fetchUser();
    }
  }

  return {
    isAuthenticated,
    isLoading,
    user,
    error,
    login,
    register,
    logout,
    checkAuth,
  };
}

export default useAuth;