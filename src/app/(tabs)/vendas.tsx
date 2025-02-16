import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SectionList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { VendaService } from '@/services/venda-service';
import { colors } from '@/constants/colors';
import { Venda } from '@/models/venda';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function Vendas() {
    const [vendas, setVendas] = useState<Venda[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const hoje = new Date();
    const dataInicialPadrao = new Date();
    dataInicialPadrao.setDate(hoje.getDate() - 31);

    const [dataInicial, setDataInicial] = useState(dataInicialPadrao);
    const [dataFinal, setDataFinal] = useState(hoje);

    useEffect(() => {
        fetchVendas();
    }, []);

    const onChangeDataInicial = (event: any, selectedDate?: Date) => {
        if (selectedDate) {
            setDataInicial(selectedDate);
        }
    };

    const onChangeDataFinal = (event: any, selectedDate?: Date) => {
        if (selectedDate) {
            setDataFinal(selectedDate);
        }
    };

    const formatarData = (data: Date): string => {
        return data.toLocaleDateString();
    };

    const fetchVendas = async () => {
        try {
            const service = new VendaService();
            const params = {
                dataInicial: formatarData(dataInicial),
                dataFinal: formatarData(dataFinal),
            };

            const data = await service.getWithParams(params);
            setVendas(data);
        } catch (err) {
            setError('Erro ao carregar vendas.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const formatarFormaPagamento = (forma: string) => {
        const formas = {
            CARTAO_CREDITO: 'Cartão de Crédito',
            CARTAO_DEBITO: 'Cartão de Débito',
            DINHEIRO: 'Dinheiro',
            PIX: 'PIX',
            BOLETO: 'Boleto',
        };
        return formas[forma as keyof typeof formas] || forma;
    };

    const groupVendasByDate = (vendas: Venda[]) => {
        vendas.sort((a, b) => new Date(a.CRIADOEM).getTime() - new Date(b.CRIADOEM).getTime());

        const groupedVendas: { title: string, data: Venda[] }[] = [];

        vendas.forEach((venda) => {
            const vendaDate = new Date(venda.CRIADOEM);
            const dateString = vendaDate.toLocaleDateString();
            
            const existingSection = groupedVendas.find((section) => section.title === dateString);
            if (existingSection) {
                existingSection.data.push(venda);
            } else {
                groupedVendas.push({ title: dateString, data: [venda] });
            }
        });

        return groupedVendas;
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color={colors.sky[500]} />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.error}>{error}</Text>
            </View>
        );
    }

    const groupedVendas = groupVendasByDate(vendas);

    return (
        <View style={styles.container}>
            <View style={{paddingHorizontal: 20}}>
                <Text style={styles.title}>Vendas</Text>
            </View>

            <View style={styles.datePickerContainer}>
                <DateTimePicker
                    value={dataInicial}
                    mode="date"
                    display="default"
                    onChange={onChangeDataInicial}
                />

                <DateTimePicker
                    value={dataFinal}
                    mode="date"
                    display="default"
                    onChange={onChangeDataFinal}
                />

                <TouchableOpacity style={styles.filterButton} onPress={fetchVendas}>
                    <Feather name="search" size={16} color="#FFF" />
                </TouchableOpacity>
            </View>

            <SectionList
                sections={groupedVendas}
                keyExtractor={(item) => String(item.ID)}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <Feather name="frown" size={50} color="#ccc" />
                        <Text style={styles.emptyText}>Nenhuma venda encontrada.</Text>
                    </View>
                )}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => router.push("/venda-details")} 
                    >
                        <View style={styles.cardHeader}>
                            <Text style={styles.vendedor}>{item.VENDEDOR}</Text>
                        </View>

                        <Text style={styles.formaPagamento}>
                            <Feather name="credit-card" size={14} color={colors.gray[500]} /> {formatarFormaPagamento(item.FORMAPAGAMENTO)}
                        </Text>

                        <View style={styles.cardFooter}>
                            <Text style={styles.data}>
                                <Feather name="calendar" size={14} color={colors.gray[500]} /> {new Date(item.CRIADOEM).toLocaleDateString()}
                            </Text>
                            <Text style={styles.valor}>R$ {item.VALOR.toFixed(2)}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                renderSectionHeader={({ section: { title } }) => (
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>{title}</Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 30,
        backgroundColor: colors.gray[100],
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 20
    },
    error: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
    },
    datePickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingHorizontal: 10,
        gap: 2,
        marginBottom: 20,
    },
    card: {
        backgroundColor: "#FFF",
        paddingVertical: 12,
        paddingHorizontal: 22,
        borderWidth: 1,
        borderColor: colors.gray[100]
    },
    vendedor: {
        fontSize: 17,
        fontWeight: '600'
    },
    valor: {
        fontSize: 16,
        fontWeight: 600,
        color: colors.emerald[600],
    },
    formaPagamento: {
        fontSize: 14,
        color: colors.gray[500],
    },
    data: {
        fontSize: 14,
        color: colors.gray[500],
    },
    filterButton: {
        backgroundColor: colors.blue[500],
        padding: 8,
        width: 60,
        marginLeft: 17,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingVertical: 20,
    },
    emptyText: {
        fontSize: 16,
        color: colors.gray[700],
        fontStyle: 'italic',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    sectionHeader: {
        backgroundColor: colors.gray[100],
        paddingVertical: 20,
        paddingHorizontal: 22,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 300
    }
});
