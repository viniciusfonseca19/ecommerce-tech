const API_BASE = ''; // será preenchido depois

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  };
  const response = await fetch(url, config);
  if (response.status === 204) return null;
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || `Erro ${response.status}`);
  return data;
}

export const ProductAPI = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(qs ? `/products?${qs}` : '/products');
  },
  getById: (id) => request(`/products/${id}`),
  create: (data) => request('/products', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/products/${id}`, { method: 'DELETE' }),
};

export const OrderAPI = {
  create: (data) => request('/orders', { method: 'POST', body: JSON.stringify(data) }),
  getAll: () => request('/orders'),
  getById: (id) => request(`/orders/${id}`),
};