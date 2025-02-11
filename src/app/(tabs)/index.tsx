import { router } from 'expo-router'
import { View, Text, StyleSheet, Button } from 'react-native'

export default function Index(){
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Dashboard</Text>
            <Button title="Abrir Modal" onPress={() => router.push("/modal")} />
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