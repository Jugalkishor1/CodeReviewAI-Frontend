import { Alert } from '../components/Alert'
import { PullRequestDetail } from '../components/PullRequestDetail'
import { PullRequestList } from '../components/PullRequestList'
import { ReviewHistory } from '../components/ReviewHistory'
import { Sidebar } from '../components/Sidebar'
import { Topbar } from '../components/Topbar'
import { useAuth } from '../hooks/useAuth'
import { usePullRequests } from '../hooks/usePullRequests'
import { useRepositories } from '../hooks/useRepositories'
import { useReviews } from '../hooks/useReviews'
import { useTheme } from '../hooks/useTheme'

export function DashboardPage() {
  const { user, error, logout, clearError } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const {
    repositories,
    selectedRepository,
    search,
    loading: reposLoading,
    setSearch,
    selectRepository,
  } = useRepositories()
  const {
    pullRequests,
    selectedPullRequest,
    activeReview,
    loading,
    selectPullRequest,
    runReview,
  } = usePullRequests()
  const { reviews, loading: reviewsLoading, loadReviews, openReviewFromHistory } = useReviews()

  async function handleRunReview() {
    const review = await runReview()
    if (review) loadReviews()
  }

  return (
    <main className="app-shell">
      <Sidebar
        repositories={repositories}
        selectedRepository={selectedRepository}
        search={search}
        loading={reposLoading}
        onSearchChange={setSearch}
        onSelectRepository={selectRepository}
      />

      <section className="workspace">
        <Topbar
          user={user}
          theme={theme}
          onToggleTheme={toggleTheme}
          onLogout={logout}
        />

        <Alert message={error} onDismiss={clearError} />

        <div className="content-grid">
          <PullRequestList
            repository={selectedRepository}
            pullRequests={pullRequests}
            selectedPullRequest={selectedPullRequest}
            loading={loading.pullRequests}
            onSelect={selectPullRequest}
          />
          <PullRequestDetail
            pullRequest={selectedPullRequest}
            review={activeReview}
            loading={loading.pullRequest}
            reviewing={loading.review}
            onRunReview={handleRunReview}
          />
        </div>

        <ReviewHistory
          reviews={reviews}
          loading={reviewsLoading}
          onSelect={openReviewFromHistory}
        />
      </section>
    </main>
  )
}
