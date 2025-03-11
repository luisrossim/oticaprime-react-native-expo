import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthResponse } from "@/models/auth";

type AuthContextType = {
    authData: AuthResponse | null;
    isLoading: boolean;
    updateAuth: (AuthResponse: AuthResponse) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [authData, setAuthData] = useState<AuthResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadAuthData = async () => {
            try {
                const storedAuthData = await AsyncStorage.getItem("@authData");
                if (storedAuthData) {
                    setAuthData(JSON.parse(storedAuthData));
                }
            } catch (error) {
                console.error("Erro ao carregar usuário:", error);
            } finally {
                setIsLoading(false);
            }
        };
    
        loadAuthData();
    }, []);

    const updateAuth = async (authData: AuthResponse) => {
        try {
            await AsyncStorage.setItem("@authData", JSON.stringify(authData));
            setAuthData(authData);
        } catch (error) {
            console.error("Erro ao salvar usuário:", error);
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem("@authData");
            setAuthData(null);
        } catch (error) {
            console.error("Erro ao remover usuário:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ authData, isLoading, updateAuth, logout }}>
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
