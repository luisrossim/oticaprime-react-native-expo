import { ErrorMessage } from '@/components/ErrorMessage';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { PageTitle } from '@/components/PageTitle'
import { useEmpresaCaixa } from '@/context/EmpresaCaixaContext';
import { CaixaDetails } from '@/models/caixa';
import { CaixaService } from '@/services/caixa-service';
import { colors } from '@/utils/constants/colors';
import { Feather } from '@expo/vector-icons';
import { useEffect, useState } from 'react'
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native'
import { DatePickerContainer } from '@/components/DatePicker';
import { LineChart } from '@/components/LineChart';
import { UtilitiesService } from '@/utils/utilities-service';
import { LineDetail, LineDetailButton } from '@/components/LineDetail';

export default function Caixa(){
    const [caixaDetails, setCaixaDetails] = useState<CaixaDetails | null>(null);
    const {selectedCaixa, selectedEmpresa} = useEmpresaCaixa();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const hoje = new Date();
    const dataInicialPadrao = new Date();
    dataInicialPadrao.setDate(hoje.getDate() - 31);

    const [dataInicial, setDataInicial] = useState(dataInicialPadrao);
    const [dataFinal, setDataFinal] = useState(hoje);


    useEffect(() => {
        setCaixaDetails(null)
        fetchCaixaDetails();
    }, [selectedCaixa])


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
                ano: 2025,
                mes: 1
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

    if (loading) {
        return <LoadingIndicator />;
    }


    return (
         <ScrollView style={styles.container}  contentContainerStyle={{paddingBottom: 100}}>
            <View style={{paddingHorizontal: 20}}>
                <PageTitle title="Caixa" size="large" />

                {error && (
                    <ErrorMessage error={error} />
                )}

                <DatePickerContainer
                    dataInicial={dataInicial}
                    dataFinal={dataFinal}
                    onDateChange={(inicio, fim) => {
                        setDataInicial(inicio);
                        setDataFinal(fim);
                    }}
                />
            </View>

            {caixaDetails && (
                <View>
                    <View style={styles.caixaSection}>
                        <View style={{paddingHorizontal: 20}}>
                            <Text style={{fontSize: 18, fontWeight: 500, color: colors.gray[700], marginBottom: 6}}>
                                Total recebido
                            </Text>

                            <Text style={{fontSize: 34, fontWeight: 500, color: colors.gray[700], marginBottom: 10}}>
                                {UtilitiesService.formatarValor(caixaDetails.TOTAL_RECEBIDO)}
                            </Text>
                        </View>

                        <LineChart total={caixaDetails.TOTAL_RECEBIDO} values={caixaDetails.FORMAS_PAGAMENTO} />
                        <LineDetail label='ACRÉSCIMO RECEBIDO' value={caixaDetails.TOTAL_ACRESCIMO_RECEBIDO} isBRL={true} />
                        <LineDetail label='DESCONTO CONCEDIDO' value={caixaDetails.TOTAL_DESCONTO_CONCEDIDO} isBRL={true} />
                    </View>

                    <View style={styles.caixaSection}>
                        <View style={{paddingHorizontal: 20}}>
                            <Text style={{fontSize: 18, fontWeight: 500, color: colors.gray[700], marginBottom: 6}}>
                                Total analítico de vendas
                            </Text>

                            <Text style={{fontSize: 28, fontWeight: 500, color: colors.gray[700], marginBottom: 10}}>
                                {UtilitiesService.formatarValor(caixaDetails.TOTAL_VALOR_VENDAS || 0)}
                            </Text>
                        </View>

                        <LineChart total={caixaDetails.TOTAL_VALOR_VENDAS} values={caixaDetails.FORMAS_PAGAMENTO_VENDAS} />
                        <LineDetail label='DESCONTO EM VENDAS' value={caixaDetails.TOTAL_DESCONTO_VENDAS || 0} isBRL={true} />
                        <LineDetail label='VENDAS CONCLUÍDAS' value={caixaDetails.TOTAL_VENDAS || 0} isBRL={false} />
                        <LineDetail label='VENDAS CANCELADAS' value={caixaDetails.TOTAL_VENDAS_CANCELADAS || 0} isBRL={false} />
                    </View>

                    <View style={styles.caixaSection}>
                        <View style={{paddingHorizontal: 20}}>
                            <Text style={{fontSize: 18, fontWeight: 500, color: colors.gray[700], marginBottom: 6}}>
                                Total de contas a receber
                            </Text>

                            <Text style={{fontSize: 28, fontWeight: 500, color: colors.gray[700], marginBottom: 10}}>
                                {UtilitiesService.formatarValor(caixaDetails.TOTAL_CONTAS_RECEBER || 0)}
                            </Text>
                        </View>

                        <LineDetailButton label='VISUALIZAR CONTAS' />
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
        marginTop: 60
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
    }
})