import { colors } from "@/constants/colors";
import { View, StyleSheet, SafeAreaView, Text } from "react-native";
import React from "react";
import { useEmpresa } from "@/context/EmpresaContext";

export function CustomHeader() {
    const { selectedCompany, updateCompany } = useEmpresa();

    const data = [
        { label: 'Item 1', value: '1' },
        { label: 'Item 2', value: '2' },
        { label: 'Item 3', value: '3' },
        { label: 'Item 4', value: '4' },
        { label: 'Item 5', value: '5' },
        { label: 'Item 6', value: '6' },
        { label: 'Item 7', value: '7' },
        { label: 'Ótica Prime Linhares', value: '8' },
    ];

    return (
        <SafeAreaView>
            <View style={styles.container}>
                <Text style={styles.title}>ATIP</Text>

                <View style={{ width: 200 }}>
                    <Text>Teste</Text>
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
        paddingVertical: 15
    },
    title: {
        fontWeight: '900',
        fontSize: 16,
        fontStyle: "italic"
    },
    dropdown: {
        height: 50,
        borderWidth: 0.5,
        borderColor: colors.gray[200],
        borderRadius: 8,
        paddingHorizontal: 10,
        color: colors.gray[200]
    }
});
