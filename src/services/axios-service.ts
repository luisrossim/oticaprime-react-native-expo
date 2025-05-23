import { Environment } from '@/environments/environment';
import axios, { AxiosInstance } from 'axios';

export class AxiosService<T> {
  protected readonly api: AxiosInstance;
  protected readonly path: string;

  constructor(path: string, token?: string) {
    this.path = path;
    
    this.api = axios.create({
      baseURL: Environment.urlBase
    });

    this.api.interceptors.request.use(
      (config) => {

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

  async getByIdWithParam(id1: number | string, id2: number | string): Promise<T> {
    const response = await this.api.get<T>(`${this.path}/${id1}/${id2}`);
    return response.data;
  }

  async getAllByParam(params: Record<string, any>): Promise<T[]> {
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
