import { ChartContainer } from '@/components/ChartContainer';
import { CustomBarChart } from '@/components/CustomBarChart';
import { ErrorMessage } from '@/components/ErrorMessage';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { PageTitle } from '@/components/PageTitle';
import { VendedoresChart } from '@/components/VendedoresChart';
import { useAuth } from '@/context/AuthContext';
import { useDashboardFilter } from '@/context/DashboardFilterContext';
import { useEmpresaCaixa } from '@/context/EmpresaCaixaContext';
import { AnaliseVendedor, EmpresaReports } from '@/models/company';
import { EmpresaService } from '@/services/empresa-service';
import { colors } from '@/utils/constants/colors';
import { UtilitiesService } from '@/utils/utilities-service';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';


export default function Index() {
    const {selectedRange} = useDashboardFilter();
    const {selectedEmpresa} = useEmpresaCaixa();
    const {authData} = useAuth();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const chartWidth = Dimensions.get("window").width - 50;
    const [clickedValue, setClickedValue] = useState<{label: string, value: string} | null>(null); 
    const [chartData, setChartData] = useState<{ labels: string[], sales: number[] }>({ labels: [], sales: [] });
    const [chartData2, setChartData2] = useState<{ month: string; value: number }[]>([]);
    const [chartData3, setChartData3] = useState<{ month: string; vendedores: AnaliseVendedor[] }[]>([]);
    

    useFocusEffect(
        useCallback(() => {
            setClickedValue(null);
            fetchReports();
        }, [selectedRange, selectedEmpresa])
    );


   const fetchReports = async () => {
        setLoading(true);
        setError(null)

        if (!selectedEmpresa) {
            setLoading(false);
            setError("Nenhuma empresa selecionada.");
            return;
        }

        try {
            const empresaService = new EmpresaService(authData?.accessToken);

            const params = {
                id: selectedEmpresa.COD_EMP,
                range: selectedRange
            };

            const data = await empresaService.getReports(params);
            buildCharts(data);

        } catch (err) {
            setError(`Error: Erro ao buscar relatórios.` + err);
        } finally {
            setLoading(false);
        }
    };


    function buildCharts(data: EmpresaReports) {
        if (!data || !data.relatorio) return;

        const labels = data.relatorio.map(item => UtilitiesService.monthNamesUpper[item.MES - 1]);
        const sales = data.relatorio.map(item => item.TOTAL_VENDAS);
        const dataChartValorVendas = {labels, sales}

        const dataChartQuantidadeVendas = data.relatorio.map(item => ({
            month: `${UtilitiesService.monthNamesUpper[item.MES - 1]} ${String(item.ANO).slice(-2)}`,
            value: item.QUANTIDADE_VENDAS,
        }));

        const dataChartVendedores = data.relatorio.map(item => ({
            month: `${UtilitiesService.monthNamesUpper[item.MES - 1]} ${String(item.ANO).slice(-2)}`, 
            vendedores: item.VENDEDORES
        }))

        setChartData(dataChartValorVendas);
        setChartData2(dataChartQuantidadeVendas);
        setChartData3(dataChartVendedores);
    }

    const formatValue = (value: number) => {
        if (value >= 1000000) {
            return (value / 1000000).toFixed(1) + 'M';
        } else if (value >= 1000) {
            return (value / 1000).toFixed(0) + 'k';
        }
        return value.toString();
    };

    const handleDataPointClick = (data: any) => {
        const label = chartData2[data.index].month;
        const value = UtilitiesService.formatarValor(data.value);
        setClickedValue({label: label, value: value});
    };


    if (loading) {
        return <LoadingIndicator />
    }


    return (
        <View style={{flex: 1}}>
            {error 
                ? (
                    <ErrorMessage error={error} />
                ) : (                         
                    <ScrollView 
                        style={styles.container} 
                        contentContainerStyle={{paddingBottom: 100}}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={{paddingHorizontal: 18, marginBottom: 10}}>
                            <PageTitle title="Dashboard" size="large" />
                        </View>

                        <ChartContainer
                            title='Quantidade de vendas'
                            icon='shopping-bag'
                            iconColor={colors.cyan[200]}
                            backgroundColor={colors.blue[500]}
                        >
                            {chartData2.length > 0 ? (
                                <CustomBarChart data={chartData2} />
                            ) : (
                                <Text style={styles.empty}>Sem registros</Text>
                            )}
                        </ChartContainer>

                        <ChartContainer
                            title='Receita de vendas'
                            icon='dollar-sign'
                            iconColor={colors.lime[200]}
                            backgroundColor={colors.green[500]}
                        >
                            {chartData.labels.length > 0 ? (
                                <View style={{position: "relative"}}>
                                    <View style={{paddingTop: 20}}>
                                        <LineChart
                                            data={{
                                                labels: chartData.labels,
                                                datasets: [{
                                                    data: chartData.sales
                                                }]
                                            }}
                                            width={chartWidth}
                                            height={300}
                                            onDataPointClick={handleDataPointClick}
                                            yAxisLabel="R$ "
                                            verticalLabelRotation={selectedRange >= 12 ? -70 : 0}
                                            formatYLabel={(value) => formatValue(Number(value))}
                                            yLabelsOffset={10}
                                            xLabelsOffset={10}
                                            fromZero
                                            bezier
                                            chartConfig={{
                                                backgroundColor: "#FFF",
                                                backgroundGradientFrom:"#FFF",
                                                backgroundGradientTo: "#FFF", 
                                                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                                labelColor: (opacity = 1) => `rgba(0, 0, 0, 0.5)`,
                                                propsForBackgroundLines: {
                                                    stroke: colors.slate[100],
                                                    strokeWidth: 1,
                                                    strokeDasharray: "0",
                                                },
                                                propsForHorizontalLabels: {
                                                    fontSize: 11
                                                },
                                                propsForVerticalLabels: {
                                                    fontSize: 9
                                                },
                                                propsForDots: {
                                                    r: "5",
                                                    fill: "#fff",
                                                    strokeWidth: "0.5",
                                                    stroke: colors.green[500],
                                                },
                                                fillShadowGradientFrom: colors.green[500],
                                                fillShadowGradientTo: colors.green[500],
                                                fillShadowGradientFromOpacity: 1,
                                                fillShadowGradientToOpacity: 0, 
                                                strokeWidth: 1
                                            }}
                                        />
                                    </View>

                                    {clickedValue !== null && (
                                        <View style={styles.selectedContainer}>
                                            <View style={styles.selectedIcon}></View>
                                            <Text style={styles.selectedText}>
                                                {clickedValue.value}
                                            </Text>
                                            <Text style={styles.selectedText}>
                                                ({clickedValue.label})
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            ) : (
                                <Text style={styles.empty}>Sem registros</Text>
                            )}
                        </ChartContainer>

                        <ChartContainer
                            title='Análise dos vendedores'
                            icon='users'
                            iconColor={colors.pink[200]}
                            backgroundColor={colors.purple[500]}
                        >
                            {chartData3.length > 0 ? (
                                <VendedoresChart data={chartData3} />
                            ) 
                            : (
                                <Text style={styles.empty}>Sem registros</Text>
                            )}
                        </ChartContainer>
                    </ScrollView>
                )
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 50
    },
    scrollToTopButton: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    selectedText: {
        color: colors.slate[500],
        fontSize: 12
    },
    selectedContainer: {
        position: 'absolute',
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        top: -20,
        left: 20,
    },
    selectedIcon: {
        width: 7,
        height: 7,
        borderRadius: 60,
        backgroundColor: colors.green[500]
    },
    empty: {
        textAlign: "center", 
        paddingBottom: 50, 
        fontWeight: 300,
        fontSize: 13,
        color: colors.slate[500]
    }
});
