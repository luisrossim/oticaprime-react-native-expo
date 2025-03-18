export interface AuthRequest {
    login: string,
    password: string
}

export interface AuthResponse {
    login: string
    accessToken: string
    refreshToken: string
}

export interface RefreshAuthRequest {
    refreshToken: string
}

export interface RefreshAuthResponse extends AuthResponse {}
