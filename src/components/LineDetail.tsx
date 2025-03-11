import { colors } from '@/utils/constants/colors'
import { UtilitiesService } from '@/utils/utilities-service'
import { Feather } from '@expo/vector-icons'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'

interface LineDetailProps {
    label: string,
    value: number,
    isBRL: boolean
}


interface LineDetailButtonProps {
    label: string
}

export function LineDetail({label, value, isBRL}: LineDetailProps) {
    return (
        <View style={styles.lineContainer}>
            <View style={styles.lineContent}>
                <Text style={styles.label}>
                    {label}
                </Text>
                <Text style={styles.value}>
                    {isBRL ? UtilitiesService.formatarValor(value) : value }
                </Text>
            </View>
        </View>
    )
}

export function LineDetailButton({label}: LineDetailButtonProps) {
    return (
        <TouchableOpacity style={styles.lineContainer}>
            <View style={styles.lineContent}>
                <Text style={styles.label}>
                    {label}
                </Text>
                <Feather name="chevron-right" size={20} color={colors.gray[500]} />
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    lineContainer: {
        flexDirection: "column",
        paddingHorizontal: 20,
        paddingVertical: 10,
        width: "100%",
        borderBottomWidth: 0.5,
        borderBottomColor: colors.gray[300]
    },
    lineContent: {
        flexDirection: "row", 
        alignItems: "center", 
        justifyContent: "space-between"
    },
    value: {
        color: colors.gray[500],
        fontWeight: 400,
    },
    label: {
        fontSize: 13,
        color: colors.gray[500]
    }
})