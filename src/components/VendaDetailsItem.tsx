import { colors } from "@/constants/colors"
import { FontAwesome6 } from "@expo/vector-icons"
import { View, Text, StyleSheet } from "react-native"

interface VendaDetailsItemProps {
    icon: string
    detail: string
}

export const VendaDetailsItem = (props: VendaDetailsItemProps) => {
    return (
        <View style={styles.vendaDetailsItem}>
            <FontAwesome6 name={props.icon} size={18} color={colors.sky[600]} />
            <Text style={styles.vendaDetailsText}>
                {props.detail}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    vendaDetailsItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingBottom: 10
    },
    vendaDetailsText: {
        color: colors.slate[700]
    },
})