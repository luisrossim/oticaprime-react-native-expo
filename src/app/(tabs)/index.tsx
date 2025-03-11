import { ErrorMessage } from '@/components/ErrorMessage';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { PageTitle } from '@/components/PageTitle';
import { useAuth } from '@/context/AuthContext';
import { useEmpresaCaixa } from '@/context/EmpresaCaixaContext';
import { EmpresaReports } from '@/models/company';
import { dashboardFilterData } from '@/models/data/dashboardFilter';
import { EmpresaService } from '@/services/empresa-service';
import { colors } from '@/utils/constants/colors';
import { UtilitiesService } from '@/utils/utilities-service';
import { Feather } from '@expo/vector-icons';
import { LinearGradient, vec, Text as SKText, useFont } from '@shopify/react-native-skia';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Modal } from 'react-native';
import { useDerivedValue } from 'react-native-reanimated';
import { Bar, CartesianChart, useChartPressState } from 'victory-native';

const inter = require('@/assets/fonts/inter.ttf')

export default function Index() {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedRange, setSelectedRange] = useState<number>(12);
    const { selectedEmpresa } = useEmpresaCaixa();

    const font = useFont(inter, 12)

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [DATA1, setDATA1] = useState<{label: string, count:number}[]>([]) 
    const [DATA2, setDATA2] = useState<{label: string, total:number}[]>([])

    const { state: state1, isActive: isActive1 } = useChartPressState({
        x: "Jan",
        y: { count: 0 }
    });
    
    const { state: state2, isActive: isActive2 } = useChartPressState({
        x: "Jan",
        y: { total: 0 }
    });


    useEffect(() => {
        setDATA1([]);
        setDATA2([]);
        fetchReports();
    }, [selectedRange, selectedEmpresa])


   const fetchReports = async () => {
        setLoading(true);
        setError(null)

        if (!selectedEmpresa) {
            setLoading(false);
            setError("Nenhuma empresa selecionada.");
            return;
        }

        try {
            const empresaService = new EmpresaService();

            const params = {
                id: selectedEmpresa.COD_EMP,
                range: selectedRange
            };

            const data = await empresaService.getReports(params);

            if (data) {
                buildCharts(data);
            }

        } catch (err) {
            setError(`Erro ao buscar relatórios.`);
        } finally {
            setLoading(false);
        }
    };

    const buildCharts = (data: EmpresaReports) => {
        if (!data || !Array.isArray(data.totalVendasMensal)) return;
        
        const formattedData1 = data.totalVendasMensal.map(report => ({
            label: report.MES && report.MES >= 1 && report.MES <= 12 
                ? UtilitiesService.monthNames[report.MES - 1] 
                : "Desconhecido",
            count: report.QUANTIDADE_VENDAS ?? 0
        }));
    
        const formattedData2 = data.totalVendasMensal.map(report => ({
            label: report.MES && report.MES >= 1 && report.MES <= 12 
                ? UtilitiesService.monthNames[report.MES - 1] 
                : "Desconhecido",
            total: report.TOTAL_VENDAS ?? 0
        }));
    
        setDATA1(formattedData1);
        setDATA2(formattedData2);
    };
    

    const handleSelectRange = (range: number) => {
        setSelectedRange(range);
        setModalVisible(false);
    };


    const value1 = useDerivedValue(() => {
        return state1.y.count.value?.value ? `${state1.y.count.value.value}` : "0";
    }, [state1]);
    
    const value2 = useDerivedValue(() => {
        return state2.y.total.value?.value ? `R$ ${state2.y.total.value.value}` : "R$ 0";
    }, [state2]);

    const textYPosition1 = useDerivedValue(() => {
        return state1.y.count.position.value - 15;
    }, [state1]);

    const textYPosition2 = useDerivedValue(() => {
        return state2.y.total.position.value - 15;
    }, [state2]);

    const textXPosition1 = useDerivedValue(() => {
        if(!font) {
            return 0;
        }
        
        return (
            state1.x.position.value - font.measureText(value1.value).width / 2
        );
    }, [state1, font]);

    const textXPosition2 = useDerivedValue(() => {
        if(!font) {
            return 0;
        }
        
        return (
            state2.x.position.value - font.measureText(value2.value).width / 2
        );
    }, [state2, font]);


    const formatRange = (selectedRange: number | null) => {
        if (selectedRange === null) return "Selecionar período";
        if (selectedRange === 0) return "Mês atual";
        if (selectedRange === 1) return "Mês passado";
        return `${selectedRange} meses`;
    };


    if (loading) {
        return <LoadingIndicator />
    }


    return (
        <ScrollView style={styles.container}  contentContainerStyle={{paddingBottom: 100}}>
            <PageTitle title="Dashboard" size="large" />

            {error && (
                <ErrorMessage error={error} />
            )}

            <TouchableOpacity style={styles.datePickerElement} onPress={() => setModalVisible(true)}>
                <Feather style={{marginRight: 4}} name="calendar" size={20} color={colors.gray[500]} />
                <Text style={styles.datePickerLabel}>
                    {formatRange(selectedRange)}
                </Text>
            </TouchableOpacity>

            <View style={{flex: 1, gap: 20, marginBottom: 50}}>
                <View style={styles.chartHeader}>
                    <Feather style={[styles.chartHeaderIcon, {backgroundColor: colors.blue[700]}]} name="shopping-bag" size={22} />
                    <View>
                        <Text style={styles.subTitle}>
                            Quantidade de vendas
                        </Text>
                        <Text style={styles.descricao}>
                            {formatRange(selectedRange)}
                        </Text>
                    </View>
                </View>
                
                { DATA1 && DATA1.length > 0  ? (
                    <View style={{height: 300}}>
                        <CartesianChart
                            data={DATA1}
                            chartPressState={state1}
                            xKey="label"
                            yKeys={["count"]}
                            domainPadding={{ left: 30, right: 30, top: 70, bottom: 50 }}
                            axisOptions={{
                                lineColor: colors.gray[200],
                                labelColor: colors.gray[500],
                                tickCount: {
                                    x: selectedRange || 1,
                                    y: 5
                                },
                                font: font ? font : undefined,
                                formatXLabel(value) {
                                    return value || ""
                                },
                            }}
                            >
                            {({ points, chartBounds }) => (
                                <>
                                    <Bar
                                        chartBounds={chartBounds}
                                        points={points.count}
                                        roundedCorners={{
                                            topLeft: 3,
                                            topRight: 3,
                                    }}
                                    >
                                        <LinearGradient
                                            start={vec(0, 0)}
                                            end={vec(0, 600)}
                                            colors={["#1d4ed8", "#1d4ed800"]}
                                        />
                                    </Bar>
                                    { isActive1 ? 
                                        <>
                                            <SKText
                                                font={font}
                                                x={textXPosition1}
                                                y={textYPosition1}
                                                text={value1}
                                                color={"#1d4ed8"}
                                            />
                                        </>    
                                    : null}
                                </>
                            )}
                        </CartesianChart>
                    </View>
                ) : (
                    <View style={styles.chartEmpty}>
                        <Text style={{color: colors.gray[500]}}>Não há registros</Text>
                    </View>
                ) }
            </View>

            <View style={{flex: 1, gap: 20}}>
                <View style={styles.chartHeader}>
                    <Feather style={[styles.chartHeaderIcon, {backgroundColor: colors.green[500]}]} name="dollar-sign" size={22} />
                    <View>
                        <Text style={styles.subTitle}>
                            Receita de vendas
                        </Text>
                        <Text style={styles.descricao}>
                            {formatRange(selectedRange)}
                        </Text>
                    </View>
                </View>

                { DATA2 && DATA2.length > 0  ? (
                    <View style={{height: 300}}>
                        <CartesianChart
                            data={DATA2}
                            chartPressState={state2}
                            xKey="label"
                            yKeys={["total"]}
                            domainPadding={{ left: 30, right: 30, top: 70, bottom: 50 }}
                            axisOptions={{
                                lineColor: colors.gray[200],
                                labelColor: colors.gray[500],
                                tickCount: {
                                    x: selectedRange || 1,
                                    y: 5
                                },
                                font: font ? font : undefined,
                                formatXLabel(value) {
                                   return value || ""
                                },
                                formatYLabel(value){
                                    if (value >= 1000) {
                                        return (value / 1000).toFixed(0) + 'k';
                                    }

                                    return `R$ ${value}`
                                }
                            }}
                            >
                            {({ points, chartBounds }) => (
                                <>
                                    <Bar
                                        chartBounds={chartBounds}
                                        points={points.total}
                                        roundedCorners={{
                                            topLeft: 3,
                                            topRight: 3,
                                    }}
                                    >
                                        <LinearGradient
                                            start={vec(0, 0)}
                                            end={vec(0, 600)}
                                            colors={["#22c55e", "#22c55e00"]}
                                        />
                                    </Bar>
                                    { isActive2 ? 
                                        <>
                                            <SKText
                                                font={font}
                                                x={textXPosition2}
                                                y={textYPosition2}
                                                text={value2}
                                                color={"#22c55e"}
                                            />
                                        </>    
                                    : null}
                                </>
                            )}
                        </CartesianChart>
                    </View>
                ) : (
                    <View style={styles.chartEmpty}>
                        <Text style={{color: colors.gray[500]}}>Não há registros</Text>
                    </View>
                ) }
            </View>

            <Modal animationType="fade" transparent={true} visible={modalVisible}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Selecionar Período</Text>

                        {dashboardFilterData.map((filter, index) => (
                            <TouchableOpacity 
                                key={index}
                                style={[styles.option, (selectedRange == filter.range) ? styles.optionSelected : "" ]} 
                                onPress={() => handleSelectRange(filter.range)}
                            >
                                <Feather style={{marginRight: 4}} name="calendar" size={25} color={colors.gray[600]} />
                                <View style={{flexDirection: "column", gap: 1}}>
                                    <Text style={styles.optionLabel}>{filter.label}</Text>
                                    <Text style={styles.optionSubLabel}>{filter.sublabel}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}

                        <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                            <Text style={styles.cancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 50,
        backgroundColor: "#FFF"
    },
    subTitle: {
        color: colors.gray[700], 
        fontWeight: 500, 
        fontSize: 18
    },
    descricao: {
        color: colors.gray[500],
        fontWeight: 300,
        fontSize: 14
    },
    chartHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    chartHeaderIcon: {
        padding: 5,
        borderRadius: 7,
        color: "#FFF"
    },
    datePickerElement: {
        padding: 5,
        flexDirection: 'row',
        borderWidth: 0.5,
        alignItems: 'center',
        borderColor: colors.gray[400],
        alignSelf: 'flex-start',
        borderRadius: 5,
        gap: 3,
        marginBottom: 40,
        marginTop: 5
    },
    datePickerLabel: {
        fontSize: 15,
        fontWeight: 500,
        color: colors.gray[500],
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
        backgroundColor: "#FFF",
        padding: 26,
        borderRadius: 10,
        width: "90%"
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 700,
        color: colors.gray[800],
        marginBottom: 20,
    },
    option: {
        paddingVertical: 15,
        paddingHorizontal: 7,
        width: "100%",
        borderBottomWidth: 0.5,
        borderBottomColor: colors.gray[300],
        flexDirection: "row",
        alignItems: "center",
        gap: 5

    },
    optionLabel: {
        fontSize: 15,
        color: colors.gray[600],
        fontWeight: 500,
        marginBottom: 3
    },
    optionSubLabel: {
        fontSize: 12,
        fontWeight: 400,
        color: colors.gray[400],
    },
    optionSelected: {
        backgroundColor: colors.gray[100]
    },
    cancelButton: {
        marginTop: 30,
        padding: 10,
        width: "100%",
        alignItems: "center",
    },
    cancelButtonText: {
        fontSize: 15,
        color: colors.gray[700],
    },
    chartEmpty: {
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center", 
        height: 300,
        borderWidth: 0.5,
        borderColor: colors.gray[300]
    }
});