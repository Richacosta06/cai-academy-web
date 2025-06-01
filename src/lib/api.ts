/**
 * Clase para manejar las peticiones a la API de Strapi
 */
export class StrapiAPI {
  private apiURL: string;
  private apiToken: string;
  private timeout: number;

  constructor() {
    this.apiURL =
      import.meta.env.PUBLIC_STRAPI_API_URL ||
      "https://credi-unido-strapi.host.wemake180.com";
    this.apiToken = import.meta.env.PUBLIC_STRAPI_API_TOKEN || "";
    this.timeout = 10000; // 10 segundos de timeout
  }

  /**
   * Realiza una petición GET a la API de Strapi
   * @param endpoint - Endpoint de la API
   * @param params - Parámetros de la petición
   * @returns Respuesta de la API
   */
  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    try {
      const url = new URL(`${this.apiURL}/api/${endpoint}`);

      if (params) {
        Object.keys(params).forEach((key) =>
          url.searchParams.append(key, params[key])
        );
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${this.apiToken}`,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Error en la petición: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new Error("La petición ha excedido el tiempo de espera");
        }
        if (error.message.includes("fetch failed")) {
          throw new Error(
            "No se pudo conectar con el servidor. Por favor, verifica tu conexión a internet."
          );
        }
      }
      throw error;
    }
  }

  /**
   * Realiza una petición POST a la API de Strapi
   * @param endpoint - Endpoint de la API
   * @param data - Datos a enviar
   * @returns Respuesta de la API
   */
  async post<T>(endpoint: string, data: any): Promise<T> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.apiURL}/api/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiToken}`,
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Error en la petición: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new Error("La petición ha excedido el tiempo de espera");
        }
        if (error.message.includes("fetch failed")) {
          throw new Error(
            "No se pudo conectar con el servidor. Por favor, verifica tu conexión a internet."
          );
        }
      }
      throw error;
    }
  }

  /**
   * Realiza una petición PUT a la API de Strapi
   * @param endpoint - Endpoint de la API
   * @param data - Datos a enviar
   * @returns Respuesta de la API
   */
  async put<T>(endpoint: string, data: any): Promise<T> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.apiURL}/api/${endpoint}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiToken}`,
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Error en la petición: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new Error("La petición ha excedido el tiempo de espera");
        }
        if (error.message.includes("fetch failed")) {
          throw new Error(
            "No se pudo conectar con el servidor. Por favor, verifica tu conexión a internet."
          );
        }
      }
      throw error;
    }
  }

  /**
   * Realiza una petición DELETE a la API de Strapi
   * @param endpoint - Endpoint de la API
   * @returns Respuesta de la API
   */
  async delete<T>(endpoint: string): Promise<T> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.apiURL}/api/${endpoint}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${this.apiToken}`,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Error en la petición: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new Error("La petición ha excedido el tiempo de espera");
        }
        if (error.message.includes("fetch failed")) {
          throw new Error(
            "No se pudo conectar con el servidor. Por favor, verifica tu conexión a internet."
          );
        }
      }
      throw error;
    }
  }
}

// Exportar una instancia única de la API
export const strapiAPI = new StrapiAPI();
