import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthResponse, RefreshAuthRequest } from "@/models/auth";
import { useEmpresaCaixa } from "./EmpresaCaixaContext";
import { AuthService } from "@/services/auth-service";

type AuthContextType = {
    authData: AuthResponse | null;
    isLoading: boolean;
    updateAuth: (AuthResponse: AuthResponse) => Promise<void>;
    tryRefreshAccessToken: (refreshToken: string) => Promise<AuthResponse | null>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [authData, setAuthData] = useState<AuthResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { updateEmpresa, updateCaixa } = useEmpresaCaixa(); 

    useEffect(() => {
        loadAuthData();
    }, []);

    const loadAuthData = async () => {
        try {
            const storedAuthData = await AsyncStorage.getItem("@authData");

            if (!storedAuthData) {
                throw new Error('Informações do usuário desconhecidas.')
            }

            const parsedAuthData: AuthResponse = JSON.parse(storedAuthData);
            setAuthData(parsedAuthData);

            const isTokenValid = await checkJWTExpiration(parsedAuthData.accessToken, parsedAuthData.refreshToken);

            if (!isTokenValid) {
                throw new Error('Token de acesso inválido.')
            }
            
        } catch (error) {
            await logout();
        } finally {
            setIsLoading(false);
        }
    };

    const checkJWTExpiration = async (accessToken: string, refreshToken: string) => {
        try {
            const authService = new AuthService(accessToken);
            const response = await authService.checkAccessToken();
            return true;

        } catch (error) {
            const updatedAuthData = await tryRefreshAccessToken(refreshToken);

            if (updatedAuthData) {
                await updateAuth(updatedAuthData); 
                return true;
            }

            return false;
        }
    };

    const tryRefreshAccessToken = async (refreshToken: string) => {
        try {
            const request: RefreshAuthRequest = {
                refreshToken: refreshToken
            }
            
            const authService = new AuthService();
            const response = await authService.updateAccessToken(request);
            return response;

        } catch (error) {
            return null;
        }
    };

    const updateAuth = async (authData: AuthResponse) => {
        try {
            await AsyncStorage.setItem("@authData", JSON.stringify(authData));
            setAuthData(authData);
        } catch (error) {
            await logout();
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.clear();
            setAuthData(null);
            updateEmpresa(null);
            updateCaixa(null);
        } catch (error) {
            console.error("Erro ao deslogar usuário:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ authData, isLoading, updateAuth, tryRefreshAccessToken, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth deve ser usado dentro de um AuthProvider");
    }
    return context;
};
