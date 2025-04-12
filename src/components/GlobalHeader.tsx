import React, { useState } from "react";
import { colors } from "@/utils/constants/colors";
import { View, StyleSheet, SafeAreaView, Text, TouchableOpacity, Modal, Image } from "react-native";
import { useEmpresaCaixa } from "@/context/EmpresaCaixaContext";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { UtilitiesService } from "@/utils/utilities-service";
import { DateFilter } from "@/models/dates";
import { useDateFilter } from "@/context/DateFilterContext";
import { dashboardFilterData } from "@/models/data/dashboardFilter";
import { useDashboardFilter } from "@/context/DashboardFilterContext";
import { usePathname } from 'expo-router';

LocaleConfig.locales['pt-br'] = UtilitiesService.ptBR
LocaleConfig.defaultLocale = 'pt-br';

export function GlobalHeader() {
    const {selectedEmpresa, selectedCaixa} = useEmpresaCaixa();
    const {dateFilter, updateDateFilter} = useDateFilter();
    const {selectedRange, setSelectedRange} = useDashboardFilter();

    const [selectedStartDate, setSelectedStartDate] = useState<string | null>(null);
    const [selectedEndDate, setSelectedEndDate] = useState<string | null>(null);
    const [markedDates, setMarkedDates] = useState<any>({});

    const [modalDateVisible, setModalDateVisible] = useState(false);
    const [modalChartVisible, setModalChartVisible] = useState(false);

    const [error, setError] = useState<string | null>(null);

    const pathname = usePathname();

    
    const openModalDate = () => {
        setModalDateVisible(true);
    };

    const closeModalDate = () => {
        setModalDateVisible(false);
    };

    const openModalChart = () => {
        setModalChartVisible(true);
    };

    const closeModalChart = () => {
        setModalChartVisible(false);
    };

    const formatDate = (dateString: string) => dateString.split('-').reverse().join('/');

    const firstMarkedDate = Object.keys(markedDates).length > 0 
        ? Object.keys(markedDates).sort()[0]
        : new Date().toISOString().split("T")[0];

    const handeRangeText = (): string => {
        if (!selectedRange){
            return "";
        }

        return `${String(selectedRange)} MESES`
    }

    const handleDateText = (): string => {
        if (!dateFilter) {
          return "?";
        }
      
        const dataInicial = UtilitiesService.formatDateToUpper(String(dateFilter.dataInicial));
        const dataFinal = UtilitiesService.formatDateToUpper(String(dateFilter.dataFinal));
      
        if (dateFilter.dataInicial === dateFilter.dataFinal) {
          return dataInicial;
        }
      
        return `${dataInicial} - ${dataFinal}`;
    };

    const handleDateSelect = (date: string) => {
        if (!selectedStartDate || selectedEndDate) {
            setSelectedStartDate(date);
            setSelectedEndDate(null);
            setMarkedDates({
                [date]: { 
                    selected: true, 
                    startingDay: true, 
                    endingDay: true, 
                    color: colors.blue[400], 
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
                        : colors.blue[500],
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
            closeModalDate();
        }
    }

    const handleSelectRange = (range: number) => {
        setSelectedRange(range);
        setModalChartVisible(false);
    };



    return (
        <SafeAreaView>
            <View style={styles.container}>
                <View style={styles.subcontainer}>
                    <View style={{backgroundColor: colors.blue[700], justifyContent: "center", padding: 7, borderRadius: 60}}>
                        <Image source={require("@/assets/company.png")} style={styles.companyIcon} />
                    </View>

                    <View style={styles.profileContainer}>
                        <View style={{flexDirection: "row", alignItems: "center", gap: 3}}>
                            <Text style={styles.profileText}>
                                { selectedEmpresa?.RAZAO_EMP 
                                    ? UtilitiesService.handleEmpresaName(selectedEmpresa.RAZAO_EMP) 
                                    : "?"
                                }
                            </Text>
                            
                            <Text style={styles.profileSubText}>
                                { selectedCaixa?.DESC_CAI 
                                    ? UtilitiesService.handleCaixaName(selectedCaixa.DESC_CAI) 
                                    : "?"
                                }
                            </Text>
                        </View>
                        <Text style={styles.dateText}>
                            {pathname === '/' ? handeRangeText() : handleDateText()}
                        </Text>
                    </View>
                </View>

                <View style={styles.globalHeaderActions}>
                    {pathname === '/' ? (
                        <TouchableOpacity 
                            onPress={openModalChart} 
                            style={{padding: 8}}
                        >
                            <Feather name="bar-chart-2" size={20} color={colors.slate[600]} />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity 
                            onPress={openModalDate} 
                            style={{padding: 8}}
                        >
                            <Feather name="calendar" size={20} color={colors.slate[600]} />
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity 
                        onPress={() => router.push("/settings")} 
                        style={{paddingVertical: 8, paddingLeft: 8}}
                    >
                        <Feather name="settings" size={20} color={colors.slate[600]} />
                    </TouchableOpacity>
                </View>
            </View>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalDateVisible}
                onRequestClose={closeModalDate}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Calendário</Text>
                        <Text style={styles.modalSubTitle}>Acompanhe caixas, vendas, recebimentos e processos liberados.</Text>

                        <Calendar
                            style={{margin: 0}}
                            markedDates={markedDates}
                            onDayPress={({ dateString }: any) => handleDateSelect(dateString)}
                            markingType={"period"}
                            initialDate={firstMarkedDate} 
                            hideExtraDays
                            theme ={{
                                todayTextColor: colors.blue[500],
                                textMonthFontSize: 16,
                                textMonthFontWeight: 500,
                                arrowColor: colors.blue[500]
                            }}
                        />

                        <View style={styles.buttons}>
                            <TouchableOpacity 
                                onPress={closeModalDate} 
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

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalChartVisible}
                onRequestClose={closeModalChart}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Dashboard</Text>
                        <Text style={styles.modalSubTitle}>Selecione um período e acompanhe os gráficos em tempo real.</Text>
                            
                        {dashboardFilterData.map((filter, index) => (
                            <TouchableOpacity 
                                key={index}
                                style={[styles.option, (selectedRange == filter.range) && styles.optionSelected]} 
                                onPress={() => {handleSelectRange(filter.range)}}
                            >
                                <Text style={(selectedRange == filter.range) ? styles.optionLabelSelected : styles.optionLabel}>
                                    {filter.label}
                                </Text>
                            </TouchableOpacity>
                        ))}

                        <View style={styles.buttons}>
                            <TouchableOpacity 
                                onPress={closeModalChart} 
                                style={{flex: 1}}
                            >
                                <Text style={styles.footerCancelButton}>
                                    Cancelar
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
        borderBottomWidth: 1,
        borderBottomColor: colors.slate[200],
        paddingHorizontal: 18,
        paddingTop: 35,
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
        gap: 2
    },
    profileText: {
        fontSize: 12,
        fontWeight: 600,
        color: colors.slate[800]
    },
    profileSubText: {
        fontSize: 11, 
        fontWeight: 400,
        color: colors.slate[500]
    },
    globalHeaderActions: {
        flexDirection: "row", 
        alignItems: "center",
        gap: 5
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
        borderRadius: 20
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
        paddingVertical: 12,
        color: colors.slate[500],
        backgroundColor: colors.slate[100],
        borderRadius: 60
    },
    footerSubmitButton: {
        fontSize: 16,
        textAlign: "center",
        paddingHorizontal: 20,
        paddingVertical: 12,
        color: colors.cyan[100],
        backgroundColor: colors.blue[700],
        borderRadius: 60
    },
    footerDisabledButton: {
        fontSize: 16,
        textAlign: "center",
        paddingHorizontal: 20,
        paddingVertical: 10,
        color: colors.slate[400],
        backgroundColor: "white",
        borderRadius: 6
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 600,
        color: colors.slate[800],
        marginBottom: 6,
    },
    modalSubTitle: {
        fontWeight: 300,
        color: colors.slate[500], 
        marginBottom: 24,
    },
    optionLabel: {
        color: colors.slate[500]
    },
    optionLabelSelected: {
        color: colors.cyan[50]
    },
    optionSelected: {
        backgroundColor: colors.blue[700],
        borderRadius: 60
    },
    option: {
        width: "100%",
        paddingHorizontal: 12,
        padding: 13,
        marginVertical: 2,
        borderRadius: 60
    },
    dateText: {
        fontWeight: 500,
        color: colors.blue[600],
        fontSize: 11
    },
    companyIcon: {
        width: 18,
        height: 18
    },
});
