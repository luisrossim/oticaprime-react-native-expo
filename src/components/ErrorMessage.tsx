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
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    error: {
        fontSize: 14,
        color: colors.red[500]
    }
})