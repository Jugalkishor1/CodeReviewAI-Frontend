import { useAppStore } from '../store/useAppStore'

export function useAuth() {
  const { state, login, logout, clearError } = useAppStore()

  return {
    token: state.token,
    user: state.user,
    loading: state.loading,
    error: state.error,
    login,
    logout,
    clearError,
  }
}
