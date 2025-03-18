import { AuthRequest, AuthResponse, RefreshAuthRequest, RefreshAuthResponse } from "@/models/auth";
import { AxiosService } from "./axios-service";

export class AuthService extends AxiosService<AuthRequest> {
    constructor(token?: string) {
        super('/auth', token);
    }

    async login(credenciais: AuthRequest): Promise<AuthResponse> {
        const response = await this.api.post<AuthResponse>("/auth/login", credenciais);
        return response.data;
    }

    async updateAccessToken(refreshToken: RefreshAuthRequest): Promise<RefreshAuthResponse> {
        const response = await this.api.post<RefreshAuthResponse>("/auth/refresh-access", refreshToken);
        return response.data;
    }

    async checkAccessToken(): Promise<any> {
        const response = await this.api.get<any>("/auth/check-access");
        return response.data;
    }
}