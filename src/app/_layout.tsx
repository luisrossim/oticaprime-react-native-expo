import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { EmpresaProvider } from "@/context/EmpresaContext";

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
                    name="modal" 
                    options={{
                        headerShown: true,
                        headerTitle: 'Configurações',
                        headerBackTitle: 'Home'
                    }} 
                />
            </Stack>
        </EmpresaProvider>
    );
}
