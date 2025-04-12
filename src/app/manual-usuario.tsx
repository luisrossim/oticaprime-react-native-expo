import React from 'react';
import { StyleSheet, SafeAreaView, View } from 'react-native';
import { CustomHeader } from '@/components/CustomHeader';
import { colors } from '@/utils/constants/colors';
import { Feather } from '@expo/vector-icons';

export default function ManualUsuario() {
    return (
        <SafeAreaView style={{flex: 1, backgroundColor: "#FFF"}}>
            <CustomHeader title={"Manual do usuário"} />

            <View style={styles.info}>
                <Feather name="book" size={16} />
            </View>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        paddingVertical: 50,
        backgroundColor: "#FFF",
    },
    image: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    info: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        opacity: 0.7
    },
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: colors.slate[100],
        opacity: 0.8
    },
});
