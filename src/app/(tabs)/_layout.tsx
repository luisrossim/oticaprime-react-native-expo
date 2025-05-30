import { Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { colors } from "@/utils/constants/colors";
import { Platform, Pressable, View } from "react-native";
import { GlobalHeader } from "@/components/GlobalHeader";
import { useEffect } from "react";
import * as NavigationBar from "expo-navigation-bar";

export default function Layout(){
    useEffect(() => {
        if (Platform.OS === "android") {
            NavigationBar.setBackgroundColorAsync(colors.slate[900]);
        }
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: "#FFF" }}>
            <GlobalHeader />

            <Tabs
                screenOptions={{
                    sceneStyle: { backgroundColor: "#FFF" },
                    headerShown: false,
                    tabBarShowLabel: true,
                    animation: "shift",
                    tabBarActiveTintColor: "#FFF",
                    tabBarInactiveTintColor: colors.slate[500],
                    tabBarStyle: { backgroundColor: colors.slate[900] },
                    tabBarButton: (props) => (
                        <Pressable {...props} android_ripple={{ borderless: false, color: "transparent" }}>
                            {props.children}
                        </Pressable>
                    )
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        tabBarLabel: "Dashboard",
                        tabBarIcon: ({ color, size }) => (
                            <Feather name="bar-chart-2" size={size} color={color} />
                        )
                    }}
                />

                <Tabs.Screen
                    name="caixa"
                    options={{
                        tabBarLabel: "Caixa",
                        tabBarIcon: ({ color, size }) => (
                            <Feather name="box" size={size - 2} color={color} />
                        )
                    }}
                />

                <Tabs.Screen
                    name="vendas"
                    options={{
                        tabBarLabel: "Vendas",
                        tabBarIcon: ({ color, size }) => (
                            <Feather name="dollar-sign" size={size - 2} color={color} />
                        )
                    }}
                />

                <Tabs.Screen
                    name="recebimentos"
                    options={{
                        tabBarLabel: "Recebimentos de crediário",
                        tabBarIcon: ({ color, size }) => (
                            <Feather name="arrow-down-right" size={size} color={color} />
                        )
                    }}
                />

                <Tabs.Screen
                    name="processos"
                    options={{
                        tabBarLabel: "Processos Liberados",
                        tabBarIcon: ({ color, size }) => (
                            <Feather name="check-circle" size={size - 2} color={color} />
                        )
                    }}
                />
            </Tabs>
        </View>
    );
}