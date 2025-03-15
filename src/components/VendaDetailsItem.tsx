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
            <FontAwesome6 name={props.icon} size={18} color={colors.green[600]} style={styles.icon} />
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
        paddingHorizontal: 20
    },
    vendaDetailsText: {
        flex: 1,
        color: colors.gray[700]
    },
    icon: {
        textAlign: "center",
        padding: 10,
        width: 40,
        height: 40,
        backgroundColor: colors.green[200],
        borderRadius: 50
    }
})