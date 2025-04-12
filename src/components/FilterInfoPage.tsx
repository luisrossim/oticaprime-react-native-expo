import { colors } from "@/utils/constants/colors";
import { Feather } from "@expo/vector-icons";
import { View, Text, StyleSheet } from "react-native"

interface FilterInfoPageProps {
    totalInfo: string,
    icon: string
}

export const FilterInfoPage = (props: FilterInfoPageProps) => {
    return (
        <View style={{gap: 2}}>
            <View style={styles.container}>
                <Feather 
                    name={props.icon as keyof typeof Feather.glyphMap} 
                    size={16} 
                    color={colors.slate[500]} 
                />
                <Text style={{ color: colors.slate[700], fontWeight: 300}}>
                    {props.totalInfo}
                </Text>
            </View>
            <View style={styles.container}>
                <Feather 
                    name="chevron-down" 
                    size={16} 
                    color={colors.slate[500]} 
                />
                <Text style={{ color: colors.slate[700], fontWeight: 300}}>
                    Mais recentes
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        gap: 5,
        marginBottom: 2
    }
})