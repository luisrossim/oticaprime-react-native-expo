import { colors } from "@/utils/constants/colors"
import { FontAwesome6 } from "@expo/vector-icons"
import { View, Text, StyleSheet } from "react-native"

interface VendaDetailsItemProps {
    icon: string
    detail: string
}

export const VendaDetailsItem = (props: VendaDetailsItemProps) => {
    return (
        <View style={styles.vendaDetailsItem}>
            <FontAwesome6 name={props.icon} size={14} color={colors.lime[900]} style={styles.icon} />
            <Text style={styles.vendaDetailsText}>
                {props.detail}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    vendaDetailsItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        paddingHorizontal: 15
    },
    vendaDetailsText: {
        flex: 1,
        fontSize: 13,
        color: colors.gray[700]
    },
    icon: {
        textAlign: "center",
        padding: 10,
        width: 35,
        height: 35,
        backgroundColor: colors.green[300],
        borderRadius: 50
    }
})