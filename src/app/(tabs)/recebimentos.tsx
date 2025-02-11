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
        justifyContent: "center",
        alignItems: "center"
    },
    title: {
        fontSize: 22,
        fontWeight: 600
    }
})