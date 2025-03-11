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
            <FontAwesome6 name={props.icon} size={20} color={colors.emerald[600]} />
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
        gap: 12,
        paddingVertical: 12,
        paddingHorizontal: 20, 
        borderBottomWidth: 0.5,
        borderBottomColor: colors.gray[300]
    },
    vendaDetailsText: {
        color: colors.gray[600]
    },
})