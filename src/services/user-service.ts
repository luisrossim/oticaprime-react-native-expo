import { AuthRequest, AuthResponse } from "@/models/auth";
import { AxiosService } from "./axios-service";
import { User } from "@/models/user";

export class UserService extends AxiosService<User> {
    constructor() {
        super('/user');
    }

    async login(credenciais: AuthRequest): Promise<AuthResponse> {
        const response = await this.api.post<AuthResponse>("/auth/login", credenciais);
        return response.data;
    }
}