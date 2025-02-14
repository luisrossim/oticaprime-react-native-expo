import React from "react";
import { colors } from "@/constants/colors";
import { View, StyleSheet, SafeAreaView, Text, TouchableOpacity } from "react-native";
import { useEmpresa } from "@/context/EmpresaContext";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";

export function CustomHeader() {
    const { selectedCompany } = useEmpresa();

    return (
        <SafeAreaView>
            <View style={styles.container}>
                <Text style={styles.title}>ATIP</Text>
                <TouchableOpacity 
                    onPress={() => router.push("/modal")} 
                    style={styles.subcontainer}
                >
                    <Text style={styles.profileText}>
                        {selectedCompany?.nome || ''}
                    </Text>
                    <Feather name="settings" size={15} />
                </TouchableOpacity>
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
        backgroundColor: '#FFF',
        borderBottomColor: colors.gray[300],
        paddingHorizontal: 20,
        paddingVertical: 10
    },
    subcontainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        padding: 10
    },
    title: {
        fontWeight: '900',
        fontSize: 16,
        fontStyle: "italic"
    },
    profileContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    profileText: {
        fontSize: 14
    }
});
