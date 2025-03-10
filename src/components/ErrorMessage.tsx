import { colors } from "@/utils/constants/colors";
import { View, Text, StyleSheet } from "react-native";

interface ErrorMessage {
    error?: string;
}

export function ErrorMessage({ error }: ErrorMessage){
    return (
        <View style={styles.container}>
            <Text style={styles.error}>
                {error}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: 'center',
        backgroundColor: colors.red[200],
        padding: 10,
        marginBottom: 10
    },
    error: {
        fontSize: 13,
        color: colors.red[600]
    }
})