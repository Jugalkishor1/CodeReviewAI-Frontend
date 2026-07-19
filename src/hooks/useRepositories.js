import { useCallback, useEffect } from 'react'
import { useAppStore } from '../store/useAppStore'

export function useRepositories() {
  const { state, dispatch, client, handleError, setLoading } = useAppStore()

  const loadRepositories = useCallback(async (query = '') => {
    setLoading('repositories', true)
    try {
      dispatch({ type: 'SET_REPOSITORIES', repositories: await client.repositories(query) })
    } catch (error) {
      handleError(error)
    } finally {
      setLoading('repositories', false)
    }
  }, [client, dispatch, handleError, setLoading])

  const selectRepository = useCallback(async (repository) => {
    dispatch({ type: 'SET_SELECTED_REPOSITORY', repository })
    dispatch({ type: 'SET_SELECTED_PULL_REQUEST', pullRequest: null })
    dispatch({ type: 'SET_ACTIVE_REVIEW', review: null })
    setLoading('pullRequests', true)
    try {
      dispatch({ type: 'SET_PULL_REQUESTS', pullRequests: await client.pullRequests(repository.id) })
    } catch (error) {
      handleError(error)
    } finally {
      setLoading('pullRequests', false)
    }
  }, [client, dispatch, handleError, setLoading])

  useEffect(() => {
    if (!state.token) return
    const timeout = window.setTimeout(() => loadRepositories(state.search), 250)
    return () => window.clearTimeout(timeout)
  }, [state.search, state.token, loadRepositories])

  return {
    repositories: state.repositories,
    selectedRepository: state.selectedRepository,
    search: state.search,
    loading: state.loading.repositories,
    setSearch: (search) => dispatch({ type: 'SET_SEARCH', search }),
    selectRepository,
  }
}
