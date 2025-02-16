import { colors } from '@/constants/colors'
import { View, Text, StyleSheet } from 'react-native'

export default function Recebimentos(){
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Recebimentos</Text>
        </View>
    )
}

const styles = StyleSheet.create({
   container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 30,
        backgroundColor: colors.gray[100]
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
    }
})