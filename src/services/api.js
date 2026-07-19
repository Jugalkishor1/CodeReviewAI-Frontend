export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

export function api(baseUrl, token) {
  async function request(path, options = {}) {
    const response = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
    })

    const payload = await response.json().catch(() => ({}))
    if (!response.ok) {
      throw new ApiError(payload.error || 'Request failed', response.status)
    }
    return payload
  }

  return {
    authWithGithub: (code) => request('/auth/github', {
      method: 'POST',
      body: JSON.stringify({ code }),
    }),
    me: () => request('/me'),
    repositories: (search = '') => request(`/repositories?search=${encodeURIComponent(search)}`),
    pullRequests: (repositoryId) => request(`/repositories/${repositoryId}/pull_requests`),
    pullRequest: (pullRequestId) => request(`/pull_requests/${pullRequestId}`),
    createReview: (pullRequestId) => request(`/pull_requests/${pullRequestId}/review`, { method: 'POST' }),
    reviews: () => request('/reviews'),
    review: (reviewId) => request(`/reviews/${reviewId}`),
  }
}
