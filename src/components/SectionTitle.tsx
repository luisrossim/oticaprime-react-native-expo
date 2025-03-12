import { colors } from "@/utils/constants/colors";
import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface SectionTitleProps {
    title: string
}

export default function SectionTitle(props: SectionTitleProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                {props.title}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.gray[100],
        paddingHorizontal: 20,
        paddingVertical: 10,
    
    },
    text: {
        color: "#878b94", 
        fontSize: 12,
        fontWeight: 500
    },
});
