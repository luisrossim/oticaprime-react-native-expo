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
            <FontAwesome6 name={props.icon} size={15} color={colors.indigo[800]} style={styles.icon} />
            <Text style={styles.recebimentoDetailsText}>
                {props.detail}
            </Text>
        </View>
    )
}

export const RecebimentoDetailsLine = (props: RecebimentoDetailsLineProps) => {
    return (
        <View style={styles.recebimentoDetailsLine}>
            <Text style={{color: colors.slate[700], fontWeight: 500}}>
                {props.label}:
            </Text>
            <Text style={{fontSize: 13, color: colors.slate[500]}}>
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
        paddingHorizontal: 15,
        marginBottom: 10
    },
    recebimentoDetailsLine: {
        width: "100%",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.slate[100]
    },
    recebimentoDetailsText: {
        flex: 1,
        color: colors.gray[700]
    },
    icon: {
        textAlign: "center",
        padding: 10,
        width: 35,
        height: 35,
        backgroundColor: colors.sky[300],
        borderRadius: 50
    }
})