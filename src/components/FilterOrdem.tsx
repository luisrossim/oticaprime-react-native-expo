import { colors } from "@/utils/constants/colors";
import { Feather } from "@expo/vector-icons";
import { View, Text, StyleSheet } from "react-native"

export const FilterOrdem = () => {
    return (
       <View style={styles.container}>
            <Feather 
                name="chevrons-down" 
                size={16} 
                color={colors.gray[600]} 
            />
            <Text style={{color: colors.gray[600]}}>
                Mais recentes
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        gap: 5,
        marginTop: 2
    }
})