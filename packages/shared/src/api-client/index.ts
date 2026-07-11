export interface ApiClientOptions {
  baseUrl?: string;
  headers?: Record<string, string>;
}

export interface ApiRequestOptions extends RequestInit {
  searchParams?: Record<string, string | number | boolean | undefined>;
}

/** Thin, typed fetch wrapper for calling internal API routes. No business logic. */
export class ApiClient {
  private readonly baseUrl: string;
  private readonly defaultHeaders: Record<string, string>;

  constructor(options: ApiClientOptions = {}) {
    this.baseUrl = options.baseUrl ?? "";
    this.defaultHeaders = { "Content-Type": "application/json", ...options.headers };
  }

  private buildUrl(path: string, searchParams?: ApiRequestOptions["searchParams"]): string {
    const url = new URL(path, this.baseUrl || "http://localhost");
    if (searchParams) {
      for (const [key, value] of Object.entries(searchParams)) {
        if (value !== undefined) url.searchParams.set(key, String(value));
      }
    }
    return this.baseUrl ? url.toString() : `${url.pathname}${url.search}`;
  }

  async request<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
    const { searchParams, headers, ...rest } = options;
    const response = await fetch(this.buildUrl(path, searchParams), {
      ...rest,
      headers: { ...this.defaultHeaders, ...headers },
    });

    if (!response.ok) {
      const body = (await response.json().catch(() => undefined)) as
        { error?: { message?: string } } | undefined;
      throw new Error(body?.error?.message ?? `Request failed with status ${response.status}.`);
    }

    return (await response.json()) as T;
  }

  get<T>(path: string, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(path, { ...options, method: "GET" });
  }

  post<T>(path: string, body?: unknown, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(path, { ...options, method: "POST", body: JSON.stringify(body) });
  }

  patch<T>(path: string, body?: unknown, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(path, { ...options, method: "PATCH", body: JSON.stringify(body) });
  }

  delete<T>(path: string, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(path, { ...options, method: "DELETE" });
  }
}

export const apiClient = new ApiClient();
