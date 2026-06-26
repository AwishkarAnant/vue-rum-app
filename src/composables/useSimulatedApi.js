import { ref } from 'vue'

export function useSimulatedApi() {
  const loading = ref(false)
  const error = ref(null)

  async function simulate(fn, delayMs = 800) {
    loading.value = true
    error.value = null
    try {
      await new Promise(resolve => setTimeout(resolve, delayMs))
      return await fn()
    } catch (e) {
      error.value = e.message || 'Something went wrong'
      throw e
    } finally {
      loading.value = false
    }
  }

  return { loading, error, simulate }
}
