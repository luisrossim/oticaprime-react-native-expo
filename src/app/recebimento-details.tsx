import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, SafeAreaView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { colors } from '@/utils/constants/colors';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { ErrorMessage } from '@/components/ErrorMessage';
import { CustomHeader } from '@/components/CustomHeader';
import { useAuth } from '@/context/AuthContext';
import { Recebimento } from '@/models/recebimento';
import { RecebimentosService } from '@/services/recebimentos-service';
import SectionTitle from '@/components/SectionTitle';
import { Feather } from '@expo/vector-icons';
import { UtilitiesService } from '@/utils/utilities-service';
import { RecebimentoDetailsLine } from '@/components/RecebimentoDetailsItem';
import { LineDetailButton } from '@/components/LineDetail';
import { IconText } from '@/components/IconText';

export default function RecebimentoDetails() {
    const { id, sequencia } = useLocalSearchParams();
    const recebimentoId = Array.isArray(id) ? id[0] : id;
    const sequenciaNum = Array.isArray(sequencia) ? sequencia[0] : sequencia;
    const [recebimento, setRecebimento] = useState<Recebimento>();

    const { authData } = useAuth();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchVenda();
    }, [recebimentoId]);

    const fetchVenda = async () => {
        setLoading(true);

        try {
            if (!recebimentoId) {
                throw new Error("ID do recebimento não encontrado.");
            }

            const recebimentosService = new RecebimentosService(authData?.accessToken);
            const data = await recebimentosService.getByIdWithParam(recebimentoId, sequenciaNum);
            setRecebimento(data);

        } catch (err) {
            setError("Erro ao buscar detalhes do recebimento.");
        } finally {
            setLoading(false);
        }
    };

    const handleNavigateToVendas = () => {
        if (recebimento?.COD_VENDA) {
            router.push(`/venda-details?id=${recebimento.COD_VENDA}`);
        }
    };

    const limitarNome = (nome: string, limite: number = 30) => {
        if (nome.length <= limite) return nome;
        const posEspaco = nome.indexOf(' ', limite);
        return posEspaco === -1 ? nome.slice(0, limite) : nome.slice(0, posEspaco);
    }


    if (loading) {
        return <LoadingIndicator />;
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
            <CustomHeader title={"Detalhes do recebimento"} />

            {error ? (
                <ErrorMessage error={error} />
            ) : (
                <ScrollView 
                    style={styles.container} 
                    showsVerticalScrollIndicator={false} 
                    contentContainerStyle={{ paddingBottom: 100 }}
                >
                    <View style={styles.header}>
                        <Feather 
                            name="arrow-down-right" 
                            size={32} 
                            style={styles.iconElement} 
                        />
                        <Text style={styles.headerText}>
                            Recebimento #{id}
                        </Text>
                    </View>


                    {recebimento ? (
                        <View style={{marginTop: 10, gap: 50}}>
                            <View>
                                <SectionTitle title="Informações gerais" />
                                <View style={styles.section}>
                                    <RecebimentoDetailsLine 
                                        label="Cliente"
                                        value={`${limitarNome(recebimento.NOME_CLI)}`} 
                                    />
                                    <RecebimentoDetailsLine 
                                        label="Vencimento"
                                        value={new Date(recebimento.VENCTO_CTR).toLocaleDateString()} 
                                    />
                                    <RecebimentoDetailsLine 
                                        label="Valor da conta"
                                        value={UtilitiesService.formatarValor(recebimento.VALOR_CTR)} 
                                    />
                                    <RecebimentoDetailsLine 
                                        label="Desconto"
                                        value={UtilitiesService.formatarValor(recebimento.DESCONTO_CONCEDIDO)} 
                                    />
                                    <RecebimentoDetailsLine 
                                        label="Acréscimo"
                                        value={UtilitiesService.formatarValor(recebimento.ACRESCIMO_RECEBIDO)} 
                                    />
                                    <RecebimentoDetailsLine 
                                        label="Pago em"
                                        value={new Date(recebimento!.DTPAGTO_CTR).toLocaleDateString()} 
                                    />
                                    <RecebimentoDetailsLine 
                                        label="Valor pago"
                                        value={UtilitiesService.formatarValor(recebimento.VLRPAGO_CTR)} 
                                    />
                                </View>
                            </View>


                            <View>
                                <SectionTitle title="Venda relacionada" />
                                <LineDetailButton 
                                    label='Detalhes da venda'
                                    onPress={handleNavigateToVendas}
                                />
                            </View>


                            <View>
                                <SectionTitle title="Documento e sequência" />
                                <View style={[styles.section, {gap: 8, marginTop: 2}]}>
                                    <IconText 
                                        icon="file" 
                                        text={`${recebimento.NUMDOCUMENTO_CTR}`} 
                                    />
                                    <IconText 
                                        icon="ellipsis" 
                                        text={`SEQUÊNCIA ${recebimento.SEQUENCIA_CTR}`} 
                                    />
                                </View>
                            </View>
                        </View>
                    ) : (
                        <Text style={styles.empty}>
                            Ocorreu um erro ao exibir detalhes do recebimento.
                        </Text>
                    )}
                </ScrollView>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: { 
        alignItems: 'center',
        marginBottom: 30,
        paddingHorizontal: 18,
        gap: 15,
        backgroundColor: colors.indigo[600],
        paddingVertical: 40
    },
    headerText: {
        color: colors.cyan[200], 
        fontWeight: 500, 
        fontSize: 16
    },
    iconElement: {
        color: colors.cyan[200]
    },
    section: {
        paddingTop: 10
    },
    empty: {
        textAlign: "center",
        paddingHorizontal: 18,
        fontWeight: 300,
        fontSize: 13,
        color: colors.slate[500]
    }
});
