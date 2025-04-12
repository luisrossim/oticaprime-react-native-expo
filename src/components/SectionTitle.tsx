import React from "react";
import { Text, StyleSheet, View } from "react-native";

interface SectionTitleProps {
    title: string;
}

export default function SectionTitle({title}: SectionTitleProps) {
    return (
        <View style={{paddingHorizontal: 18}}>
            <Text style={styles.text}>
                {title}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    text: {
        color: "#7c8ba2",
        fontWeight: 500
    },
});
