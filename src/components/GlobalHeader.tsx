import React, { useState } from "react";
import { colors } from "@/utils/constants/colors";
import { View, StyleSheet, SafeAreaView, Text, TouchableOpacity, Image, Modal } from "react-native";
import { useEmpresaCaixa } from "@/context/EmpresaCaixaContext";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { UtilitiesService } from "@/utils/utilities-service";
import { DateFilter } from "@/models/dates";
import { useDateFilter } from "@/context/DateFilterContext";

LocaleConfig.locales['pt-br'] = UtilitiesService.ptBR
LocaleConfig.defaultLocale = 'pt-br';

export function GlobalHeader() {
    const {selectedEmpresa, selectedCaixa} = useEmpresaCaixa();
    const [modalVisible, setModalVisible] = useState(false);

    const {updateDateFilter} = useDateFilter();
    const [selectedStartDate, setSelectedStartDate] = useState<string | null>(null);
    const [selectedEndDate, setSelectedEndDate] = useState<string | null>(null);
    const [markedDates, setMarkedDates] = useState<any>({});

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    
    const openModal = () => {
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };


    const formatDate = (dateString: string) => dateString.split('-').reverse().join('/');

    const handleEmpresaNome = (razaoSocial: string | undefined): string => {
        if (!razaoSocial) return "";
        
        const match = razaoSocial.match(/(?:OTICO)\s+(.+)/i);
        return match ? match[1] : "";
    };

    const handleCaixaName = (nome: string | undefined): string => {
        const res = (nome?.includes("COFRE") ? "CAIXA COFRE" : "CAIXA NORMAL")
        return res;
    }


    const handleDateSelect = (date: string) => {
        if (!selectedStartDate || selectedEndDate) {
            setSelectedStartDate(date);
            setSelectedEndDate(null);
            setMarkedDates({
                [date]: { 
                    selected: true, 
                    startingDay: true, 
                    endingDay: true, 
                    color: colors.blue[600], 
                    textColor: "white" 
                },
            });
        } else {
            const start = new Date(selectedStartDate);
            const end = new Date(date);
    
            const realStart = start < end ? selectedStartDate : date;
            const realEnd = start < end ? date : selectedStartDate;
    
            setSelectedStartDate(realStart);
            setSelectedEndDate(realEnd);
    
            const rangeMarkedDates: any = {};
            let currentDate = new Date(realStart);
    
            while (currentDate <= new Date(realEnd)) {
                const formattedDate = currentDate.toISOString().split("T")[0];
                
                rangeMarkedDates[formattedDate] = {
                    selected: true,
                    color: formattedDate === realStart || formattedDate === realEnd 
                        ? colors.blue[600]
                        : colors.blue[400],
                    textColor: "white",
                    startingDay: formattedDate === realStart,
                    endingDay: formattedDate === realEnd,
                };
    
                currentDate.setDate(currentDate.getDate() + 1);
            }
    
            setMarkedDates(rangeMarkedDates);
        }
    };

    const handleUpdateDateFilter = () => {
        try {
            if (selectedStartDate && selectedEndDate) {
                const dateFilter: DateFilter = {
                    dataInicial: formatDate(selectedStartDate),
                    dataFinal: formatDate(selectedEndDate)
                }
    
                updateDateFilter(dateFilter)
            }
        } catch (err: any) {
            setError(`Erro ao salvar intervalo de data.`);
        } finally {
            closeModal();
        }
    }


    return (
        <SafeAreaView>
            <View style={styles.container}>
                <View style={styles.subcontainer}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1589282741585-30ab896335cd?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }}
                        style={styles.image}
                    />

                    <View style={styles.profileContainer}>
                        <Text style={styles.profileText}>
                            {selectedEmpresa ? handleEmpresaNome(selectedEmpresa?.RAZAO_EMP) : "Nenhuma empresa selecionada"}
                        </Text>
                        <Text style={styles.profileSubText}>
                            {selectedCaixa ? handleCaixaName(selectedCaixa?.DESC_CAI) : "Nenhum caixa selecionado"}
                        </Text>
                    </View>
                </View>

                <View style={styles.globalHeaderActions}>
                    <TouchableOpacity 
                        onPress={openModal} 
                        style={{padding: 5}}
                    >
                        <Feather name="calendar" size={20} color={colors.gray[500]} />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        onPress={() => router.push("/settings")} 
                        style={{paddingVertical: 5, paddingLeft: 5}}
                    >
                        <Feather name="settings" size={20} color={colors.gray[500]} />
                    </TouchableOpacity>
                </View>
            </View>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Calendar
                            style={{margin: 0}}
                            markedDates={markedDates}
                            onDayPress={({ dateString }: any) => handleDateSelect(dateString)}
                            markingType={"period"}
                            hideExtraDays
                            maxDate={new Date().toDateString()}
                            theme ={{
                                todayTextColor: colors.blue[500],
                                textMonthFontSize: 16,
                                textMonthFontWeight: 500,
                                arrowColor: colors.blue[500]
                            }}
                        />

                        <View style={styles.buttons}>
                            <TouchableOpacity 
                                onPress={closeModal} 
                                style={{flex: 1}}
                            >
                                <Text style={styles.footerCancelButton}>
                                    Cancelar
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                onPress={handleUpdateDateFilter} 
                                disabled={!selectedEndDate} 
                                style={{flex: 1}}
                            >
                                <Text style={[selectedEndDate ? styles.footerSubmitButton : styles.footerDisabledButton]}>
                                    Aplicar
                                </Text>
                            </TouchableOpacity>
                        </View>
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
        paddingTop: 30,
        paddingBottom: 12,
        backgroundColor: "#FFF"
    },
    subcontainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7
    },
    profileContainer: {
        flexDirection: "column", 
        alignItems: "flex-start", 
        gap: 1
    },
    profileText: {
        color: colors.gray[900],
        fontWeight: 500
    },
    profileSubText: {
        fontSize: 11, 
        color: colors.gray[500]
    },
    image: { 
        width: 35, 
        height: 35, 
        borderRadius: 50
    },
    globalHeaderActions: {
        flexDirection: "row", 
        alignItems: "center", 
        gap: 10
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modalContainer: {
        width: '92%',
        padding: 20,
        backgroundColor: '#FFF',
        borderRadius: 10
    },
    buttons: {
        flexDirection: "row", 
        alignItems: "center", 
        justifyContent: "space-between",
        marginTop: 40,
        gap: 10
    },
    footerCancelButton: {
        fontSize: 16,
        textAlign: "center",
        paddingHorizontal: 20,
        paddingVertical: 10,
        color: colors.gray[600],
        backgroundColor: colors.gray[200],
        borderRadius: 6
    },
    footerSubmitButton: {
        fontSize: 16,
        textAlign: "center",
        paddingHorizontal: 20,
        paddingVertical: 10,
        color: colors.blue[50],
        backgroundColor: colors.blue[600],
        borderRadius: 6
    },
    footerDisabledButton: {
        fontSize: 16,
        textAlign: "center",
        paddingHorizontal: 20,
        paddingVertical: 10,
        color: colors.gray[400],
        backgroundColor: "white",
        borderRadius: 6
    }
});
