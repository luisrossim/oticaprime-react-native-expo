import React from 'react';
import { Text, StyleSheet, SafeAreaView, ImageBackground, View } from 'react-native';
import { CustomHeader } from '@/components/CustomHeader';
import { Feather } from '@expo/vector-icons';
import { colors } from '@/utils/constants/colors';

export default function ManualUsuario() {
    return (
        <SafeAreaView style={{flex: 1, backgroundColor: "#FFF"}}>
            <CustomHeader title={"Manual do usuário"} />

            <ImageBackground 
                source={{ uri: "https://images.unsplash.com/photo-1445102451117-84e2b4f715c6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }} 
                style={styles.image}
                resizeMode="cover"
            >
                <View style={styles.overlay}></View>
                <View style={styles.info}>
                    <Feather name="book" size={14} color={"#FFF"} />
                    <Text style={{color: "#FFF"}}>
                        Manual em desenvolvimento.
                    </Text>
                </View>
            </ImageBackground>
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
        backgroundColor: colors.slate[800],
        opacity: 0.8
    },
});
