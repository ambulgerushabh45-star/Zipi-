const API_BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');

async function requestJson(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });
  } catch {
    throw new Error('Unable to reach the mission control server. Please verify the backend is running.');
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const err = new Error(data?.error || `Request failed with status ${response.status}.`);
    err.status = response.status;
    err.fields = data?.fields || null;
    throw err;
  }

  return data;
}

export function submitInquiry(payload) {
  return requestJson('/api/inquiries', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function fetchAdminInquiries(adminKey, params = {}) {
  const query = new URLSearchParams();
  if (params.status && params.status !== 'all') query.set('status', params.status);
  if (params.type && params.type !== 'all') query.set('type', params.type);
  if (params.q && params.q.trim()) query.set('q', params.q.trim());
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));

  const qs = query.toString();
  return requestJson(`/api/admin/inquiries${qs ? `?${qs}` : ''}`, {
    method: 'GET',
    headers: {
      'x-admin-key': adminKey,
    },
  });
}

export function updateAdminInquiry(adminKey, ref, body) {
  return requestJson(`/api/admin/inquiries/${encodeURIComponent(ref)}`, {
    method: 'PATCH',
    headers: {
      'x-admin-key': adminKey,
    },
    body: JSON.stringify(body),
  });
}

export function submitOrder(payload) {
  return requestJson('/api/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function fetchAdminOrders(adminKey, params = {}) {
  const query = new URLSearchParams();
  if (params.status && params.status !== 'all') query.set('status', params.status);
  if (params.q && params.q.trim()) query.set('q', params.q.trim());
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));

  const qs = query.toString();
  return requestJson(`/api/admin/orders${qs ? `?${qs}` : ''}`, {
    method: 'GET',
    headers: {
      'x-admin-key': adminKey,
    },
  });
}

export function updateAdminOrder(adminKey, ref, body) {
  return requestJson(`/api/admin/orders/${encodeURIComponent(ref)}`, {
    method: 'PATCH',
    headers: {
      'x-admin-key': adminKey,
    },
    body: JSON.stringify(body),
  });
}


