import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { colors } from '@/constants/colors';
import { VendaService } from '@/services/venda-service';
import { Venda } from '@/models/venda';
import { Feather } from '@expo/vector-icons';
import { VendaDetailsItem } from '@/components/VendaDetailsItem';
import { UtilitiesService } from '@/utils/utilities-service';

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
        return <ActivityIndicator style={styles.loading} size="large" />;
    }

    if (error) {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={styles.error}>{error}</Text>
            </View>
        );
    }

    if (venda) {
        return (
            <ScrollView style={styles.container} contentContainerStyle={{paddingBottom: 50}}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Venda #{id}</Text>
                    <Feather 
                        name={
                            venda.NOME_TPV.includes("A PRAZO") || ["CARTAO", "A VISTA"].includes(venda.NOME_TPV)
                                ? "dollar-sign" 
                                : "star"
                        } 
                    size={15} style={styles.iconElement} />
                </View>

                <View style={[styles.vendaDetails, {padding: 15}]}>
                    <VendaDetailsItem icon="user-tie" detail={venda.NOME_VEND} />
                    <VendaDetailsItem icon="user" detail={venda.NOME_CLI} />
                    <VendaDetailsItem icon="user-nurse" detail={venda.NOME_MEDICO} />
                    <VendaDetailsItem icon="calendar-day" detail={new Date(venda!.DATA_VEN).toLocaleDateString()} />
                    <VendaDetailsItem icon="sack-dollar" detail={handlePaymentLabel(venda.TOTAL_VEN, venda.NOME_TPV)} />
                    <VendaDetailsItem icon="building-columns" detail={venda.RAZAO_EMP} />
                </View>

                <View style={styles.vendaDetails}>
                    <Text style={styles.detailTitle}>
                        Itens
                    </Text>

                    { venda.ITENS.length > 0 
                        ? (
                            <View style={{ gap: 20, padding: 15 }}>
                                {venda.ITENS.map((item, index) => (
                                    <View key={`${index}`} style={{flex: 1, flexDirection: 'row', gap: 10}}>
                                        <Feather style={{marginTop: 3}} size={16} name="shopping-bag" color={colors.slate[700]} />
                                        <View style={styles.itemDetails}>
                                            <Text style={styles.itemNome}>{item.NOME_PRO}</Text>
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
                                    </View>
                                ))}
                            </View>
                        ) : (
                            <Text style={styles.emptyText}>Nenhum item encontrado para esta venda.</Text>
                        )
                    }
                </View>

                <View style={styles.vendaDetails}>
                    <Text style={styles.detailTitle}>
                        Formas de Pagamento
                    </Text>

                    { venda.FORMAS_PAGAMENTO.length > 0 
                        ? (
                            <View style={{gap: 10, padding: 15}}>
                                { venda.FORMAS_PAGAMENTO.map((item, index) => (
                                    <View key={`${index}`} style={styles.paymentRow}>
                                        <Feather name="credit-card" size={16} color={colors.slate[600]} />
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
        paddingHorizontal: 20, 
        backgroundColor: "#FFF", 
        borderTopWidth: 0.5, 
        borderTopColor: colors.slate[300] 
    },
    header: { 
        flexDirection: "row",
        justifyContent: "space-between", 
        alignItems: 'center',
        marginBottom: 20 
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: 700
    },
    iconElement: {
        backgroundColor: colors.emerald[300],
        borderRadius: 999,
        color: colors.slate[900],
        padding: 10
    },
    vendaDetails: {
        flexDirection: 'column',
        borderRadius: 10,
        borderWidth: 1,
        backgroundColor: colors.slate[100],
        borderColor: colors.slate[300],
        marginBottom: 30
    },
    detailTitle: { 
        fontSize: 18, 
        fontWeight: 600, 
        padding: 10,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.slate[300],
        backgroundColor: colors.slate[200],
        color: colors.slate[900]
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
        borderTopWidth: 1,
        paddingTop: 10,
        borderTopColor: colors.slate[200]
    },
    paymentTextTotal: {
        flex: 1,
        fontWeight: 600,
        color: colors.slate[700]
    },
    paymentValueTotal: {
        color: colors.slate[700],
        fontWeight: 600
    },
    paymentText: {
        flex: 1,
        marginLeft: 10,
        color: colors.slate[600]
    },
    paymentValue: {
        color: colors.slate[600],
    },
    itemDetails: {
        flex: 1,
        gap: 5
    },
    itemNome: {
        color: colors.slate[700],
        fontWeight: 600
    },
    itemInfo: {
        color: colors.slate[500]
    },
    itemDesconto: {
        color: colors.slate[500]
    },
    itemTotal: {
        color: colors.slate[500]
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
        color: colors.slate[400],
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
