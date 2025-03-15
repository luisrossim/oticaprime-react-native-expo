import { dashboardFilterData } from "@/models/data/dashboardFilter"
import { colors } from "@/utils/constants/colors";
import { Feather } from "@expo/vector-icons";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native"

interface PeriodSelectionModalProps {
    modalVisible: boolean;
    setModalVisible: (visible: boolean) => void;
    selectedRange: number;
    handleSelectRange: (range: number) => void;
}

export const DashboardFilterModal = ({
    modalVisible, selectedRange, setModalVisible, handleSelectRange
}: PeriodSelectionModalProps)  => {
    return (
        <Modal animationType="fade" transparent={true} visible={modalVisible}>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Selecionar Período</Text>

                    {dashboardFilterData.map((filter, index) => (
                        <TouchableOpacity 
                            key={index}
                            style={[styles.option, (selectedRange == filter.range) && styles.optionSelected]} 
                            onPress={() => handleSelectRange(filter.range)}
                        >
                            <Feather 
                                name="calendar" 
                                size={20} 
                                style={
                                    (selectedRange == filter.range) ? {color: colors.blue[100]} : {color: colors.gray[500]}
                                } 
                            />
                            <Text 
                                style={(selectedRange == filter.range) ? styles.optionLabelSelected : styles.optionLabel}
                            >
                                {filter.label}
                            </Text>
                        </TouchableOpacity>
                    ))}

                    <View style={{flexDirection: "row"}}>
                        <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                            <Text style={styles.cancelButtonText}>
                                Cancelar
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}


const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.6)",
    },
    modalContent: {
        backgroundColor: "#FFF",
        padding: 20,
        borderRadius: 10,
        width: "90%"
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 600,
        color: colors.gray[800],
        marginBottom: 20,
    },
    cancelButton: {
        flex: 1,
        marginTop: 30
    },
    cancelButtonText: {
        fontSize: 16,
        textAlign: "center",
        paddingHorizontal: 20,
        paddingVertical: 10,
        color: colors.gray[600],
        backgroundColor: colors.gray[200],
        borderRadius: 6
    },
    optionLabel: {
        fontSize: 15,
        color: colors.gray[600]
    },
    optionLabelSelected: {
        fontSize: 15,
        color: colors.blue[100]
    },
    optionSelected: {
        backgroundColor: colors.blue[600],
        borderRadius: 6
    },
    option: {
        paddingVertical: 10,
        paddingHorizontal: 7,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginVertical: 2
    },
})