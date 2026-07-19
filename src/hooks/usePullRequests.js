import { useCallback } from 'react'
import { useAppStore } from '../store/useAppStore'

export function usePullRequests() {
  const { state, dispatch, client, handleError, setLoading } = useAppStore()

  const selectPullRequest = useCallback(async (pullRequest) => {
    setLoading('pullRequest', true)
    try {
      const details = await client.pullRequest(pullRequest.id)
      dispatch({ type: 'SET_SELECTED_PULL_REQUEST', pullRequest: details })
      dispatch({ type: 'SET_ACTIVE_REVIEW', review: details.reviews?.[0] || null })
    } catch (error) {
      handleError(error)
    } finally {
      setLoading('pullRequest', false)
    }
  }, [client, dispatch, handleError, setLoading])

  const runReview = useCallback(async () => {
    if (!state.selectedPullRequest) return null
    setLoading('review', true)
    dispatch({ type: 'SET_ERROR', error: '' })
    try {
      const review = await client.createReview(state.selectedPullRequest.id)
      dispatch({ type: 'SET_ACTIVE_REVIEW', review })
      dispatch({
        type: 'SET_SELECTED_PULL_REQUEST',
        pullRequest: {
          ...state.selectedPullRequest,
          reviews: [review, ...(state.selectedPullRequest.reviews || [])],
        },
      })
      return review
    } catch (error) {
      handleError(error)
      return null
    } finally {
      setLoading('review', false)
    }
  }, [client, dispatch, handleError, setLoading, state.selectedPullRequest])

  return {
    pullRequests: state.pullRequests,
    selectedPullRequest: state.selectedPullRequest,
    activeReview: state.activeReview,
    loading: state.loading,
    selectPullRequest,
    runReview,
  }
}
