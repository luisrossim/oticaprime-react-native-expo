import { colors } from "@/utils/constants/colors";
import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface SectionTitleProps {
    title: string;
    subtitle?: string;
}

export default function SectionTitle({title, subtitle}: SectionTitleProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                {title}
            </Text>

            {subtitle && (
                <Text style={styles.text}>
                    {subtitle}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: colors.slate[100],
        paddingHorizontal: 15,
        paddingVertical: 10
    },
    text: {
        color: colors.slate[500], 
        fontSize: 11,
        fontWeight: 500
    },
});
