import { ErrorMessage } from '@/components/ErrorMessage';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { PageTitle } from '@/components/PageTitle'
import { useEmpresaCaixa } from '@/context/EmpresaCaixaContext';
import { CaixaDetails } from '@/models/caixa';
import { CaixaService } from '@/services/caixa-service';
import { colors } from '@/utils/constants/colors';
import { Feather } from '@expo/vector-icons';
import { useEffect, useState } from 'react'
import { View, StyleSheet, Text, ScrollView } from 'react-native'
import { DatePickerContainer } from '@/components/DatePicker';
import { LineChart } from '@/components/LineChart';
import { UtilitiesService } from '@/utils/utilities-service';

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

            {caixaDetails?.FORMAS_PAGAMENTO && (
                <View style={styles.caixaFormaPagamento}>
                    <View style={{paddingHorizontal: 20}}>
                        <Text style={{fontSize: 18, fontWeight: 500, color: colors.gray[500], marginBottom: 6}}>
                            Valor total recebido
                        </Text>

                        <Text style={{fontSize: 32, fontWeight: 500, marginBottom: 10}}>
                            {UtilitiesService.formatarValor(caixaDetails.TOTAL_RECEBIDO)}
                        </Text>
                    </View>

                    <LineChart total={caixaDetails.TOTAL_RECEBIDO} values={caixaDetails.FORMAS_PAGAMENTO} />

                    <View style={styles.lineContainer}>
                        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                            <Text style={styles.label}>ACRÉSCIMO RECEBIDO</Text>
                            <Text style={styles.value}>
                                {UtilitiesService.formatarValor(caixaDetails.TOTAL_ACRESCIMO_RECEBIDO)}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.lineContainer}>
                        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                            <Text style={styles.label}>DESCONTO CONCEDIDO</Text>
                            <Text style={styles.value}>
                                {UtilitiesService.formatarValor(caixaDetails.TOTAL_DESCONTO_CONCEDIDO)}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.lineContainer}>
                        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                            <Text style={styles.label}>CONTAS A RECEBER</Text>
                            <Text style={styles.value}>
                                {UtilitiesService.formatarValor(caixaDetails.TOTAL_CONTAS_RECEBER)}
                            </Text>
                        </View>
                    </View>
                </View>
            )}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
   container: {
        flex: 1,
        paddingVertical: 50
    },
    caixaDetailsHeader: {
        marginTop: 10,
        marginBottom: 3
    },
    caixaFormaPagamento: {
        marginTop: 40
    },
    lineContainer: {
        flexDirection: "column",
        padding: 20,
        width: "100%",
        borderBottomWidth: 0.5,
        borderBottomColor: colors.gray[300]
    },
    value: {
        color: colors.gray[500],
        fontWeight: 400,
    },
    label: {
        fontSize: 13
    }
})