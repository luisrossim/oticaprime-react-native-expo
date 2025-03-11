import { colors } from "@/utils/constants/colors";
import { View, StyleSheet, ActivityIndicator, Dimensions } from "react-native";

export function LoadingIndicator() {
    return (
        <View style={styles.overlay}>
            <View style={styles.loading}>
                <ActivityIndicator size="large" color={colors.sky[500]} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
    },
    loading: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});
