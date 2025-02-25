import { EnvironmentDev } from '@/environments/environment-dev';
import axios, { AxiosInstance } from 'axios';

export class AxiosService<T> {
  protected readonly api: AxiosInstance;
  protected readonly path: string;

  constructor(path: string) {
    this.path = path;
    
    this.api = axios.create({
      baseURL: EnvironmentDev.urlBase
    });

    this.api.interceptors.request.use(
      (config) => {
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6Imx1aXNyb3NzaW0yM0BnbWFpbC5jb20iLCJpYXQiOjE3NDA1MTQ0MjcsImV4cCI6MTc0MDY4NzIyN30.c704VGPHn_LoUJbYZ_KULryjiKKQIf-3dYoOKauir1c";

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
