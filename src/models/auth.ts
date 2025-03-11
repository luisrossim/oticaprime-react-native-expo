export interface AuthRequest {
    login: string,
    password: string
}

export interface AuthResponse {
    login: string,
    token: string
}