import { ref, onUnmounted } from 'vue';

interface PollingOptions {
  interval?: number;
  immediate?: boolean;
  maxAttempts?: number;
}

export function usePolling<T>(
  callback: () => Promise<T>,
  options: PollingOptions = {}
) {
  const { interval = 5000, immediate = false, maxAttempts } = options;

  const data = ref<T | null>(null) as { value: T | null };
  const isPolling = ref(false);
  const error = ref<string | null>(null);
  const attempts = ref(0);

  let timerId: ReturnType<typeof setInterval> | null = null;
  let abortController: AbortController | null = null;

  async function poll() {
    if (abortController) {
      abortController.abort();
    }
    abortController = new AbortController();

    try {
      const result = await callback();
      data.value = result;
      error.value = null;
      attempts.value = 0;
      return result;
    } catch (e) {
      error.value = (e as Error).message;
      attempts.value++;

      if (maxAttempts && attempts.value >= maxAttempts) {
        stop();
        throw new Error(`Max polling attempts (${maxAttempts}) reached`);
      }

      if ((e as Error).name === 'AbortError') {
        return null;
      }
      throw e;
    }
  }

  function start() {
    if (isPolling.value) return;

    isPolling.value = true;
    error.value = null;
    attempts.value = 0;

    if (immediate) {
      poll();
    }

    timerId = setInterval(poll, interval);
  }

  function stop() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
    if (abortController) {
      abortController.abort();
      abortController = null;
    }
    isPolling.value = false;
  }

  function reset() {
    stop();
    data.value = null;
    error.value = null;
    attempts.value = 0;
  }

  onUnmounted(() => {
    stop();
  });

  return {
    data,
    isPolling,
    error,
    attempts,
    start,
    stop,
    reset,
    poll,
  };
}

export default usePolling;