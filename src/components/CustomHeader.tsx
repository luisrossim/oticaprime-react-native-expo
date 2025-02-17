import React from "react";
import { colors } from "@/constants/colors";
import { View, StyleSheet, SafeAreaView, Text, TouchableOpacity } from "react-native";
import { useEmpresa } from "@/context/EmpresaContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

export function CustomHeader() {
    const { selectedCompany } = useEmpresa();

    return (
        <SafeAreaView>
            <View style={styles.container}>
                <Text style={styles.title}>ATIP</Text>
                <TouchableOpacity 
                    onPress={() => router.push("/settings")} 
                    style={styles.subcontainer}
                >
                    <Text style={styles.profileText}>
                        {selectedCompany?.RAZAO_EMP || ''}
                    </Text>
                    <MaterialCommunityIcons name="office-building-cog-outline" size={18} color={colors.gray[500]} />
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
        borderBottomColor: colors.gray[400],
        paddingHorizontal: 20,
        paddingVertical: 3
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
        fontWeight: '300',
        fontSize: 14,
        color: colors.gray[600]
    }
});
