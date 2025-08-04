const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async refreshToken() {
    return this.request('/auth/refresh', { method: 'POST' });
  }

  // User endpoints
  async updateProfile(userData) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  }

  async getUserProfile(userId) {
    return this.request(`/users/${userId}`);
  }

  async searchUsers(query, page = 1, limit = 10) {
    return this.request(`/users/search/${encodeURIComponent(query)}?page=${page}&limit=${limit}`);
  }

  async sendConnectionRequest(userId) {
    return this.request(`/users/connect/${userId}`, { method: 'POST' });
  }

  // Job endpoints
  async getJobs(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/jobs?${params}`);
  }

  async getJob(jobId) {
    return this.request(`/jobs/${jobId}`);
  }

  async createJob(jobData) {
    return this.request('/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData)
    });
  }

  async updateJob(jobId, jobData) {
    return this.request(`/jobs/${jobId}`, {
      method: 'PUT',
      body: JSON.stringify(jobData)
    });
  }

  async applyToJob(jobId, coverLetter = '') {
    return this.request(`/jobs/${jobId}/apply`, {
      method: 'POST',
      body: JSON.stringify({ coverLetter })
    });
  }

  async getUserPostedJobs(page = 1, limit = 10) {
    return this.request(`/jobs/user/posted?page=${page}&limit=${limit}`);
  }

  // Post endpoints
  async getPosts(page = 1, limit = 10) {
    return this.request(`/posts?page=${page}&limit=${limit}`);
  }

  async createPost(postData) {
    return this.request('/posts', {
      method: 'POST',
      body: JSON.stringify(postData)
    });
  }

  async likePost(postId) {
    return this.request(`/posts/${postId}/like`, { method: 'POST' });
  }

  async commentOnPost(postId, content) {
    return this.request(`/posts/${postId}/comment`, {
      method: 'POST',
      body: JSON.stringify({ content })
    });
  }

  async getUserPosts(userId, page = 1, limit = 10) {
    return this.request(`/posts/user/${userId}?page=${page}&limit=${limit}`);
  }
}

export default new ApiService();