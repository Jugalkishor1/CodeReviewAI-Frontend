import { useCallback } from 'react'
import { useAppStore } from '../store/useAppStore'

export function useTheme() {
  const { state, dispatch } = useAppStore()

  const toggleTheme = useCallback(() => {
    dispatch({
      type: 'SET_THEME',
      theme: state.theme === 'dark' ? 'light' : 'dark',
    })
  }, [dispatch, state.theme])

  return {
    theme: state.theme,
    toggleTheme,
  }
}
