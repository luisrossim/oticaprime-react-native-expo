import { colors } from "@/constants/colors";
import { Feather } from "@expo/vector-icons";
import { router } from 'expo-router'
import { useState } from "react";
import { View, Text, StyleSheet, Pressable, SafeAreaView, Modal } from "react-native";

export function CustomHeader({ tintColor, title }: { tintColor?: string, title?: string }) {
    const [selectedEmpresa, setSelectedEmpresa] = useState<string>("Empresa 1");
    const [modalVisible, setModalVisible] = useState<boolean>(false);

    const empresas = ["Empresa 1", "Empresa 2", "Empresa 3"];

    return (
        <SafeAreaView>
            <View style={styles.container}>
                {/* Simula um Picker manualmente */}
                <Pressable style={styles.pickerButton} onPress={() => setModalVisible(true)}>
                    <Text style={styles.pickerText}>{selectedEmpresa}</Text>
                </Pressable>

                {/* Ícones de notificações e configurações */}
                <View style={styles.subcontainer}>
                    <Pressable style={styles.pressable} onPress={() => router.push("/modal")}>
                        <Feather name="bell" size={20} color={colors.gray[600]} />
                    </Pressable>
                    <Pressable style={styles.pressable} onPress={() => router.push("/modal")}>
                        <Feather name="settings" size={20} color={colors.gray[600]} />
                    </Pressable>
                </View>
            </View>

            {/* Modal para seleção de empresa */}
            <Modal visible={modalVisible} transparent animationType="fade">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={{paddingBottom: 20, fontWeight: 600}}>Selecione uma empresa</Text>
                        {empresas.map((empresa) => (
                            <Pressable
                                key={empresa}
                                style={styles.modalItem}
                                onPress={() => {
                                    setSelectedEmpresa(empresa);
                                    setModalVisible(false);
                                }}
                            >
                                <Text style={styles.modalText}>{empresa}</Text>
                            </Pressable>
                        ))}
                        <Pressable onPress={() => setModalVisible(false)} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>Cancelar</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
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
    subcontainer: {
        flexDirection: 'row',
        gap: 12
    },
    pickerButton: {
        width: "50%",
        backgroundColor: colors.gray[100],
        padding: 10,
        borderRadius: 5
    },
    pickerText: {
        fontSize: 14,
        fontWeight: "600"
    },
    pressable: {
        padding: 5
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)"
    },
    modalContent: {
        width: "80%",
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
        alignItems: "center"
    },
    modalItem: {
        paddingVertical: 15,
        width: "100%",
        alignItems: "center",
        marginVertical: 5,
        backgroundColor: colors.gray[100],
        borderRadius: 50
    },
    modalText: {
        fontSize: 14
    },
    closeButton: {
        marginTop: 10
    },
    closeButtonText: {
        color: colors.gray[600],
        fontSize: 16,
        paddingTop: 20
    }
});
