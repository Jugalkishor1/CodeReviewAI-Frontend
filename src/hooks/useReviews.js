import { useCallback, useEffect } from 'react'
import { useAppStore } from '../store/useAppStore'

export function useReviews() {
  const { state, dispatch, client, handleError, setLoading } = useAppStore()

  const loadReviews = useCallback(async () => {
    setLoading('reviews', true)
    try {
      dispatch({ type: 'SET_REVIEWS', reviews: await client.reviews() })
    } catch (error) {
      handleError(error)
    } finally {
      setLoading('reviews', false)
    }
  }, [client, dispatch, handleError, setLoading])

  const openReviewFromHistory = useCallback(async (reviewSummary) => {
    setLoading('history', true)
    try {
      const review = await client.review(reviewSummary.id)
      const pullRequest = await client.pullRequest(review.pull_request_id)
      const repository = state.repositories.find((item) => item.id === review.repository_id)
        || {
          id: review.repository_id,
          full_name: review.repository_full_name,
        }

      dispatch({ type: 'SET_SELECTED_REPOSITORY', repository })
      dispatch({ type: 'SET_PULL_REQUESTS', pullRequests: await client.pullRequests(repository.id) })
      dispatch({ type: 'SET_SELECTED_PULL_REQUEST', pullRequest })
      dispatch({ type: 'SET_ACTIVE_REVIEW', review })
    } catch (error) {
      handleError(error)
    } finally {
      setLoading('history', false)
    }
  }, [client, dispatch, handleError, setLoading, state.repositories])

  useEffect(() => {
    if (!state.token) return
    loadReviews()
  }, [state.token, loadReviews])

  return {
    reviews: state.reviews,
    loading: state.loading.reviews || state.loading.history,
    loadReviews,
    openReviewFromHistory,
  }
}
