import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
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
    const { id } = useLocalSearchParams();
    const recebimentoId = Array.isArray(id) ? id[0] : id;
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
            const data = await recebimentosService.getById(recebimentoId);
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

                    <SectionTitle title="INFORMAÇÕES" />
                    <View style={styles.section}>
                        <RecebimentoDetailsLine 
                            label="CLIENTE"
                            value={`${limitarNome(recebimento!.NOME_CLI)}`} 
                        />
                        <RecebimentoDetailsLine 
                            label="VALOR CONTA"
                            value={UtilitiesService.formatarValor(recebimento!.VALOR_CTR)} 
                        />
                        <RecebimentoDetailsLine 
                            label="VENCIMENTO"
                            value={new Date(recebimento!.VENCTO_CTR).toLocaleDateString()} 
                        />
                        <RecebimentoDetailsLine 
                            label="PAGO EM"
                            value={new Date(recebimento!.DTPAGTO_CTR).toLocaleDateString()} 
                        />
                    </View>

                    <SectionTitle title="VALORES" />
                    <View style={styles.section}>
                        <RecebimentoDetailsLine 
                            label="VALOR PAGO"
                            value={UtilitiesService.formatarValor(recebimento!.VLRPAGO_CTR)} 
                        />
                        <RecebimentoDetailsLine 
                            label="DESCONTO"
                            value={UtilitiesService.formatarValor(recebimento!.DESCONTO_CONCEDIDO)} 
                        />
                        <RecebimentoDetailsLine 
                            label="ACRÉSCIMO"
                            value={UtilitiesService.formatarValor(recebimento!.ACRESCIMO_RECEBIDO)} 
                        />
                    </View>

                    <SectionTitle title="DOCUMENTO" />
                    <View style={styles.section}>
                        <RecebimentoDetailsItem 
                            icon="file" 
                            detail={recebimento!.NUMDOCUMENTO_CTR} 
                        />
                    </View>

                    <SectionTitle title="VENDA" />
                    <LineDetailButton 
                            label='DETALHES DA VENDA'
                            onPress={handleNavigateToVendas}
                        />
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
        paddingHorizontal: 20,
        gap: 10
    },
    iconElement: {
        backgroundColor: colors.cyan[500],
        borderRadius: 60,
        color: colors.cyan[200],
        padding: 10,
        marginBottom: 2
    },
    section: {
        paddingVertical: 15,
        marginBottom: 10,
        gap: 10
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
});
