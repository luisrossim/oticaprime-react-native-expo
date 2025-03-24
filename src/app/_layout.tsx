import React, { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "react-native";
import { EmpresaCaixaProvider, useEmpresaCaixa } from "@/context/EmpresaCaixaContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { DateFilterProvider } from "@/context/DateFilterContext";
import { DashboardFilterProvider } from "@/context/DashboardFilterContext";

function MainLayout() {
    const { authData, isLoading } = useAuth();
    const { selectedEmpresa } = useEmpresaCaixa();
    const router = useRouter();

    useEffect(() => {        
        if (!isLoading) {
            if (!authData) {
                router.replace("/login");
            } else if (!selectedEmpresa) {
                router.replace("/welcome");
            } else {
                router.replace("/(tabs)");
            }
        }
    }, [authData, isLoading]);

    if (isLoading) return <LoadingIndicator />;

    return (
        <DateFilterProvider>
            <DashboardFilterProvider>
                <StatusBar barStyle="default" backgroundColor="#FFF" />
            
                <Stack>
                    <Stack.Screen 
                        name="login" 
                        options={{ 
                            headerShown: false,
                            animation: "ios_from_left",
                            gestureEnabled: false
                        }} 
                    />
                    <Stack.Screen 
                        name="welcome" 
                        options={{ 
                            headerShown: false, 
                            animation: "ios_from_right" 
                        }} 
                    />
                    <Stack.Screen 
                        name="(tabs)"
                        options={{ 
                            headerShown: false,
                            gestureEnabled: false, 
                            animation: "ios_from_right" 
                        }} 
                    />
                    <Stack.Screen 
                        name="settings" 
                        options={{ 
                            headerShown: false,
                            animation: "ios_from_right"
                        }} 
                    />
                    <Stack.Screen 
                        name="venda-details" 
                        options={{ 
                            headerShown: false,
                            animation: "ios_from_right"
                        }} 
                    />
                    <Stack.Screen 
                        name="recebimento-details" 
                        options={{ 
                            headerShown: false,
                            animation: "ios_from_right"
                        }} 
                    />
                    <Stack.Screen 
                        name="caixa-historico" 
                        options={{ 
                            headerShown: false,
                            animation: "ios_from_right"
                        }} 
                    />
                    <Stack.Screen 
                        name="manual-usuario" 
                        options={{ 
                            headerShown: false,
                            animation: "ios_from_right"
                        }} 
                    />
                </Stack>
            </DashboardFilterProvider>
        </DateFilterProvider>
    );
}

export default function Layout() {
    return (
        <EmpresaCaixaProvider>
            <AuthProvider>
                <MainLayout />
            </AuthProvider>
        </EmpresaCaixaProvider>
    );
}
