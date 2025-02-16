import axios, { AxiosInstance } from 'axios';

export class AxiosService<T> {
  private readonly api: AxiosInstance;
  private readonly path: string;

  constructor(baseURL: string, path: string) {
    this.api = axios.create({ baseURL });
    this.path = path;

    this.api.interceptors.request.use(
      (config) => {
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6Imx1aXNyb3NzaW0yM0BnbWFpbC5jb20iLCJpYXQiOjE3Mzk2Mjg2MzQsImV4cCI6MTczOTYzMjIzNH0.j_wjRG1HsYnTNXO-Knc288pWbXc2TY0l9blhsEb2ZYI";

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  async getAll(): Promise<T[]> {
    const response = await this.api.get<T[]>(this.path);
    return response.data;
  }

  async getById(id: number | string): Promise<T> {
    const response = await this.api.get<T>(`${this.path}/${id}`);
    return response.data;
  }

  async getWithParams(params: Record<string, string | number>): Promise<T[]> {
    const response = await this.api.get<T[]>(this.path, { params });
    return response.data;
  }

  async create(data: T): Promise<T> {
    const response = await this.api.post<T>(this.path, data);
    return response.data;
  }

  async update(id: number | string, data: Partial<T>): Promise<T> {
    const response = await this.api.put<T>(`${this.path}/${id}`, data);
    return response.data;
  }

  async delete(id: number | string): Promise<void> {
    await this.api.delete(`${this.path}/${id}`);
  }
}
