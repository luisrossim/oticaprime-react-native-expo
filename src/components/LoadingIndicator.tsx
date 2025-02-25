import { colors } from "@/constants/colors";
import { View, StyleSheet, ActivityIndicator } from "react-native";

export function LoadingIndicator(){
    return (
        <View style={styles.loading}>
            <ActivityIndicator size="large" color={colors.sky[500]} />
        </View>
    )
}

const styles = StyleSheet.create({
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})