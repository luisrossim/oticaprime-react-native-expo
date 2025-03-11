import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
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

export default function VendaDetails() {
    const { id } = useLocalSearchParams();
    const vendaId = Array.isArray(id) ? id[0] : id;

    const [venda, setVenda] = useState<Venda>();

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

            const vendaService = new VendaService();
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
 
    if (error) {
        return <ErrorMessage error={error} />;
    }

    if (venda) {
        return (
            <ScrollView style={styles.container} contentContainerStyle={{paddingBottom: 100}}>
                <View style={styles.header}>
                    <Feather 
                        name={
                            venda.NOME_TPV.includes("A PRAZO") || ["CARTAO", "A VISTA"].includes(venda.NOME_TPV)
                                ? "dollar-sign" 
                                : "star"
                        } 
                        size={20} 
                        style={styles.iconElement} 
                    />
                    <PageTitle title={`Venda #${id}`} size="small" />
                </View>

                <View style={styles.vendaDetails}>
                    <VendaDetailsItem icon="user-tie" detail={venda.NOME_VEND} />
                    <VendaDetailsItem icon="user" detail={venda.NOME_CLI} />
                    <VendaDetailsItem icon="user-nurse" detail={venda.NOME_MEDICO} />
                    <VendaDetailsItem icon="calendar-day" detail={new Date(venda!.DATA_VEN).toLocaleDateString()} />
                    <VendaDetailsItem icon="sack-dollar" detail={handlePaymentLabel(venda.TOTAL_VEN, venda.NOME_TPV)} />
                    <VendaDetailsItem icon="building-columns" detail={venda.RAZAO_EMP} />
                </View>

                <View style={[styles.vendaDetails, {paddingHorizontal: 20}]}>
                    <PageTitle title="Itens" size="small" />

                    { venda.ITENS.length > 0 
                        ? (
                            <View style={{ gap: 40, backgroundColor: colors.gray[100], borderWidth: 0.5, borderColor: colors.gray[300], padding: 20, borderRadius: 10, marginTop: 10}}>

                                {venda.ITENS.map((item, index) => (
                                    <View key={`${index}`} style={styles.itemDetails}>
                                        <View style={{flexDirection: "row", alignItems: "center", gap: 5}}>
                                            <Feather size={15} name="shopping-bag" color={colors.gray[800]} />
                                            <Text style={styles.itemNome}>{item.NOME_PRO}</Text>
                                        </View>

                                        <Text style={styles.itemInfo}>
                                            {item.QUANT} {item.UNIDADE_MEDIDA} - {UtilitiesService.formatarValor(item.VALOR)}
                                        </Text>

                                        <Text style={styles.itemDesconto}>
                                            Desconto: {UtilitiesService.formatarValor(item.DESCONTO)}
                                        </Text>
                                        
                                        <Text style={styles.itemTotal}>
                                            Total: {UtilitiesService.formatarValor(item.VALOR_TOTAL)}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        ) : (
                            <Text style={styles.emptyText}>Nenhum item encontrado para esta venda.</Text>
                        )
                    }
                </View>

                <View style={[styles.vendaDetails, {paddingHorizontal: 20}]}>
                    <PageTitle title="Formas de Pagamento" size="small" />

                    { venda.FORMAS_PAGAMENTO.length > 0 
                        ? (
                            <View style={{gap: 10, backgroundColor: colors.gray[100], borderWidth: 0.5, borderColor: colors.gray[300], padding: 20, borderRadius: 10, marginTop: 10}}>
                                { venda.FORMAS_PAGAMENTO.map((item, index) => (
                                    <View key={`${index}`} style={styles.paymentRow}>
                                        <Feather name="credit-card" size={16} color={colors.gray[600]} />
                                        <Text style={styles.paymentText}>{item.DESCRICAO}</Text>
                                        <Text style={styles.paymentValue}>
                                            {UtilitiesService.formatarValor(item.VALOR)}
                                        </Text>
                                    </View>
                                ))}

                                <View style={styles.paymentRowTotal}>
                                    <Text style={styles.paymentTextTotal}>TOTAL</Text>
                                    <Text style={styles.paymentValueTotal}>
                                        {UtilitiesService.formatarValor(venda.TOTAL_VEN)}
                                    </Text>
                                </View>
                            </View>
                        ) : (
                            <Text style={styles.emptyText}>Nenhuma forma de pagamento encontrada.</Text>
                        )
                    }
                </View>
            </ScrollView >
        )
    } else {
        return (
            <View>
                <Text>Venda não encontrada.</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        paddingVertical: 50,
        backgroundColor: "#FFF", 
        borderTopWidth: 0.5, 
        borderTopColor: colors.gray[300] 
    },
    header: { 
        flexDirection: "column", 
        alignItems: 'center',
        marginBottom: 30,
        paddingHorizontal: 20,
        gap: 10
    },
    iconElement: {
        backgroundColor: colors.green[500],
        borderRadius: 999,
        color: colors.gray[50],
        padding: 10,
        marginBottom: 2
    },
    vendaDetails: {
        flexDirection: 'column',
        marginBottom: 50
    },
    paymentRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    paymentRowTotal: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 10,
        borderTopWidth: 0.5,
        borderTopColor: colors.gray[400]
    },
    paymentTextTotal: {
        flex: 1,
        fontWeight: 600,
        color: colors.gray[800]
    },
    paymentValueTotal: {
        color: colors.gray[800],
        fontWeight: 600
    },
    paymentText: {
        flex: 1,
        marginLeft: 5,
        color: colors.gray[800]
    },
    paymentValue: {
        color: colors.gray[700],
    },
    itemDetails: {
        flex: 1,
        gap: 5
    },
    itemNome: {
        color: colors.gray[800],
        fontWeight: 600
    },
    itemInfo: {
        color: colors.gray[600]
    },
    itemDesconto: {
        color: colors.gray[600]
    },
    itemTotal: {
        color: colors.gray[600]
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
        fontWeight: 'bold',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#28a745',
    },
    emptyText: {
        color: colors.gray[400],
        fontSize: 16,
        padding: 15
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
});
