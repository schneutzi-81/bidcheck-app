const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

async function request(method, path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: body && !(body instanceof FormData) ? { 'Content-Type': 'application/json' } : {},
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

const get  = (path)        => request('GET',    path);
const post = (path, body)  => request('POST',   path, body);
const del  = (path)        => request('DELETE', path);

export const api = {
  // Customers
  createCustomer: (name)                         => post('/customers', { name }),
  listCustomers:  ()                             => get('/customers'),
  getCustomer:    (id)                           => get(`/customers/${id}`),

  // Projects
  createProject: (customerId, name, language)    => post(`/customers/${customerId}/projects`, { name, language }),
  getProject:    (id)                            => get(`/projects/${id}`),
  deleteProject: (id)                            => del(`/projects/${id}`),

  // Documents
  uploadDocument: (projectId, file) => {
    const form = new FormData();
    form.append('file', file);
    return post(`/projects/${projectId}/documents`, form);
  },
  listDocuments:   (projectId)             => get(`/projects/${projectId}/documents`),
  deleteDocument:  (projectId, docId)      => del(`/projects/${projectId}/documents/${docId}`),

  // Chat
  askQuestion: (projectId, question)       => post(`/projects/${projectId}/chat`, { question }),

  // Analysis
  getGaps:    (projectId)                  => post(`/projects/${projectId}/gaps`,    {}),
  getRisks:   (projectId)                  => post(`/projects/${projectId}/risks`,   {}),
  getSow:     (projectId)                  => post(`/projects/${projectId}/sow`,     {}),
  getSummary: (projectId)                  => post(`/projects/${projectId}/summary`, {}),

  // Pricing
  calcPricing: (projectId, inputs)         => post(`/projects/${projectId}/pricing`, inputs),
};
