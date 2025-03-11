import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { VendaService } from '@/services/venda-service';
import { colors } from '@/utils/constants/colors';
import { VendaSummary } from '@/models/venda';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ErrorMessage } from '@/components/ErrorMessage';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { useEmpresaCaixa } from '@/context/EmpresaCaixaContext';
import { UtilitiesService } from '@/utils/utilities-service';
import { PageTitle } from '@/components/PageTitle';
import { DatePickerContainer } from '@/components/DatePicker';

export default function Vendas() {
    const [vendasPaginadas, setVendasPaginadas] = useState<VendaSummary[]>([]);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [totalVendas, setTotalVendas] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const { selectedEmpresa } = useEmpresaCaixa();

    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const hoje = new Date();
    const dataInicialPadrao = new Date();
    dataInicialPadrao.setDate(hoje.getDate() - 31);

    const [dataInicial, setDataInicial] = useState(dataInicialPadrao);
    const [dataFinal, setDataFinal] = useState(hoje);


    useEffect(() => {
        setPaginaAtual(1);
        setVendasPaginadas([]);
        setIsCompleted(false);
        fetchVendas(1);
    }, [selectedEmpresa, dataInicial, dataFinal])

    const fetchVendas = async (pagina: number) => {
        if (loading || isFetchingMore) return;

        setLoading(true);
        setError(null);

        if (pagina === 1) {
            setLoading(true);
        } else {
            setIsFetchingMore(true);
        }

        try {
            const vendaService = new VendaService();
            const params = {
                dataInicial: UtilitiesService.formatarData(dataInicial),
                dataFinal: UtilitiesService.formatarData(dataFinal),
                empId: selectedEmpresa?.COD_EMP,
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

    return (
        <View style={styles.container}>
            <View style={{paddingHorizontal: 20}}>
                <PageTitle title="Vendas" size="large" />

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

                {totalVendas > 0 && (
                    <View style={styles.totalResults}>
                        <Feather name="filter" size={22} color={colors.gray[500]} />
                        <Text style={{color: colors.gray[500]}}>{totalVendas} vendas</Text>
                    </View>
                )}
            </View>

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
                            <Feather size={25} color={colors.green[600]} name="plus" />
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
        paddingTop: 50,
        backgroundColor: "#FFF"
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
        borderRadius: 20,
        gap: 10,
        marginBottom: 20,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingTop: 50,
    },
    emptyText: {
        fontSize: 16,
        color: colors.gray[500],
    },
    vendaCard: {
        flexDirection: 'row',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray[200]
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
        justifyContent: 'flex-end',
        alignItems: "flex-end",
        alignSelf: 'flex-start'
    },
    iconElement: {
        backgroundColor: colors.green[500],
        borderRadius: 999,
        color: colors.green[50],
        padding: 10
    },
    vendedor: {
        fontWeight: 'bold',
        fontSize: 15,
        color: colors.gray[800]
    },
    cliente: {
        fontSize: 15,
        color: colors.gray[500]
    },
    formaPagamento: {
        fontSize: 12,
        color: colors.gray[500],
        marginTop: 5
    },
    valor: {
        fontSize: 15,
        color: colors.gray[500]
    },
    dataVenda: {
        fontSize: 13,
        color: colors.gray[500],
        fontWeight: 300
    },
    pageButton:{
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
        backgroundColor: colors.green[100]
    }
});
