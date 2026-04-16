import { ref, onUnmounted } from 'vue';

export function useAbort() {
  const abortController = ref<AbortController | null>(null);
  const isAborted = ref(false);

  function createAbortController() {
    if (abortController.value) {
      abortController.value.abort();
    }
    abortController.value = new AbortController();
    isAborted.value = false;
    return abortController.value;
  }

  function abort(reason = 'Operation aborted') {
    if (abortController.value && !isAborted.value) {
      abortController.value.abort(reason);
      isAborted.value = true;
    }
  }

  function reset() {
    abortController.value = null;
    isAborted.value = false;
  }

  function getSignal(): AbortSignal | undefined {
    return abortController.value?.signal;
  }

  onUnmounted(() => {
    abort();
  });

  return {
    abortController,
    isAborted,
    createAbortController,
    abort,
    reset,
    getSignal,
  };
}

export default useAbort;