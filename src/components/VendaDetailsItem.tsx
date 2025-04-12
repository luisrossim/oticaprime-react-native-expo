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
           <View style={{
                width: 30,
                height: 30,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: colors.green[300],
                borderRadius: 100,
            }}>
                <FontAwesome6
                    name={props.icon}
                    size={14}
                    color={colors.lime[900]}
                />
            </View>

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
        gap: 10,
        paddingHorizontal: 18
    },
    vendaDetailsText: {
        flex: 1,
        fontSize: 13,
        fontWeight: 500,
        color: colors.slate[700]
    },
    icon: {
        width: 30,
        height: 30
    }
})