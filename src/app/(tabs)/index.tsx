import { ErrorMessage } from '@/components/ErrorMessage';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { PageTitle } from '@/components/PageTitle';
import { useAuth } from '@/context/AuthContext';
import { useDashboardFilter } from '@/context/DashboardFilterContext';
import { useEmpresaCaixa } from '@/context/EmpresaCaixaContext';
import { EmpresaReports } from '@/models/company';
import { EmpresaService } from '@/services/empresa-service';
import { colors } from '@/utils/constants/colors';
import { UtilitiesService } from '@/utils/utilities-service';
import { Feather, FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient, vec, Text as SKText, useFont } from '@shopify/react-native-skia';
import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Animated } from 'react-native';
import { useDerivedValue } from 'react-native-reanimated';
import { Bar, CartesianChart, useChartPressState } from 'victory-native';

const inter = require('@/assets/fonts/inter.ttf')

export default function Index() {
    const {selectedRange} = useDashboardFilter();

    const {selectedEmpresa} = useEmpresaCaixa();
    const {authData} = useAuth();
    const font = useFont(inter, 12);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const scrollY = useRef(new Animated.Value(0)).current;
    const scrollViewRef = useRef<ScrollView>(null);

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
        scrollY.setValue(0); 
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
            const empresaService = new EmpresaService(authData?.accessToken);

            const params = {
                id: selectedEmpresa.COD_EMP,
                range: selectedRange
            };

            const data = await empresaService.getReports(params);

            if (data) {
                buildCharts(data);
            }

        } catch (err) {
            setError(`Error: Erro ao buscar relatórios.` + err);
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

    const maxValue1 = Math.max(...DATA1.map(d => d.count), 1);
    const maxValue2 = Math.max(...DATA2.map(d => d.total), 1);


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
        <View style={{flex: 1}}>
            <Animated.View 
                style={[styles.navBar, { 
                    transform: [{
                        translateY: scrollY.interpolate({
                            inputRange: [100, 200],
                            outputRange: [-100, 0], 
                            extrapolate: 'clamp'
                        })
                    }]
                }]}
            > 
                <Text style={styles.navBarTitle}>
                    Dashboard
                </Text>
                <TouchableOpacity 
                    style={styles.scrollToTopButton} 
                    onPress={() => scrollViewRef.current?.scrollTo({y: 0, animated: true})}
                >
                    <Feather name="chevron-up" size={18} color={colors.gray[200]} />
                </TouchableOpacity>
            </Animated.View>
                
            <Animated.ScrollView 
                style={styles.container} 
                contentContainerStyle={{paddingBottom: 100}}
                ref={scrollViewRef}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true }
                )} 
            >
                <PageTitle title="Dashboard" size="large" />

                {error 
                    ? (
                        <ErrorMessage error={error} />
                    ) : (
                        <>
                            <View style={{flex: 1, gap: 20, marginBottom: 50, marginTop: 10}}>
                                <View style={styles.chartHeader}>
                                    <FontAwesome6 
                                        style={[styles.chartHeaderIcon, {
                                            backgroundColor: colors.blue[600],
                                            color: colors.blue[200]
                                        }]} 
                                        name="tags" 
                                        size={20} 
                                        />
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
                                            domainPadding={{ left: 30, right: 30, top: 50, bottom: 0 }}
                                            domain={{ 
                                                x: DATA1.length === 1 ? [-0.5, 0.5] : DATA1.length === 2 ? [-0.25, 1.25] : [0, DATA1.length - 1],
                                                y: [0, Math.max(5, maxValue1)]
                                            }}
                                            axisOptions={{
                                                lineColor: colors.gray[200],
                                                labelColor: colors.gray[500],
                                                labelOffset: {x: 0, y: 5},
                                                tickCount: { x: Math.min(selectedRange || 1, 10), y: 5 },
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
                                                        blendMode='darken'
                                                        barWidth={Math.max(10, 40 - selectedRange * 2)}
                                                        roundedCorners={{
                                                            topLeft: 3,
                                                            topRight: 3,
                                                        }}
                                                    >
                                                        <LinearGradient
                                                            start={vec(0, 0)}
                                                            end={vec(0, 600)}
                                                            colors={["#2563eb", "#2563eb00"]}
                                                        />
                                                    </Bar>
                                                    { isActive1 ? 
                                                        <>
                                                            <SKText
                                                                font={font}
                                                                x={textXPosition1}
                                                                y={textYPosition1}
                                                                text={value1}
                                                                color={"#2563eb"}
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
                                    <FontAwesome6 
                                        style={[styles.chartHeaderIcon, {
                                            backgroundColor: colors.emerald[600],
                                            color: colors.emerald[200]
                                        }]} 
                                        name="sack-dollar" 
                                        size={20}
                                    />
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
                                            domainPadding={{ left: 30, right: 30, top: 50, bottom: 0 }}
                                            domain={{ 
                                                x: DATA2.length === 1 ? [-0.5, 0.5] : DATA2.length === 2 ? [-0.25, 1.25] : [0, DATA2.length - 1],
                                                y: [0, Math.max(5, maxValue2)]
                                            }}
                                            axisOptions={{
                                                lineColor: colors.gray[200],
                                                labelColor: colors.gray[500],
                                                labelOffset: {x: 0, y: 5},
                                                tickCount: { x: Math.min(selectedRange || 1, 10), y: 5 },
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
                                                        blendMode='darken'
                                                        barWidth={Math.max(10, 40 - selectedRange * 2)}
                                                        roundedCorners={{
                                                            topLeft: 3,
                                                            topRight: 3,
                                                        }}
                                                    >
                                                        <LinearGradient
                                                            start={vec(0, 0)}
                                                            end={vec(0, 600)}
                                                            colors={["#059669", "#05966900"]}
                                                        />
                                                    </Bar>
                                                    { isActive2 ? 
                                                        <>
                                                            <SKText
                                                                font={font}
                                                                x={textXPosition2}
                                                                y={textYPosition2}
                                                                text={value2}
                                                                color={"#059669"}
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
                        </>
                    )
                }
            </Animated.ScrollView>
        </View>
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
        padding: 7,
        borderRadius: 7,
        color: "#FFF"
    },
    chartEmpty: {
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center", 
        height: 300,
        borderWidth: 0.5,
        borderColor: colors.gray[300]
    },
    scrollToTopButton: {
        position: 'absolute',
        right: 16,
        bottom: 8,
        padding: 5,
        borderRadius: 20,
    },
    navBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 45,
        backgroundColor: colors.slate[600],
        justifyContent: 'center',
        paddingHorizontal: 20,
        zIndex: 10
    },
    navBarTitle: {
        color: colors.gray[200],
        fontWeight: 600
    },
});