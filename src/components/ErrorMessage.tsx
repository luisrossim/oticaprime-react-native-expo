import { colors } from "@/utils/constants/colors";
import { Feather } from "@expo/vector-icons";
import { View, Text, StyleSheet } from "react-native";

interface ErrorMessage {
    error?: string;
}

export function ErrorMessage({ error }: ErrorMessage){
    return (
        <View style={styles.container}>
            <Feather name="alert-circle" size={15} color={colors.red[50]} />
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
        backgroundColor: colors.red[400],
        padding: 20,
        gap: 10
    },
    error: {
        color: colors.red[50]
    }
})