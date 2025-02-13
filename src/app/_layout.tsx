import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { EmpresaProvider } from "@/context/EmpresaContext";

export default function Layout(){
    return  (
        <EmpresaProvider>
            <StatusBar
                barStyle="default"
                backgroundColor="#000"
            />

            <Stack screenOptions={{ headerShown: false }} />
        </EmpresaProvider>
    )
}