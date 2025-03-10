import { PageTitle } from '@/components/PageTitle'
import { View, Text, StyleSheet } from 'react-native'

export default function Caixa(){
    return (
        <View style={styles.container}>
            <PageTitle title="Caixa" size="large" />
        </View>
    )
}

const styles = StyleSheet.create({
   container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 50
    }
})