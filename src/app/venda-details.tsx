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
            <SafeAreaView style={{flex: 1, backgroundColor: "#FFF"}}>
                <CustomHeader title={"Detalhes da venda"} />

                <ScrollView style={styles.container} contentContainerStyle={{paddingBottom: 100}}>
                    <View style={styles.header}>
                        <Feather 
                            name={
                                venda.NOME_TPV.includes("A PRAZO") || ["CARTAO", "A VISTA"].includes(venda.NOME_TPV)
                                    ? "dollar-sign" 
                                    : "star"
                            } 
                            size={32} 
                            style={styles.iconElement} 
                        />
                        <PageTitle title={`Venda #${id}`} size="small" />
                    </View>

                    <SectionTitle title="INFORMAÇÕES" />
                    <View style={{paddingTop: 10, paddingBottom: 30, gap: 10}}>
                        <VendaDetailsItem icon="user-tie" detail={venda.NOME_VEND} />
                        <VendaDetailsItem icon="user" detail={venda.NOME_CLI} />
                        <VendaDetailsItem icon="user-nurse" detail={venda.NOME_MEDICO} />
                        <VendaDetailsItem icon="calendar-day" detail={new Date(venda!.DATA_VEN).toLocaleDateString()} />
                        <VendaDetailsItem icon="sack-dollar" detail={handlePaymentLabel(venda.TOTAL_VEN, venda.NOME_TPV)} />
                        <VendaDetailsItem icon="building" detail={venda.RAZAO_EMP} />
                    </View>

                    <View style={styles.vendaDetails}>
                        <SectionTitle title="ITENS" />

                        { venda.ITENS.length > 0 
                            ? (
                                <View style={{ gap: 20, padding: 20}}>
                                    {venda.ITENS.map((item, index) => (
                                        <View key={`${index}`} style={styles.itemDetails}>
                                            <Feather 
                                                style={[styles.itemIcon, {alignSelf: "center"}]} 
                                                size={20} 
                                                name="shopping-bag" 
                                                color={colors.purple[600]} 
                                            />

                                            <View style={{flex: 1}}>
                                                <Text style={styles.itemNome}>
                                                    {item.NOME_PRO}
                                                </Text>
                                                <Text style={styles.itemInfo}>
                                                    {item.QUANT} {item.UNIDADE_MEDIDA} - {UtilitiesService.formatarValor(item.VALOR)}
                                                </Text>
                                                <Text style={styles.itemInfo}>
                                                    Desconto: {UtilitiesService.formatarValor(item.DESCONTO)}
                                                </Text>
                                                <Text style={styles.itemInfo}>
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
                        <SectionTitle title="FORMAS DE PAGAMENTO" />

                        { venda.FORMAS_PAGAMENTO.length > 0 
                            ? (
                                <View style={{ gap: 10, padding: 20}}>
                                    { venda.FORMAS_PAGAMENTO.map((item, index) => (
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
            </SafeAreaView>
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
        borderRadius: 60,
        color: colors.green[200],
        padding: 10,
        marginBottom: 2
    },
    vendaDetails: {
        flexDirection: 'column',
        marginBottom: 10
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
        color: colors.gray[800],
        fontWeight: 600
    },
    paymentText: {
        flex: 1,
        color: colors.gray[700]
    },
    paymentTextTotal: {
        flex: 1,
        fontWeight: 600,
        color: colors.gray[700]
    },
    paymentValue: {
        color: colors.gray[700],
    },
    itemDetails: {
        flex: 1,
        gap: 15,
        flexDirection: "row"
    },
    itemIcon: {
        padding: 10,
        backgroundColor: colors.purple[200],
        borderRadius: 50
    },
    itemNome: {
        color: colors.gray[700],
        fontWeight: 500
    },
    itemInfo: {
        fontSize: 13,
        fontWeight: 300,
        paddingVertical: 2,
        color: colors.gray[500]
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
        color: colors.gray[500],
        fontWeight: 300,
        marginTop: 15,
        paddingHorizontal: 20
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
