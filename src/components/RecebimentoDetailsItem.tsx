import { colors } from "@/utils/constants/colors"
import { View, Text, StyleSheet } from "react-native"

interface RecebimentoDetailsLineProps {
    label: string
    value: string
}

export const RecebimentoDetailsLine = (props: RecebimentoDetailsLineProps) => {
    return (
        <View style={styles.recebimentoDetailsLine}>
            <Text style={styles.label}>
                {props.label}
            </Text>
            <Text style={styles.value}>
                {props.value}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    recebimentoDetailsItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 18,
        marginBottom: 10
    },
    recebimentoDetailsLine: {
        width: "100%",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.slate[100]
    },
    label: {
        color: colors.slate[900], 
        fontWeight: 600, 
        fontSize: 15
    },
    value: {
        color: colors.slate[700], 
        fontWeight: 300
    }
})