const API_BASE = 'http://localhost:8080/api'

// Helper function untuk handle fetch dengan error handling
const fetchWithErrorHandling = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('API call failed:', error)
    throw error
  }
}

export const api = {
  // Articles
  getArticles: () => fetchWithErrorHandling(`${API_BASE}/articles`),
  getArticleBySlug: (slug) => fetchWithErrorHandling(`${API_BASE}/articles/${slug}`),
  
  // Stats
  getStats: () => fetchWithErrorHandling(`${API_BASE}/stats`),
  
  // Auth
  login: (credentials) => 
    fetchWithErrorHandling(`${API_BASE}/login`, {
      method: 'POST',
      body: JSON.stringify(credentials)
    }),
  
  // Admin routes
  createArticle: (article, token) =>
    fetchWithErrorHandling(`${API_BASE}/admin/articles`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(article)
    }),

  updateArticle: (id, article, token) =>
    fetchWithErrorHandling(`${API_BASE}/admin/articles/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(article)
    }),

  deleteArticle: (id, token) =>
    fetchWithErrorHandling(`${API_BASE}/admin/articles/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }),

  // Image Upload
  uploadImage: async (file, token) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE}/admin/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Projects API - dengan safe handling
  getProjects: async () => {
    try {
      const data = await fetchWithErrorHandling(`${API_BASE}/projects`)
      return Array.isArray(data) ? data : [] // Pastikan selalu return array
    } catch (error) {
      console.error('Error in getProjects:', error)
      return [] // Return empty array jika error
    }
  },
  
  getProject: (id) => fetchWithErrorHandling(`${API_BASE}/projects/${id}`),

  createProject: (project, token) =>
    fetchWithErrorHandling(`${API_BASE}/admin/projects`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(project)
    }),

  updateProject: (id, project, token) =>
    fetchWithErrorHandling(`${API_BASE}/admin/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(project)
    }),

  deleteProject: (id, token) =>
    fetchWithErrorHandling(`${API_BASE}/admin/projects/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
}