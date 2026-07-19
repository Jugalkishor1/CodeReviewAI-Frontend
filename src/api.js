export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

export async function api(path, { token, method = 'GET', body } = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (response.status === 204) {
    if (!response.ok) throw new ApiError('Request failed', response.status)
    return null
  }

  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new ApiError(payload.error || 'Request failed', response.status)
  return payload
}
