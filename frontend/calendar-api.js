/**
 * CalendarAPI - Cliente para la API del Backend
 * Reemplaza las funciones de localStorage con llamadas HTTP
 */

// Detectar automáticamente la URL correcta
let API_BASE_URL;
if (typeof window !== 'undefined') {
  const protocol = window.location.protocol;
  const host = window.location.host;
  API_BASE_URL = `${protocol}//${host}/api`;
} else {
  API_BASE_URL = 'http://localhost:5000/api';
}

class CalendarAPI {
  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // ============= HELPER METHODS =============

  async request(method, endpoint, data = null) {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, options);
      
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error (${method} ${endpoint}):`, error);
      throw error;
    }
  }

  // ============= POSTS (Publicaciones) =============

  // Obtener todos los posts de un cliente
  async getPostsByClient(clientId) {
    return this.request('GET', `/posts/client/${clientId}`);
  }

  // Obtener un post específico
  async getPost(postId) {
    return this.request('GET', `/posts/${postId}`);
  }

  // Crear un nuevo post
  async createPost(postData) {
    return this.request('POST', '/posts', postData);
  }

  // Actualizar un post
  async updatePost(postId, postData) {
    return this.request('PUT', `/posts/${postId}`, postData);
  }

  // Eliminar un post
  async deletePost(postId) {
    return this.request('DELETE', `/posts/${postId}`);
  }

  // Agregar comentario a un post
  async addComment(postId, author, text) {
    return this.request('POST', `/posts/${postId}/comments`, { author, text });
  }

  // Eliminar comentario
  async deleteComment(postId, commentId) {
    return this.request('DELETE', `/posts/${postId}/comments/${commentId}`);
  }

  // ============= CLIENTS (Clientes) =============

  // Obtener todos los clientes
  async getClients() {
    return this.request('GET', '/clients');
  }

  // Obtener un cliente específico
  async getClient(clientId) {
    return this.request('GET', `/clients/${clientId}`);
  }

  // Crear un nuevo cliente
  async createClient(clientData) {
    return this.request('POST', '/clients', clientData);
  }

  // Actualizar un cliente
  async updateClient(clientId, clientData) {
    return this.request('PUT', `/clients/${clientId}`, clientData);
  }

  // Eliminar un cliente
  async deleteClient(clientId) {
    return this.request('DELETE', `/clients/${clientId}`);
  }

  // ============= POTENTIAL CLIENTS (Clientes Potenciales) =============

  // Agregar cliente potencial
  async addPotentialClient(clientId, potentialData) {
    return this.request('POST', `/clients/${clientId}/potential`, potentialData);
  }

  // Actualizar cliente potencial
  async updatePotentialClient(clientId, potentialId, potentialData) {
    return this.request('PUT', `/clients/${clientId}/potential/${potentialId}`, potentialData);
  }

  // Eliminar cliente potencial
  async deletePotentialClient(clientId, potentialId) {
    return this.request('DELETE', `/clients/${clientId}/potential/${potentialId}`);
  }

  // ============= SHARE CODES (Códigos Compartibles) =============

  // Generar un código compartible
  async generateShareCode(clientId, duration = 7) {
    return this.request('POST', '/shares/generate', { clientId, duration });
  }

  // Validar un código compartible
  async validateShareCode(code) {
    return this.request('GET', `/shares/validate/${code}`);
  }

  // ============= HEALTH CHECK =============

  async healthCheck() {
    try {
      const rootUrl = String(this.baseUrl || '').replace(/\/api\/?$/, '');
      const response = await fetch(`${rootUrl}/health`);
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      return await response.json();
    } catch {
      return { status: 'error' };
    }
  }
}

// Crear instancia global
const api = new CalendarAPI();

// Exportar si es módulo ES6
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CalendarAPI, api };
}
