// API client for communicating with the backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface ApiResponse<T> {
  message?: string;
  error?: string;
  [key: string]: any;
  data?: T;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem('authToken');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  async request<T>(
    method: string,
    endpoint: string,
    data?: any
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const options: RequestInit = {
        method,
        headers: this.getHeaders(),
      };

      if (data) {
        options.body = JSON.stringify(data);
      }

      const response = await fetch(url, options);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error: any) {
      console.error(`API Error: ${error.message}`);
      throw error;
    }
  }

  // Auth endpoints
  async signup(email: string, password: string, name: string) {
    const response = await this.request('POST', '/auth/signup', {
      email,
      password,
      name,
    });
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  }

  async login(email: string, password: string) {
    const response = await this.request('POST', '/auth/login', {
      email,
      password,
    });
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  }

  async getCurrentUser() {
    return this.request('GET', '/auth/me');
  }

  async logout() {
    const response = await this.request('POST', '/auth/logout');
    this.clearToken();
    return response;
  }

  // Quotation endpoints
  async getQuotations() {
    return this.request('GET', '/quotations');
  }

  async getQuotation(id: string) {
    return this.request('GET', `/quotations/${id}`);
  }

  async createQuotation(data: any) {
    return this.request('POST', '/quotations', data);
  }

  async updateQuotation(id: string, data: any) {
    return this.request('PUT', `/quotations/${id}`, data);
  }

  async deleteQuotation(id: string) {
    return this.request('DELETE', `/quotations/${id}`);
  }

  // Proposal endpoints
  async getProposals() {
    return this.request('GET', '/proposals');
  }

  async getProposal(id: string) {
    return this.request('GET', `/proposals/${id}`);
  }

  async createProposal(data: any) {
    return this.request('POST', '/proposals', data);
  }

  async updateProposal(id: string, data: any) {
    return this.request('PUT', `/proposals/${id}`, data);
  }

  async deleteProposal(id: string) {
    return this.request('DELETE', `/proposals/${id}`);
  }

  // Automated Proposal & Quotation Generator endpoints
  async generateProposal(data: {
    clientName: string;
    projectType: string;
    requirements: string;
    timeline?: string;
    budget?: string;
    features?: string[];
    complexity?: 'low' | 'medium' | 'high';
  }) {
    return this.request('POST', '/generator/generate', data);
  }

  async estimateCosts(data: {
    projectType: string;
    features?: string[];
    complexity?: 'low' | 'medium' | 'high';
  }) {
    return this.request('POST', '/generator/estimate-costs', data);
  }

  async getGeneratorTemplates() {
    return this.request('GET', '/generator/templates');
  }

  async getComplexityLevels() {
    return this.request('GET', '/generator/complexity-levels');
  }

  async saveProposal(data: any) {
    return this.request('POST', '/generator/save-proposal', data);
  }

  async getSavedProposals() {
    return this.request('GET', '/generator/proposals');
  }

  async getSavedProposal(id: string) {
    return this.request('GET', `/generator/proposals/${id}`);
  }

  async createProposalVersion(id: string, data: any) {
    return this.request('POST', `/generator/proposals/${id}/version`, data);
  }

  async deleteGeneratorProposal(id: string) {
    return this.request('DELETE', `/generator/proposals/${id}`);
  }

  // File endpoints
  async uploadFile(filename: string, fileData: ArrayBuffer) {
    return this.request('POST', '/files/upload', {
      filename,
      fileData: Buffer.from(fileData).toString('base64'),
    });
  }

  async getFiles() {
    return this.request('GET', '/files');
  }

  async downloadFile(id: string) {
    return this.request('GET', `/files/${id}`);
  }

  async deleteFile(id: string) {
    return this.request('DELETE', `/files/${id}`);
  }

  // Health check
  async healthCheck() {
    return this.request('GET', '/health');
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

export default apiClient;
