import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { EmpresaProvider } from "@/context/EmpresaContext";

// app/_layout.tsx
export default function Layout() {
    return (
        <EmpresaProvider>
            <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
            
            <Stack>
                <Stack.Screen 
                    name="(tabs)" 
                    options={{ 
                        headerShown: false 
                    }} 
                />

                <Stack.Screen 
                    name="settings" 
                    options={{
                        headerShown: true,
                        headerTitle: 'Configurações',
                        headerBackTitle: 'Painel'
                    }} 
                />

                 <Stack.Screen 
                    name="venda-details" 
                    options={{
                        headerShown: true,
                        headerTitle: 'Detalhes da Venda',
                        headerBackTitle: 'Vendas'
                    }} 
                />
            </Stack>
        </EmpresaProvider>
    );
}
