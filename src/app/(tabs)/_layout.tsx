import { Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { colors } from "@/utils/constants/colors";
import { CustomHeader } from "@/components/CustomHeader";
import { Pressable } from "react-native";

export default function Layout(){
    return (
        <Tabs
            screenOptions={{
                sceneStyle: { backgroundColor: "#FFF" },
                headerShown: true,
                tabBarShowLabel: true,
                tabBarActiveTintColor: "#FFF",
                tabBarInactiveTintColor: colors.gray[500],
                tabBarStyle: {
                    backgroundColor: "#000"
                },
                header: () => (
                    <CustomHeader />
                ),
                tabBarButton: (props) => (
                    <Pressable {...props}
                      android_ripple={{ borderless: false, color: "transparent" }}
                    >
                      {props.children}
                    </Pressable>
                )
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    tabBarLabel: "Dashboard",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Feather name="pie-chart" style={focused ? {color: colors.indigo[600]} : ""} size={size} color={color} />
                    )
               }} 
            />

            <Tabs.Screen
                name="vendas"
                options={{
                    tabBarLabel: "Vendas",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Feather name="dollar-sign" style={focused ? {color: colors.green[600]} : ""} size={size} color={color} />
                    )
               }} 
            />

            <Tabs.Screen
                name="caixa"
                options={{
                    tabBarLabel: "Caixa",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Feather name="box" style={focused ? {color: colors.fuchsia[600]} : ""} size={size} color={color} />
                    )
               }} 
            />
            
            <Tabs.Screen
                name="recebimentos"
                options={{
                    tabBarLabel: "Recebimentos",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Feather name="arrow-down-right" style={focused ? {color: colors.cyan[600]} : ""} size={size} color={color} />
                    )
               }} 
            />
        </Tabs>
    )
}