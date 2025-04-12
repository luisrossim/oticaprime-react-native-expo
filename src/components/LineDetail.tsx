import { colors } from '@/utils/constants/colors'
import { UtilitiesService } from '@/utils/utilities-service'
import { Feather } from '@expo/vector-icons'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'

interface LineDetailProps {
    label: string,
    value: number,
    isBRL: boolean,
    color?: string
}


interface LineDetailButtonProps {
    label: string
    onPress: () => void
}

export function LineDetail({label, value, isBRL, color}: LineDetailProps) {
    return (
        <View style={styles.lineContainer}>
            <View style={styles.lineContent}>
                <Text style={[styles.label, color && {color: color}]}>
                    {label}
                </Text>
                <Text style={[styles.value, color && {color: color}]}>
                    {isBRL ? UtilitiesService.formatarValor(value) : value }
                </Text>
            </View>
        </View>
    )
}

export const LineDetailButton: React.FC<LineDetailButtonProps> = ({ label, onPress }) => {
    return (
        <TouchableOpacity style={styles.lineContainer} onPress={onPress}>
            <View style={styles.lineContent}>
                <Text style={styles.label}>
                    {label}
                </Text>
                <Feather name="chevron-right" size={20} color={colors.slate[500]} />
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    lineContainer: {
        flexDirection: "column",
        paddingVertical: 12,
        width: "100%",
        borderBottomWidth: 0.5,
        borderBottomColor: colors.slate[200]
    },
    lineContent: {
        flexDirection: "row", 
        alignItems: "center", 
        justifyContent: "space-between",
        paddingHorizontal: 18
    },
    value: {
        color: colors.slate[700],
        fontWeight: 300
    },
    label: {
        fontSize: 16,
        fontWeight: 500,
        color: colors.slate[900]
    }
})