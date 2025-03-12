import { ErrorMessage } from '@/components/ErrorMessage';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { PageTitle } from '@/components/PageTitle'
import { useEmpresaCaixa } from '@/context/EmpresaCaixaContext';
import { CaixaDetails } from '@/models/caixa';
import { CaixaService } from '@/services/caixa-service';
import { colors } from '@/utils/constants/colors';
import { useEffect, useState } from 'react'
import { View, StyleSheet, Text, ScrollView } from 'react-native'
import { LineChart } from '@/components/LineChart';
import { UtilitiesService } from '@/utils/utilities-service';
import { LineDetail, LineDetailButton } from '@/components/LineDetail';
import SectionTitle from '@/components/SectionTitle';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useDateFilter } from '@/context/DateFilterContext';

export default function Caixa(){
    const [caixaDetails, setCaixaDetails] = useState<CaixaDetails | null>(null);
    const {selectedCaixa, selectedEmpresa} = useEmpresaCaixa();
    const {dateFilter} = useDateFilter();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        setCaixaDetails(null)
        fetchCaixaDetails();
    }, [selectedEmpresa, selectedCaixa, dateFilter])


    const fetchCaixaDetails = async () => {
        setLoading(true);
        setError(null);

        if(!selectedCaixa || !selectedEmpresa) {
            setLoading(false);
            setError("Nenhum caixa selecionado.");
            return;
        }

        try {
            const params = {
                caixaId: selectedCaixa.COD_CAI,
                empId: selectedEmpresa.COD_EMP,
                dataInicial: dateFilter?.dataInicial,
                dataFinal: dateFilter?.dataFinal
            }

            const caixaService = new CaixaService();
            const result = await caixaService.getCaixaDetails(params);
            
            if(result) {
                setCaixaDetails(result);
            }

        } catch (err) {
            setError("Erro ao buscar detalhes do caixa.");
        } finally {
            setLoading(false);
        }
    }

    function handleContasReceber(){
        router.navigate("/recebimentos");
    }

    if (loading) {
        return <LoadingIndicator />;
    }


    return (
         <ScrollView style={styles.container}  contentContainerStyle={{paddingBottom: 100}}>
            <View style={{paddingHorizontal: 20, marginBottom: 20}}>
                <PageTitle title="Caixa" size="large" />

                {error && (
                    <ErrorMessage error={error} />
                )}

                {dateFilter && (
                    <View style={{flexDirection: "row", gap: 6, marginBottom: 5}}>
                        <Feather name="calendar" size={16}  color={colors.gray[500]} />
                        <Text style={{color: colors.gray[500]}}>
                            {String(dateFilter.dataFinal)}
                        </Text>
                        <Text>-</Text>
                        <Text style={{color: colors.gray[500]}}>
                            {String(dateFilter.dataInicial)}
                        </Text>
                    </View>
                )}

                <View style={styles.totalResults}>
                    <Feather name="box" size={16} color={colors.gray[500]} />
                    <Text style={{color: colors.gray[500]}}>
                        {selectedCaixa ? selectedCaixa.DESC_CAI : "Nenhum caixa selecionado"}
                    </Text>
                </View>
            </View>

            {caixaDetails && (
                <View>
                    <View style={styles.caixaSection}>
                        <SectionTitle title="TOTAL RECEBIDO" />

                        <View style={{paddingHorizontal: 20}}>
                            <Text style={styles.totalValue}>
                                {UtilitiesService.formatarValor(caixaDetails.TOTAL_RECEBIDO)}
                            </Text>
                        </View>

                        <LineChart total={caixaDetails.TOTAL_RECEBIDO} values={caixaDetails.FORMAS_PAGAMENTO} />
                        <LineDetail label='ACRÉSCIMO RECEBIDO' value={caixaDetails.TOTAL_ACRESCIMO_RECEBIDO} isBRL={true} />
                        <LineDetail label='DESCONTO CONCEDIDO' value={caixaDetails.TOTAL_DESCONTO_CONCEDIDO} isBRL={true} />
                        <LineDetail label='BAIXAS' value={caixaDetails.TOTAL_BAIXAS} isBRL={false} />
                    </View>

                    <View style={styles.caixaSection}>
                        <SectionTitle title="TOTAL ANALÍTICO DE VENDAS" />

                        <View style={{paddingHorizontal: 20}}>
                            <Text style={styles.totalValue}>
                                {UtilitiesService.formatarValor(caixaDetails.TOTAL_VALOR_VENDAS || 0)}
                            </Text>
                        </View>

                        <LineChart total={caixaDetails.TOTAL_VALOR_VENDAS} values={caixaDetails.FORMAS_PAGAMENTO_VENDAS} />
                        <LineDetail label='DESCONTO EM VENDAS' value={caixaDetails.TOTAL_DESCONTO_VENDAS || 0} isBRL={true} />
                        <LineDetail label='VENDAS CONCLUÍDAS' value={caixaDetails.TOTAL_VENDAS || 0} isBRL={false} />
                        <LineDetail label='VENDAS CANCELADAS' value={caixaDetails.TOTAL_VENDAS_CANCELADAS || 0} isBRL={false} />
                    </View>

                    <View style={styles.caixaSection}>
                        <SectionTitle title="TOTAL CONTAS A RECEBER" />

                        <View style={{paddingHorizontal: 20}}>
                            <Text style={styles.totalValue}>
                                {UtilitiesService.formatarValor(caixaDetails.TOTAL_CONTAS_RECEBER || 0)}
                            </Text>
                        </View>

                        <LineDetailButton label='CONTAS PENDENTES' onPress={handleContasReceber} />
                    </View>
                </View>
            )}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
   container: {
        flex: 1,
        paddingVertical: 50,
        backgroundColor: "#FFF"
    },
    caixaDetailsHeader: {
        marginTop: 10,
        marginBottom: 3
    },
    caixaSection: {
        marginTop: 10,
        marginBottom: 50
    },
    lineContainer: {
        flexDirection: "column",
        paddingHorizontal: 20,
        paddingVertical: 10,
        width: "100%",
        borderBottomWidth: 0.5,
        borderBottomColor: colors.gray[300]
    },
    value: {
        color: colors.gray[500],
        fontWeight: 400,
    },
    label: {
        fontSize: 13,
        color: colors.gray[500]
    },
    totalValue: {
        fontSize: 32, 
        color: colors.gray[900],
        marginTop: 15
    },
    totalResults: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        borderRadius: 20,
        gap: 6,
        marginBottom: 20,
    },
})