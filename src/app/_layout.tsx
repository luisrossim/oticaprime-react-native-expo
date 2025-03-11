import React, { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "react-native";
import { EmpresaCaixaProvider } from "@/context/EmpresaCaixaContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";

function MainLayout() {
    const { authData, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {        
        if (!isLoading) {
            if (authData) {
                router.replace("/(tabs)");
            } else {
                router.replace("/login");
            }
        }
    }, [authData, isLoading]);

    if (isLoading) return null;

    return (
        <EmpresaCaixaProvider>
            <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
            
            <Stack>
                <Stack.Screen 
                    name="(tabs)" 
                    options={{ 
                        headerShown: false, 
                        animation: "fade" 
                    }} 
                />
                <Stack.Screen 
                    name="settings" 
                    options={{ 
                        headerShown: false,
                        animation: "ios_from_right",
                        headerTitle: "Configurações",
                        headerBackTitle: "Painel"
                    }} 
                />
                <Stack.Screen 
                    name="venda-details" 
                    options={{ 
                        headerShown: false,
                        animation: "ios_from_right",
                        headerTitle: "Detalhes",
                        headerBackTitle: "Vendas"
                    }} 
                />
                <Stack.Screen 
                    name="login" 
                    options={{ 
                        headerShown: false,
                        animation: "slide_from_bottom",
                        gestureEnabled: false
                    }} 
                />
            </Stack>
        </EmpresaCaixaProvider>
    );
}

export default function Layout() {
    return (
        <AuthProvider>
            <MainLayout />
        </AuthProvider>
    );
}
