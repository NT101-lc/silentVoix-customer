const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

function toApiUrl(path) {
  if (!API_BASE_URL) {
    return path;
  }
  return `${API_BASE_URL}${path}`;
}

async function request(path, options = {}) {
  const response = await fetch(toApiUrl(path), {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

export function signupRequest(payload) {
  return request('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function loginRequest(payload) {
  return request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}
