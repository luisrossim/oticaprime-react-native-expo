import React from "react";
import { colors } from "@/utils/constants/colors";
import { View, StyleSheet, SafeAreaView, Text, TouchableOpacity, Image } from "react-native";
import { useEmpresaCaixa } from "@/context/EmpresaCaixaContext";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";

export function CustomHeader() {
    const { selectedEmpresa, selectedCaixa } = useEmpresaCaixa();

    const handleEmpresaNome = (razaoSocial: string | undefined): string => {
        if (!razaoSocial) return "";
        
        const match = razaoSocial.match(/(?:OTICO)\s+(.+)/i);
        return match ? match[1] : "";
    };

    const handleCaixaName = (nome: string | undefined): string => {
        const res = (nome?.includes("COFRE") ? "CAIXA COFRE" : "CAIXA NORMAL")
        return res;
    }

    return (
        <SafeAreaView>
            <View style={styles.container}>
                <TouchableOpacity 
                    onPress={() => router.push("/settings")} 
                    style={styles.subcontainer}
                >
                    <View style={{position: "relative"}}>
                        <Image
                            source={{ uri: 'https://github.com/luisrossim.png' }}
                            style={styles.image}
                        />

                        <Feather name="settings" size={14} style={styles.settingsIcon} />
                    </View>

                    <View style={{flexDirection: "column", alignItems: "flex-start", gap: 1}}>
                        <Text style={styles.profileText}>
                            {selectedEmpresa ? handleEmpresaNome(selectedEmpresa?.RAZAO_EMP) : "Nenhuma empresa selecionada"}
                        </Text>
                        <Text style={{fontSize: 11, color: colors.gray[500]}}>
                            {selectedCaixa ? handleCaixaName(selectedCaixa?.DESC_CAI) : "Nenhum caixa selecionado"}
                        </Text>
                    </View>
                </TouchableOpacity>
                <Feather name="bell" size={20} color={colors.gray[500]} />
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
        paddingTop: 30,
        paddingBottom: 12,
    },
    subcontainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    profileContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    profileText: {
        color: colors.gray[900],
        fontWeight: 500
    },
    image: { 
        width: 35, 
        height: 35, 
        borderRadius: 50
    },
    settingsIcon: {
        position: "absolute", 
        bottom: -2, 
        right: -2,
        padding: 2,
        color: colors.gray[600],
        borderRadius: 50,
        backgroundColor: "#FFF"
    }
});
