import React from "react";
import { colors } from "@/constants/colors";
import { View, StyleSheet, SafeAreaView, Text, TouchableOpacity } from "react-native";
import { useEmpresa } from "@/context/EmpresaContext";
import { router } from "expo-router";
import { FontAwesome6 } from "@expo/vector-icons";

export function CustomHeader() {
    const { selectedCompany } = useEmpresa();

    const getNomeAposOtico = (razaoSocial: string | undefined): string => {
        if (!razaoSocial) return "";
        
        const match = razaoSocial.match(/(?:OTICO)\s+(.+)/i);
        return match ? match[1] : "";
    };

    return (
        <SafeAreaView>
            <View style={styles.container}>
                <Text style={styles.title}>
                    ATIP
                </Text>
                <TouchableOpacity 
                    onPress={() => router.push("/settings")} 
                    style={styles.subcontainer}
                >
                    <Text style={styles.profileText}>
                        {getNomeAposOtico(selectedCompany?.RAZAO_EMP)}
                    </Text>
                    <FontAwesome6 name="store" size={18} color={colors.gray[500]} />
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
        borderBottomColor: colors.slate[300],
        paddingHorizontal: 20,
        paddingVertical: 8
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
        fontSize: 12,
        color: colors.slate[900],
        fontStyle: "italic"
    },
    profileContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    profileText: {
        color: colors.slate[600]
    }
});
