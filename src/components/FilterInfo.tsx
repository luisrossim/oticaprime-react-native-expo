import { colors } from "@/utils/constants/colors";
import { Feather } from "@expo/vector-icons";
import { View, Text, StyleSheet } from "react-native"

interface FilterInfoProps {
    totalInfo: string,
    icon: string
}

export const FilterInfo = (props: FilterInfoProps) => {
    return (
       <View style={styles.totalResults}>
            <Feather 
                name={props.icon as keyof typeof Feather.glyphMap} 
                size={16} 
                color={colors.gray[500]} 
            />
            <Text style={{color: colors.gray[500]}}>
                {props.totalInfo}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    totalResults: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        gap: 5
    }
})