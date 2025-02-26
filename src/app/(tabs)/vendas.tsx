import React, { useState, useCallback, useEffect } from 'react';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { VendaService } from '@/services/venda-service';
import { colors } from '@/utils/constants/colors';
import { VendaSummary } from '@/models/venda';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ErrorMessage } from '@/components/ErrorMessage';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { useEmpresa } from '@/context/EmpresaContext';
import { UtilitiesService } from '@/utils/utilities-service';

export default function Vendas() {
    const [vendasPaginadas, setVendasPaginadas] = useState<VendaSummary[]>([]);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [totalVendas, setTotalVendas] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const { selectedCompany } = useEmpresa();

    const [isDatePickerInicialVisible, setDatePickerInicialVisibility] = useState(false);
    const [isDatePickerFinalVisible, setDatePickerFinalVisibility] = useState(false);

    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const hoje = new Date();
    const dataInicialPadrao = new Date();
    dataInicialPadrao.setDate(hoje.getDate() - 31);

    const [dataInicial, setDataInicial] = useState(dataInicialPadrao);
    const [dataFinal, setDataFinal] = useState(hoje);

    const showDatePickerInicial = () => setDatePickerInicialVisibility(true);
    const hideDatePickerInicial = () => setDatePickerInicialVisibility(false);
    const showDatePickerFinal = () => setDatePickerFinalVisibility(true);
    const hideDatePickerFinal = () => setDatePickerFinalVisibility(false);

    const formatarData = (data: Date): string => {
        return data.toLocaleDateString();
    };



    useEffect(() => {
        setPaginaAtual(1);
        setVendasPaginadas([]);
        setIsCompleted(false);
        fetchVendas(1);
    }, [selectedCompany, dataInicial, dataFinal])

    const fetchVendas = async (pagina: number) => {
        if (loading || isFetchingMore) return

        if (pagina === 1) {
            setLoading(true);
        } else {
            setIsFetchingMore(true);
        }

        try {
            const vendaService = new VendaService();
            const params = {
                dataInicial: formatarData(dataInicial),
                dataFinal: formatarData(dataFinal),
                empId: selectedCompany?.COD_EMP,
                page: pagina
            };

            const data = await vendaService.getWithPageable(params);

            setTotalVendas(data.pageable.totalResults);
            setTotalPages(data.pageable.totalPages);

            if (pagina === 1) {
                setVendasPaginadas(data.vendas);
            } else {
                setVendasPaginadas((prev) => [...prev, ...data.vendas]);
            }

            if (totalPages == pagina) {
                setIsCompleted(true);
            } else {
                setPaginaAtual(pagina);
            }

        } catch (err) {
            setError(`Erro ao buscar vendas.`);
        } finally {
            setLoading(false);
            setIsFetchingMore(false);
        }
    };

    const carregarMaisVendas = () => {
        if (!isFetchingMore && !isCompleted && paginaAtual < totalPages) {
            setIsFetchingMore(true); 
            fetchVendas(paginaAtual + 1);
        }
    };

    const ItemVenda = React.memo(({ item, onPress }: { item: VendaSummary, onPress: () => void }) => (
        <TouchableOpacity style={styles.vendaCard} onPress={onPress}>
            <View style={styles.cardContent}>
                <View style={styles.iconColumn}>
                    <Feather 
                        name={
                            item.NOME_TPV.includes("A PRAZO") || ["CARTAO", "A VISTA"].includes(item.NOME_TPV)
                                ? "dollar-sign" 
                                : "star"
                        } 
                        size={20} 
                        style={styles.iconElement} 
                    />
                </View>
    
                <View style={styles.infoColumn}>
                    <Text style={styles.vendedor}>{item.NOME_VEND}</Text>
    
                    <Text style={styles.cliente}>
                        {item.NOME_CLI.length > 16 ? item.NOME_CLI.slice(0, 16) + "..." : item.NOME_CLI}
                    </Text>
    
                    <Text style={styles.valor}>
                        {UtilitiesService.formatarValor(item.TOTAL_VEN)}
                    </Text>
    
                    <Text style={styles.formaPagamento}>
                        {item.NOME_TPV.startsWith("A PRAZO") ? "A PRAZO" : item.NOME_TPV}
                    </Text>
                </View>
    
                <View style={styles.dateColumn}>
                    <Text style={styles.dataVenda}>{new Date(item.DATA_VEN).toLocaleDateString()}</Text>
                </View>
            </View>
        </TouchableOpacity>
    ));

    const renderItem = useCallback(({ item }: { item: VendaSummary }) => (
        <ItemVenda key={item.COD_VEN} item={item} onPress={() => router.push(`/venda-details?id=${item.COD_VEN}`)} />
    ), [router]);

    

    if (loading && paginaAtual === 1) {
        return <LoadingIndicator />;
    }

    if (error) {
        return <ErrorMessage error={error} />;
    }

    return (
        <View style={styles.container}>
            <View style={{ paddingHorizontal: 20 }}>
                <Text style={styles.title}>Vendas</Text>
            </View>

            <View style={styles.datePickerContainer}>
                <Feather style={{marginRight: 4}} name="calendar" size={20} color={colors.slate[500]} />

                <TouchableOpacity
                    onPress={showDatePickerInicial}
                    style={styles.datePickerElement}
                >
                    <Text style={styles.datePickerLabel}>{dataInicial.toLocaleDateString()}</Text>
                </TouchableOpacity>

                <DateTimePickerModal
                    isVisible={isDatePickerInicialVisible}
                    mode="date"
                    display="inline"
                    date={dataInicial}
                    locale="pt-BR"
                    onConfirm={(date) => {
                        setDataInicial(date);
                        hideDatePickerInicial();
                    }}
                    onCancel={hideDatePickerInicial}
                />

                <Feather name="minus" color={colors.slate[500]} />

                <TouchableOpacity
                    onPress={showDatePickerFinal}
                    style={styles.datePickerElement}
                >
                    <Text style={styles.datePickerLabel}>{dataFinal.toLocaleDateString()}</Text>
                </TouchableOpacity>

                <DateTimePickerModal
                    isVisible={isDatePickerFinalVisible}
                    mode="date"
                    display="inline"
                    locale="pt-BR"
                    date={dataFinal}
                    onConfirm={(date) => {
                        setDataFinal(date);
                        hideDatePickerFinal();
                    }}
                    onCancel={hideDatePickerFinal}
                />
            </View>

            { totalVendas > 0 && (
                <View style={styles.totalResults}>
                    <Feather name="filter" size={20} color={colors.slate[500]} />
                    <Text style={{color: colors.slate[500]}}>{totalVendas} vendas</Text>
                </View>
            ) }

            <FlatList
                data={vendasPaginadas}
                keyExtractor={(item, index) => String(item.COD_VEN) + "_" + index}
                initialNumToRender={20}
                maxToRenderPerBatch={20}
                ListFooterComponent={
                    isFetchingMore ? (
                        <View style={{ padding: 10 }}>
                            <LoadingIndicator />
                        </View>
                    ) : !isCompleted && vendasPaginadas.length > 0 ? (
                        <TouchableOpacity 
                            style={styles.pageButton}
                            onPress={carregarMaisVendas} 
                        >
                            <Feather size={18} color="green" name="plus" />
                        </TouchableOpacity>
                    ) : null
                }
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Nenhuma venda encontrada.</Text>
                    </View>
                )}
                renderItem={renderItem}
            />
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        marginBottom: 12
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
    totalResults: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        marginHorizontal: 20,
        borderRadius: 20,
        gap: 10,
        marginBottom: 12,
    },
    datePickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginHorizontal: 20,
        borderRadius: 20,
        marginBottom: 2
    },
    datePickerElement: {
        padding: 6
    },
    datePickerLabel: {
        fontSize: 15,
        borderWidth: 0.5,
        borderColor: colors.slate[400],
        padding: 5,
        borderRadius: 5,
        backgroundColor: colors.slate[100],
        color: colors.slate[500],
        fontWeight: 500
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingTop: 50,
    },
    emptyText: {
        fontSize: 16,
        color: colors.slate[500],
    },
    vendaCard: {
        flexDirection: 'row',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.slate[200],
    },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
    },
    iconColumn: {
        width: '18%',
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },
    infoColumn: {
        width: '57%',
        justifyContent: 'center',
        gap: 3
    },
    dateColumn: {
        width: '25%',
        justifyContent: 'flex-start',
        alignSelf: 'flex-start'
    },
    iconElement: {
        backgroundColor: colors.emerald[300],
        borderRadius: 999,
        color: colors.slate[900],
        padding: 10
    },
    vendedor: {
        fontWeight: 'bold',
        fontSize: 15,
        color: colors.slate[800]
    },
    cliente: {
        fontSize: 15,
        color: colors.slate[500]
    },
    formaPagamento: {
        fontSize: 12,
        color: colors.slate[500],
        marginTop: 5
    },
    valor: {
        fontSize: 15,
        color: colors.slate[500]
    },
    dataVenda: {
        fontSize: 13,
        color: colors.slate[500]
    },
    pageButton:{
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30
    }
});
