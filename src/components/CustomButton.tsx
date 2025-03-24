import { colors } from "@/utils/constants/colors";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from "react-native";

interface CustomButtonProps {
    label: string
    onPress: () => void
    style?: ViewStyle
    icon?: boolean
}

export default function CustomButton({ label, onPress, style, icon }: CustomButtonProps) {
    return (
        <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
            <Text style={styles.text}>{label}</Text>
            {icon && (
                <Feather name="chevron-right" color={colors.cyan[200]} size={16} />
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.sky[900],
        paddingVertical: 16,
        paddingHorizontal: 22,
        borderRadius: 60,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 10
    },
    text: {
        color: colors.cyan[200],
        fontSize: 15
    },
});
