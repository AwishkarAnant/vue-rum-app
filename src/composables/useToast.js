import { useAppStore } from '@/stores/appStore'

export function useToast() {
  const store = useAppStore()

  const toast = {
    success: (title, message) => store.addToast({ type: 'success', title, message }),
    error:   (title, message) => store.addToast({ type: 'error',   title, message }),
    warning: (title, message) => store.addToast({ type: 'warning', title, message }),
    info:    (title, message) => store.addToast({ type: 'info',    title, message }),
  }

  return { toast }
}
