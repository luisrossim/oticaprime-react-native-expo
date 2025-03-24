import { colors } from "@/utils/constants/colors"
import { FontAwesome6 } from "@expo/vector-icons"
import { View, Text, StyleSheet } from "react-native"

interface RecebimentoDetailsItemProps {
    icon: string
    detail: string
}

interface RecebimentoDetailsLineProps {
    label: string
    value: string
}

export const RecebimentoDetailsItem = (props: RecebimentoDetailsItemProps) => {
    return (
        <View style={styles.recebimentoDetailsItem}>
            <FontAwesome6 name={props.icon} size={18} color={colors.cyan[600]} style={styles.icon} />
            <Text style={styles.recebimentoDetailsText}>
                {props.detail}
            </Text>
        </View>
    )
}

export const RecebimentoDetailsLine = (props: RecebimentoDetailsLineProps) => {
    return (
        <View style={styles.recebimentoDetailsLine}>
            <Text style={{color: colors.gray[700]}}>
                {props.label}:
            </Text>
            <Text style={{fontSize: 13, color: colors.gray[500]}}>
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
        gap: 15,
        paddingHorizontal: 20
    },
    recebimentoDetailsLine: {
        width: "100%",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
        paddingHorizontal: 20
    },
    recebimentoDetailsText: {
        flex: 1,
        color: colors.gray[700]
    },
    icon: {
        textAlign: "center",
        padding: 10,
        width: 40,
        height: 40,
        backgroundColor: colors.cyan[200],
        borderRadius: 50
    }
})