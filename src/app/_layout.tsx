import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { EmpresaCaixaProvider } from "@/context/EmpresaCaixaContext";

export default function Layout() {
    return (
        <EmpresaCaixaProvider>
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
                        headerTitle: 'Detalhes',
                        headerBackTitle: 'Vendas'
                    }} 
                />
            </Stack>
        </EmpresaCaixaProvider>
    );
}
