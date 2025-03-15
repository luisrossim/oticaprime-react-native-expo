import React from "react";
import { colors } from "@/utils/constants/colors";
import { View, StyleSheet, SafeAreaView, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";


interface CustomHeaderProps {
    title: string
}

export function CustomHeader({ title }: CustomHeaderProps){
    return (
        <SafeAreaView>
            <View style={styles.container}>
                <View style={styles.subContainer}>
                    <TouchableOpacity 
                        onPress={() => router.back()}
                        style={styles.backButton}
                    >
                        <Feather name="chevron-left" size={24} color={colors.gray[900]} />
                    </TouchableOpacity>

                    <Text style={{fontWeight: 500, fontSize: 16, marginBottom: 1}}>
                        {title}
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 0.5,
        borderBottomColor: colors.gray[300],
        paddingHorizontal: 20,
        paddingTop: 35,
        paddingBottom: 12,
        backgroundColor: "#FFF"
    },
    subContainer: {
        width: "100%", 
        position: "relative", 
        alignItems: "center",
        padding: 5,
    },
    backButton: {
        position: "absolute",
        padding: 3,
        left: 0,
        bottom: 0
    }
});
