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
import { PageTitle } from '@/components/PageTitle';
import { UtilitiesService } from '@/utils/utilities-service';
import { RecebimentoDetailsItem, RecebimentoDetailsLine } from '@/components/RecebimentoDetailsItem';
import { LineDetailButton } from '@/components/LineDetail';

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
            <CustomHeader title={"Detalhes do Recebimento"} />

            {error ? (
                <ErrorMessage error={error} />
            ) : (
                <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
                    <View style={styles.header}>
                        <Feather 
                            name="arrow-down-right" 
                            size={32} 
                            style={styles.iconElement} 
                        />
                        <PageTitle title={`Recebimento #${id}`} size="small" />
                    </View>

                    <View style={styles.cardSection}>
                        <SectionTitle title="INFORMAÇÕES" />
                        <View style={styles.section}>
                            <RecebimentoDetailsLine 
                                label="Cliente"
                                value={`${limitarNome(recebimento!.NOME_CLI)}`} 
                            />
                            <RecebimentoDetailsLine 
                                label="Vencimento"
                                value={new Date(recebimento!.VENCTO_CTR).toLocaleDateString()} 
                            />
                            <RecebimentoDetailsLine 
                                label="Valor da conta"
                                value={UtilitiesService.formatarValor(recebimento!.VALOR_CTR)} 
                            />
                            <RecebimentoDetailsLine 
                                label="Desconto"
                                value={UtilitiesService.formatarValor(recebimento!.DESCONTO_CONCEDIDO)} 
                            />
                            <RecebimentoDetailsLine 
                                label="Acréscimo"
                                value={UtilitiesService.formatarValor(recebimento!.ACRESCIMO_RECEBIDO)} 
                            />
                            <RecebimentoDetailsLine 
                                label="Pago em"
                                value={new Date(recebimento!.DTPAGTO_CTR).toLocaleDateString()} 
                            />
                            <RecebimentoDetailsLine 
                                label="Valor pago"
                                value={UtilitiesService.formatarValor(recebimento!.VLRPAGO_CTR)} 
                            />
                        </View>
                    </View>

                    <View style={styles.cardSection}>
                        <SectionTitle title="DOCUMENTO" />
                        <View style={styles.section}>
                            <RecebimentoDetailsItem 
                                icon="file" 
                                detail={`N° ${recebimento!.NUMDOCUMENTO_CTR}`} 
                            />
                            <RecebimentoDetailsItem 
                                icon="ellipsis" 
                                detail={`SEQUÊNCIA ${recebimento!.SEQUENCIA_CTR}`} 
                            />
                        </View>
                    </View>

                    <View style={styles.cardSection}>
                        <SectionTitle title="VENDA" />
                        <LineDetailButton 
                            label='Detalhes da venda'
                            onPress={handleNavigateToVendas}
                        />
                        </View>
                </ScrollView>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 50,
        backgroundColor: "#FFF",
    },
    header: { 
        flexDirection: "column", 
        alignItems: 'center',
        marginBottom: 30,
        paddingHorizontal: 15,
        gap: 10
    },
    iconElement: {
        backgroundColor: colors.indigo[600],
        borderRadius: 60,
        color: colors.cyan[200],
        padding: 10,
        marginBottom: 2
    },
    section: {
        paddingTop: 10
    },
    recebimentoText: {
        fontSize: 16,
        color: colors.gray[800],
        marginVertical: 5,
        fontWeight: '500',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.green[600],
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginTop: 20,
        justifyContent: 'center',
    },
    buttonText: {
        color: "#FFF",
        marginLeft: 8,
        fontSize: 16,
    },
    cardSection: {
        marginTop: 10,
        marginBottom: 30,
        marginHorizontal: 15,
        borderWidth: 1,
        borderColor: colors.slate[200],
        borderRadius: 16,
        overflow: "hidden"
    }
});
