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

                        <Feather name="settings" size={10} style={styles.settingsIcon} />
                    </View>

                    <View style={{flexDirection: "column", alignItems: "flex-start", gap: 1}}>
                        <Text style={styles.profileText}>
                            {selectedEmpresa ? handleEmpresaNome(selectedEmpresa?.RAZAO_EMP) : "Nenhuma empresa selecionada"}
                        </Text>
                        <Text style={{fontSize: 10, color: colors.gray[500], fontWeight: 300}}>
                            {selectedCaixa ? handleCaixaName(selectedCaixa?.DESC_CAI) : "Nenhum caixa selecionado"}
                        </Text>
                    </View>
                </TouchableOpacity>
                <Feather name="bell" size={20} color={colors.gray[900]} />
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
        paddingTop: 18,
        paddingBottom: 10,
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
        fontSize: 13,
        color: colors.gray[900]
    },
    image: { 
        width: 30, 
        height: 30, 
        borderRadius: 50
    },
    settingsIcon: {
        position: "absolute", 
        bottom: 0, 
        right: 0,
        padding: 1,
        color: colors.gray[600],
        borderRadius: 50,
        backgroundColor: "#FFF"
    }
});
