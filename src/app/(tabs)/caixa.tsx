import { View, Text, StyleSheet } from 'react-native'

export default function Caixa(){
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Caixa</Text>
        </View>
    )
}

const styles = StyleSheet.create({
   container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 50
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
    }
})