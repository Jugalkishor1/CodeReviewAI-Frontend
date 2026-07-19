import { useEffect } from 'react'
import { useStore } from '../store'
import { Sidebar } from '../components/Sidebar'
import { Topbar } from '../components/Topbar'
import { PullRequestList } from '../components/PullRequestList'
import { PullRequestDetail } from '../components/PullRequestDetail'
import { ReviewHistory } from '../components/ReviewHistory'

export function DashboardPage() {
  const store = useStore()
  const search = useStore((s) => s.search)

  useEffect(() => {
    useStore.getState().loadUser()
    useStore.getState().loadReviews()
  }, [])

  useEffect(() => {
    const timeout = window.setTimeout(() => useStore.getState().loadRepos(search), 250)
    return () => window.clearTimeout(timeout)
  }, [search])

  return (
    <main className="app-shell">
      <Sidebar
        repositories={store.repositories}
        selectedRepository={store.selectedRepository}
        search={store.search}
        loading={store.loading.repos}
        onSearchChange={store.setSearch}
        onSelectRepository={store.selectRepo}
      />

      <section className="workspace">
        <Topbar
          user={store.user}
          theme={store.theme}
          onToggleTheme={store.toggleTheme}
          onLogout={store.logout}
        />

        {store.error && (
          <div className="alert">
            <span>{store.error}</span>
            <button type="button" onClick={store.clearError}>Dismiss</button>
          </div>
        )}

        <div className="content-grid">
          <PullRequestList
            repository={store.selectedRepository}
            pullRequests={store.pullRequests}
            selectedPullRequest={store.selectedPullRequest}
            loading={store.loading.prs}
            onSelect={store.selectPr}
          />
          <PullRequestDetail
            pullRequest={store.selectedPullRequest}
            review={store.activeReview}
            loading={store.loading.pr}
            reviewing={store.loading.review}
            onRunReview={store.runReview}
          />
        </div>

        <ReviewHistory
          reviews={store.reviews}
          loading={store.loading.reviews || store.loading.history || store.loading.delete}
          onSelect={store.openHistory}
          onDelete={store.deleteReview}
        />
      </section>
    </main>
  )
}
