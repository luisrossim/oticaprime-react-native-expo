import { colors } from "@/utils/constants/colors";
import { View, Text, StyleSheet } from "react-native"

interface FilterInfoPageProps {
    info: string
}

export const FilterInfoPage = (props: FilterInfoPageProps) => {
    return (
        <View style={styles.container}>
            <Text style={styles.info}>
                {props.info}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        gap: 4
    },
    info: {
        color: colors.slate[800], 
        fontWeight: 300
    }
})