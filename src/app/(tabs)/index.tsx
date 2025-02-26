import { ErrorMessage } from '@/components/ErrorMessage';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { useEmpresa } from '@/context/EmpresaContext';
import { EmpresaReports } from '@/models/company';
import { EmpresaService } from '@/services/empresa-service';
import { colors } from '@/utils/constants/colors';
import { UtilitiesService } from '@/utils/utilities-service';
import { Feather } from '@expo/vector-icons';
import { LinearGradient, vec, Text as SKText, useFont } from '@shopify/react-native-skia';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useDerivedValue } from 'react-native-reanimated';
import { Bar, CartesianChart, useChartPressState } from 'victory-native';

const inter = require('@/assets/fonts/inter.ttf')

export default function Index() {
    const [DATA1, setDATA1] = useState<{label: string, count:number}[]>([]) 
    const [DATA2, setDATA2] = useState<{label: string, total:number}[]>([])


    const font = useFont(inter, 12)

    const { selectedCompany } = useEmpresa();

    const { state: state1, isActive: isActive1 } = useChartPressState({
        x: "Jan",
        y: { count: 0 }
    });
    
    const { state: state2, isActive: isActive2 } = useChartPressState({
        x: "Jan",
        y: { total: 0 }
    });
    

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setDATA1([]);
        setDATA2([]);
        fetchReports();
    }, [selectedCompany])

   const fetchReports = async () => {
        setLoading(true);
        setError(null)

        try {
            const empresaService = new EmpresaService();
            const empId = selectedCompany?.COD_EMP || 0
            const data = await empresaService.getReports(empId);

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
        if (!data || !data.totalVendasMensal) return;
       
        const formattedData1 = data.totalVendasMensal.map(report => ({
            label: UtilitiesService.monthNames[report.MES - 1],
            count: report.QUANTIDADE_VENDAS || 0
        }));
    
        const formattedData2 = data.totalVendasMensal.map(report => ({
            label: UtilitiesService.monthNames[report.MES - 1],
            total: report.TOTAL_VENDAS || 0
        }));
        
        setDATA1(formattedData1);
        setDATA2(formattedData2);
    };
    



    const value1 = useDerivedValue(() => {
        return `${state1.y.count.value.value}`;
    }, [state1]);

    const value2 = useDerivedValue(() => {
        return `R$ ${state2.y.total.value.value}`;
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



    if (loading) {
        return <LoadingIndicator />;
    }

    if (error) {
        return <ErrorMessage error={error} />;
    }

    return (
        <ScrollView style={styles.container}  contentContainerStyle={{paddingBottom: 100}}>
            <Text style={styles.title}>Dashboard</Text>

            <TouchableOpacity style={styles.datePickerElement}>
                <Feather style={{marginRight: 4}} name="calendar" size={20} color={colors.slate[500]} />
                <Text style={styles.datePickerLabel}>Últimos 6 meses</Text>
            </TouchableOpacity>

            <View style={{flex: 1, gap: 40, marginBottom: 30}}>
                { DATA1 && DATA1.length > 0  ? (
                    <View style={{height: 280}}>
                        <View style={styles.chartHeader}>
                            <Feather style={[styles.chartHeaderIcon, {backgroundColor: colors.sky[400]}]} name="shopping-bag" size={20} />
                            <View>
                                <Text style={styles.subTitle}>
                                    Quantidade de vendas
                                </Text>
                                <Text style={styles.descricao}>Últimos 6 meses</Text>
                            </View>
                        </View>

                        <CartesianChart
                            data={DATA1}
                            chartPressState={state1}
                            xKey="label"
                            yKeys={["count"]}
                            domainPadding={{ left: 30, right: 30, top: 50 }}
                            axisOptions={{
                                lineColor: colors.slate[200],
                                labelColor: colors.slate[500],
                                tickCount: {
                                    x: 7,
                                    y: 5
                                },
                                font: font ? font : undefined,
                                formatXLabel(value) {
                                    return value
                                },
                            }}
                            >
                            {({ points, chartBounds }) => (
                                <>
                                    <Bar
                                        chartBounds={chartBounds}
                                        points={points.count}
                                        roundedCorners={{
                                            topLeft: 5,
                                            topRight: 5,
                                    }}
                                    >
                                        <LinearGradient
                                            start={vec(0, 0)}
                                            end={vec(0, 400)}
                                            colors={["#0ea5e9", "#0ea5e900"]}
                                        />
                                    </Bar>
                                    { isActive1 ? 
                                        <>
                                            <SKText
                                                font={font}
                                                x={textXPosition1}
                                                y={textYPosition1}
                                                text={value1}
                                                color={colors.sky[500]}
                                            />
                                        </>    
                                    : null}
                                </>
                            )}
                        </CartesianChart>
                    </View>
                ) : (
                    <LoadingIndicator />
                ) }
            </View>

            <View style={{flex: 1, gap: 40}}>
                { DATA2 && DATA2.length > 0  ? (
                    <View style={{height: 280}}>
                        <View style={styles.chartHeader}>
                            <Feather style={[styles.chartHeaderIcon, {backgroundColor: colors.emerald[400]}]} name="dollar-sign" size={20} />
                            <View>
                                <Text style={styles.subTitle}>
                                    Receita de vendas
                                </Text>
                                <Text style={styles.descricao}>Últimos 6 meses</Text>
                            </View>
                        </View>

                        <CartesianChart
                            data={DATA2}
                            chartPressState={state2}
                            xKey="label"
                            yKeys={["total"]}
                            domainPadding={{ left: 30, right: 30, top: 50 }}
                            axisOptions={{
                                lineColor: colors.slate[200],
                                labelColor: colors.slate[500],
                                tickCount: {
                                    x: 7,
                                    y: 5
                                },
                                font: font ? font : undefined,
                                formatXLabel(value) {
                                    return value
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
                                            topLeft: 5,
                                            topRight: 5,
                                    }}
                                    >
                                        <LinearGradient
                                            start={vec(0, 0)}
                                            end={vec(0, 400)}
                                            colors={["#10b981", "#10b98100"]}
                                        />
                                    </Bar>
                                    { isActive2 ? 
                                        <>
                                            <SKText
                                                font={font}
                                                x={textXPosition2}
                                                y={textYPosition2}
                                                text={value2}
                                                color={colors.emerald[500]}
                                            />
                                        </>    
                                    : null}
                                </>
                            )}
                        </CartesianChart>
                    </View>
                ) : (
                    <LoadingIndicator />
                ) }
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 50,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        marginBottom: 10
    },
    subTitle: {
        color: colors.slate[900], 
        fontWeight: 500, 
        fontSize: 18
    },
    descricao: {
        color: colors.slate[500],  
        fontSize: 14
    },
    chartHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10, 
        marginBottom: 15
    },
    chartHeaderIcon: {
        padding: 7,
        borderRadius: 10,
        color: "#FFF"
    },
    datePickerElement: {
        padding: 5,
        flexDirection: 'row',
        borderWidth: 0.5,
        alignItems: 'center',
        borderColor: colors.slate[400],
        alignSelf: 'flex-start',
        borderRadius: 5,
        gap: 3,
        backgroundColor: colors.slate[100],
        marginBottom: 30
    },
    datePickerLabel: {
        fontSize: 15,
        fontWeight: 500,
        color: colors.slate[500],
    },
});