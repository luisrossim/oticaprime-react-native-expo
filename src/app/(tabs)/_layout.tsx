import { Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { colors } from "@/constants/colors";
import { CustomHeader } from "@/components/CustomHeader";
import { Pressable } from "react-native";

export default function Layout(){
    const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

    return (
        <Tabs
            screenOptions={{
                sceneStyle: { backgroundColor: "#FFF" },
                headerShown: true,
                tabBarShowLabel: false,
                tabBarActiveTintColor: colors.black,
                tabBarInactiveTintColor: colors.gray[400],
                header: ({ route }) => (
                    <CustomHeader title={"Empresa 1"} />
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
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="pie-chart" size={size} color={color} />
                    )
               }} 
            />

            <Tabs.Screen
                name="vendas"
                options={{
                    tabBarLabel: "Vendas",
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="dollar-sign" size={size} color={color} />
                    )
               }} 
            />

            <Tabs.Screen
                name="caixa"
                options={{
                    tabBarLabel: "Caixa",
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="box" size={size} color={color} />
                    )
               }} 
            />
            
            <Tabs.Screen
                name="recebimentos"
                options={{
                    tabBarLabel: "Recebimentos",
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="arrow-down-right" size={size} color={color} />
                    )
               }} 
            />
        </Tabs>
    )
}