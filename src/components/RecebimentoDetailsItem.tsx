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
             <View style={{
                width: 30,
                height: 30,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: colors.cyan[300],
                borderRadius: 100,
            }}>
                <FontAwesome6
                    name={props.icon}
                    size={14}
                    color={colors.indigo[900]}
                />
            </View>
            <Text style={styles.recebimentoDetailsText}>
                {props.detail}
            </Text>
        </View>
    )
}

export const RecebimentoDetailsLine = (props: RecebimentoDetailsLineProps) => {
    return (
        <View style={styles.recebimentoDetailsLine}>
            <Text style={{color: colors.slate[900], fontWeight: 600, fontSize: 15}}>
                {props.label}
            </Text>
            <Text style={{fontSize: 13, color: colors.slate[700], fontWeight: 300}}>
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
    recebimentoDetailsText: {
        flex: 1,
        color: colors.slate[700],
        fontWeight: 500
    },
    icon: {
        width: 30,
        height: 30
    }
})