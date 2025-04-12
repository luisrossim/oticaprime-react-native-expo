import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { colors } from '@/utils/constants/colors';
import { VendaService } from '@/services/venda-service';
import { Venda } from '@/models/venda';
import { Feather } from '@expo/vector-icons';
import { VendaDetailsItem } from '@/components/VendaDetailsItem';
import { UtilitiesService } from '@/utils/utilities-service';
import { PageTitle } from '@/components/PageTitle';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { ErrorMessage } from '@/components/ErrorMessage';
import { CustomHeader } from '@/components/CustomHeader';
import SectionTitle from '@/components/SectionTitle';
import { useAuth } from '@/context/AuthContext';

export default function VendaDetails() {
    const { id } = useLocalSearchParams();
    const vendaId = Array.isArray(id) ? id[0] : id;
    const [venda, setVenda] = useState<Venda>();

    const {authData} = useAuth();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);



    useEffect(() => {
        fetchVenda();
    }, [vendaId]);

    const fetchVenda = async () => {
        setLoading(true);

        try {
            if (!vendaId) {
                throw new Error("ID da venda não encontrado.");
            }

            const vendaService = new VendaService(authData?.accessToken);
            const data = await vendaService.getById(vendaId);
            setVenda(data);

        } catch (err) {
            setError("Erro ao buscar detalhes da venda.");
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentLabel = (total: number, tipo: string) => {
        const totalFormatado = UtilitiesService.formatarValor(total);
        return `${totalFormatado} (${tipo})`
    }


 
    if (loading) {
        return <LoadingIndicator />;
    }
 
    return (
        <SafeAreaView style={{flex: 1, backgroundColor: "#FFF"}}>
            <CustomHeader title={"Detalhes da venda"} />

            {error ? (
                  <ErrorMessage error={error} />
            ) : (
                <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 100}}>
                    <View style={styles.header}>
                        <Feather 
                            name={
                                venda!.NOME_TPV.includes("A PRAZO") || ["CARTAO", "A VISTA"].includes(venda!.NOME_TPV)
                                    ? "dollar-sign" 
                                    : "star"
                            } 
                            size={32} 
                            style={styles.iconElement} 
                        />
                        <Text style={{color: colors.lime[200], fontWeight: 600, fontSize: 16}}>
                            Venda #{id}
                        </Text>
                    </View>

                    <View style={styles.cardSection}>
                        <SectionTitle title="Informações gerais" />
                        <View style={{paddingTop: 15, gap: 10}}>
                            <VendaDetailsItem icon="user-tie" detail={venda!.NOME_VEND} />
                            <VendaDetailsItem icon="user" detail={venda!.NOME_CLI} />
                            <VendaDetailsItem icon="user-nurse" detail={venda?.NOME_MEDICO || '-'} />
                            <VendaDetailsItem icon="calendar-day" detail={new Date(venda!.DATA_VEN).toLocaleDateString()} />
                            <VendaDetailsItem icon="sack-dollar" detail={handlePaymentLabel(venda!.TOTAL_VEN, venda!.NOME_TPV)} />
                            <VendaDetailsItem icon="building" detail={venda!.RAZAO_EMP} />
                        </View>
                    </View>

                    <View style={[styles.cardSection, {backgroundColor: colors.slate[100], paddingVertical: 30}]}>
                        <View style={styles.vendaDetails}>
                            <SectionTitle title="Itens da venda" />

                            { venda!.ITENS.length > 0 
                                ? (
                                    <View style={{ gap: 20, marginTop: 16 }}>
                                        {venda!.ITENS.map((item, index) => (
                                           <View key={`${index}`} style={{flex: 1}}>
                                                <Text style={styles.itemNome}>
                                                    {item.NOME_PRO}
                                                </Text>

                                                <View style={styles.itemDetail}>
                                                    <Text style={styles.itemInfo}>
                                                        {item.QUANT} {item.UNIDADE_MEDIDA}
                                                    </Text>
                                                    <Text style={styles.itemInfo}>
                                                        {UtilitiesService.formatarValor(item.VALOR)}
                                                    </Text>
                                                </View>

                                                <View style={styles.itemDetail}>
                                                    <Text style={styles.itemInfo}>
                                                        Desconto
                                                    </Text>
                                                    <Text style={styles.itemInfo}>
                                                        - {UtilitiesService.formatarValor(item.DESCONTO)}
                                                    </Text>
                                                </View>

                                                <View style={styles.itemDetail}>
                                                    <Text style={styles.itemInfo}>
                                                        Total
                                                    </Text>
                                                    <Text style={styles.itemInfo}>
                                                        {UtilitiesService.formatarValor(item.VALOR_TOTAL)}
                                                    </Text>
                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                ) : (
                                    <Text style={styles.emptyText}>Nenhum item encontrado para esta venda.</Text>
                                )
                            }
                        </View>
                    </View>

                    <View style={styles.cardSection}>
                        <View style={styles.vendaDetails}>
                            <SectionTitle title="Formas de pagamento" />

                            { venda!.FORMAS_PAGAMENTO.length > 0 
                                ? (
                                    <View style={{ gap: 10, padding: 18}}>
                                        { venda!.FORMAS_PAGAMENTO.map((item, index) => (
                                            <View key={`${index}`} style={styles.paymentRow}>
                                                <Text style={styles.paymentText}>
                                                    {item.DESCRICAO}
                                                </Text>
                                                <Text style={styles.paymentValue}>
                                                    {UtilitiesService.formatarValor(item.VALOR)}
                                                </Text>
                                            </View>
                                        ))}

                                        <View style={styles.paymentRowTotal}>
                                            <Text style={styles.paymentTextTotal}>
                                                TOTAL
                                            </Text>
                                            <Text style={styles.paymentValueTotal}>
                                                {UtilitiesService.formatarValor(venda!.TOTAL_VEN)}
                                            </Text>
                                        </View>
                                    </View>
                                ) : (
                                    <Text style={styles.emptyText}>Nenhuma forma de pagamento encontrada.</Text>
                                )
                            }
                        </View>
                    </View>
                </ScrollView>
            )}
        </SafeAreaView>
    )
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
        backgroundColor: colors.emerald[600],
        paddingVertical: 40
    },
    iconElement: {
        color: colors.lime[200]
    },
    vendaDetails: {
        flexDirection: 'column'
    },
    paymentRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    paymentRowTotal: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    paymentValueTotal: {
        color: colors.slate[800],
        fontWeight: 600
    },
    paymentText: {
        flex: 1,
        color: colors.slate[700]
    },
    paymentTextTotal: {
        flex: 1,
        fontWeight: 600,
        color: colors.slate[700]
    },
    paymentValue: {
        color: colors.slate[700],
    },
    itemIcon: {
        padding: 8,
        backgroundColor: colors.slate[600],
        borderRadius: 100
    },
    itemNome: {
        color: colors.slate[700],
        fontWeight: 600,
        paddingHorizontal: 18,
        marginBottom: 3
    },
    itemInfo: {
        fontSize: 13,
        fontWeight: 300,
        paddingVertical: 2,
        color: colors.slate[700]
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
        paddingVertical: 10,
        borderTopWidth: 2,
        borderColor: '#000',
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: 600,
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 600,
        color: '#28a745',
    },
    emptyText: {
        color: colors.slate[500],
        fontWeight: 300,
        marginVertical: 15,
        paddingHorizontal: 18
    },
    error: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    cardSection: {
        marginTop: 10,
        marginBottom: 30
    },
    itemDetail: {
        flex: 1, 
        flexDirection: "row", 
        justifyContent: "space-between", 
        paddingHorizontal: 18
    }
});
